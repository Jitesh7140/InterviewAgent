import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs/promises";
import askai from "../services/openRouter.service.js";

export const analyzResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
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
      resumeText: resumetext // Frontend me iska naam 'resumeText' (T capital) ho sakta hai
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Error aane par file phir bhi delete honi chahiye agar exist karti hai
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    
    res.status(500).json({ success: false, message: error.message || "Failed to analyze resume" });
  }
};