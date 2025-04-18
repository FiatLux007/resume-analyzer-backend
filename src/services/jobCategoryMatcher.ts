import path from 'path';
import fs from 'fs';

export interface GroupedCategoryKeywords {
  [groupName: string]: string[];
}

export interface GroupedCategoryDict {
  [category: string]: GroupedCategoryKeywords;
}

const groupedKeywordsPath = path.join(__dirname, '..', 'data', 'enhancedJobCategoryKeywords.json');
const groupedRaw = fs.readFileSync(groupedKeywordsPath, 'utf-8');
const groupedKeywordDict: GroupedCategoryDict = JSON.parse(groupedRaw);

export function matchTopCategory(jobKeywords: string[]): string {
  const jobKeywordsLower = jobKeywords.map(k => k.toLowerCase());

  const scores: { name: string; score: number }[] = [];

  for (const [category, groups] of Object.entries(groupedKeywordDict)) {
    let matchCount = 0;
    let totalKeywords = 0;

    for (const keywords of Object.values(groups)) {
      if (!Array.isArray(keywords)) continue;
      const keywordsLower = keywords.map(k => k.toLowerCase());
      matchCount += keywordsLower.filter(k => jobKeywordsLower.includes(k)).length;
      totalKeywords += keywordsLower.length;
    }

    const score = totalKeywords > 0 ? matchCount / totalKeywords : 0;
    scores.push({ name: category, score });
  }

  // Return name of top scoring category
  return scores.sort((a, b) => b.score - a.score)[0]?.name || '';
}


export { groupedKeywordDict };
