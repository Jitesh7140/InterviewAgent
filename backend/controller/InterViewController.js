import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs/promises";
import askai from "../services/openRouter.service.js";
import User from "../model/user.model.js";
import Interview from "../model/interview.model.js";

export const analyzResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const filepath = req.file.path;
    const filebuffer = await fs.readFile(filepath);
    const unit8Array = new Uint8Array(filebuffer);

    const loadingTask = pdfjsLib.getDocument({
      data: unit8Array,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let resumetext = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumetext += pageText + "\n";
    }

    resumetext = resumetext.replace(/\s+/g, " ").trim();

    const message = [
      {
        role: "system",
        // System prompt ko aur strict banaya gaya hai
        content: `You are a resume parser. Extract data and return ONLY a valid JSON object. 
        Do not use markdown blocks or any extra text. 
        Format: {"role":"string", "experience":"string", "projects": [], "skills":[]}  remember projects are only array of strings with main project name only not array of objects `,
      },
      {
        role: "user",
        content: `Extract info from this resume text: ${resumetext}`,
      },
    ];

    const aiResponse = await askai(message);

    // --- FIX: JSON CLEANING LOGIC ---
    // Agar AI ```json ... ``` bhejta hai toh use saaf karna zaroori hai
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw AI Response:", aiResponse);
      throw new Error("AI returned invalid JSON format");
    }

    // File delete karna (Cleaning up)
    await fs.unlink(filepath);

    // Final Response (Front-end iski 'success' property check karta hai)
    return res.status(200).json({
      success: true,
      role: parsedResponse.role || "Not Found",
      experience: parsedResponse.experience || "Not Found",
      projects: parsedResponse.projects || [],
      skills: parsedResponse.skills || [],
      resumeText: resumetext, // Frontend me iska naam 'resumeText' (T capital) ho sakta hai
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Error aane par file phir bhi delete honi chahiye agar exist karti hai
    if (req.file) await fs.unlink(req.file.path).catch(() => {});

    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim(); 
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.credits < 20) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient credits" });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "No resume text provided";

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText},
    Resume:${safeResume}
    `;

    const messages = [
      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askai(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to generate questions" });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.trim())
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to generate questions" });
    }

    user.credits -= 20;
    await user.save();

    const difficulties = ["easy", "easy", "medium", "medium", "hard"];
    const timeLimits = [60, 60, 90, 90, 120];

    const interview = await Interview.create({
      userId: req.userId,
      role,
      experience,
      mode,
      resumeText,
      questions: questionsArray.map((q, index) => ({
        question: q,
        // Index 0 pe easy, index 1 pe easy, etc.
        difficulty: difficulties[index] || "medium",
        timeLimit: timeLimits[index] || 60,
      })),
      status: "incomplete",
    });

    res.status(200).json({
      success: true,
      interviewId: interview._id,
      questions: questionsArray,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate questions" });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    if (!interviewId || questionIndex === undefined || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    // Update specific question with answer and scores
    const question = interview.questions[questionIndex];
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found in interview" });
    }

    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();
      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    //if time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded.";
      question.answer = answer;

      await interview.save();
      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`,
      },
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer}
`,
      },
    ];

    const aiResponse = await askai(messages);

    // Clean up response
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error("JSON Parse Error:", cleanedResponse);
      throw new Error("AI returned invalid JSON");
    }

    // Update question with scores and feedback
    question.answer = answer;
    question.confidence = parsed.confidence || 0;
    question.communication = parsed.communication || 0;
    question.correctness = parsed.correctness || 0;
    question.score = parsed.finalScore || 0;
    question.feedback = parsed.feedback || "";

    await interview.save();

    res.status(200).json({
      success: true,
      feedback: question.feedback,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit answer" });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score;
      totalConfidence += q.confidence;
      totalCommunication += q.communication;
      totalCorrectness += q.correctness;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";
    await interview.save();

    res.status(200).json({
      success: true,
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScores: interview.questions.map((q) => ({
        question: q.question,
        score: q.score,
        feedback: q.feedback,
        confidence: q.confidence,
        communication: q.communication,
        correctness: q.correctness,
      })),
    });
  } catch (error) {
    console.error("Error finishing interview:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to finish interview" });
  }
};
