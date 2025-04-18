import { groupedKeywordDict } from './jobCategoryMatcher';

export interface ResumeInsights {
  keywordMatch: number;
  missingKeywords: string[];
  missingByGroup: Record<string, string[]>;
  groupBreakdown: Record<string, number>;
  groupVisual: Record<string, string>;
}

export const analyzeResumeByCategory = (
  resumeText: string,
  categoryName: string
): ResumeInsights => {
  const textLower = resumeText.toLowerCase();
  const result: ResumeInsights = {
    keywordMatch: 0,
    missingKeywords: [],
    missingByGroup: {},
    groupBreakdown: {},
    groupVisual: {}
  };

  const groupedKeywords = groupedKeywordDict[categoryName];
  if (!groupedKeywords) return result;

  let totalMatched = 0;
  let totalKeywords = 0;

  for (const [group, keywords] of Object.entries(groupedKeywords)) {
    if (!Array.isArray(keywords)) continue;

    const groupMissing: string[] = [];
    let groupMatched = 0;

    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        groupMatched += 1;
      } else {
        groupMissing.push(keyword);
        result.missingKeywords.push(keyword);
      }
    }

    result.groupBreakdown[group] = groupMatched / keywords.length;
    result.groupVisual[group] = groupMatched > 0 ? '✅' : '❌';
    result.missingByGroup[group] = groupMissing;

    totalMatched += groupMatched;
    totalKeywords += keywords.length;
  }

  result.keywordMatch = totalKeywords > 0 ? Math.round((totalMatched / totalKeywords) * 100) : 0;

  return result;
};
