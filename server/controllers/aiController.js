import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Resume and Job Description are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an ATS Resume Analyzer.

Compare the following resume with the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this format:

{
  "score": 85,
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "missingSkills": [
    "...",
    "..."
  ],
  "summary": "..."
}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    res.json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};