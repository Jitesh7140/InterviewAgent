import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs/promises"; // Promise-based fs use karna behtar hai
import askai from "../services/openRouter.service.js"; // .js extension zaroori hai

export const analyzResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filepath = req.file.path;

    // FIX 1: await lagana zaroori hai, varna buffer khali milega
    const filebuffer = await fs.readFile(filepath);
    const unit8Array = new Uint8Array(filebuffer);

    // FIX 2: pdfjsLib loading task
    const loadingTask = pdfjsLib.getDocument({
      data: unit8Array,
      useSystemFonts: true, // Optional: better text extraction
    });
    const pdf = await loadingTask.promise;

    let resumetext = "";

    // FIX 3: PDF pages 1 se start hoti hain, 0 se nahi. 
    // Aur loop 'pageNum <= pdf.numPages' tak chalna chahiye.
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
        content: `Extract structured data from resume. Return strictly JSON:{"role":"string", "experience":"string", "projects": [], "skills":[]}`,
      },
      {
        role: "user",
        content: resumetext,
      },
    ];

    const aiResponse = await askai(message);
    const parsedResponse = JSON.parse(aiResponse);

    // FIX 4: File delete karne ke liye await use karein
    await fs.unlink(filepath);

    return res.status(200).json({
      role: parsedResponse.role,
      experience: parsedResponse.experience,
      projects: parsedResponse.projects,
      skills: parsedResponse.skills,
      resumetext
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
};