import { Request, Response } from 'express';
import pdfParse from 'pdf-parse';
import { analyzeResumeByCategory } from '../services/resumeAnalyzer';
import { matchTopCategory } from '../services/jobCategoryMatcher';

export const analyzeResume = (req: Request, res: Response) => {
  const { resumeText, jobDescriptionText } = req.body;

  if (!resumeText || !jobDescriptionText) {
    return res.status(400).json({ error: 'Missing resumeText or jobDescriptionText' });
  }

  // ✅ 提取 JD 中的关键词
  const jobWords = jobDescriptionText
    .split(/[\s,.;:\n\r(){}\[\]<>!@#$%^&*+=~\\/?|'"`]+/)
    .map((word: string) => word.trim().toLowerCase())
    .filter((word: string) => word.length > 1);

  const uniqueJobKeywords: string[] = [...new Set<string>(jobWords)];

  // ✅ Step 1：匹配出 Top 1 类别
  const topCategory = matchTopCategory(uniqueJobKeywords);

  // ✅ Step 2：用该类别分析简历内容
  const insights = analyzeResumeByCategory(resumeText, topCategory);

  return res.json({
    message: 'Resume analysis complete!',
    recommendedCategory: topCategory,
    insights
  });
};

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { jobDescriptionText } = req.body;

    if (!file || !jobDescriptionText) {
      return res.status(400).json({ error: 'Missing file or job description text' });
    }

    const data = await pdfParse(file.buffer);
    const extractedText = data.text;

    // 👇 Inject parsed text to request body
    req.body.resumeText = extractedText;

    // 👇 Reuse existing analysis function
    return analyzeResume(req, res);
  } catch (err) {
    console.error('[❌ PDF Parse Error]', err);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
};
