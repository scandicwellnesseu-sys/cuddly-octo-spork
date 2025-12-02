import { Injectable } from '@nestjs/common';

export interface SeoAnalysisInput {
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
}

export interface SeoAnalysisResult {
  score: number;
  breakdown: {
    titleScore: number;
    descriptionScore: number;
    metaScore: number;
    keywordDensity: number;
    readability: number;
  };
  suggestions: string[];
}

@Injectable()
export class SeoService {
  /**
   * Beräkna SEO-poäng för innehåll
   */
  calculateSeoScore(input: SeoAnalysisInput): number {
    let score = 0;
    const maxScore = 100;

    // Titelanalys (25 poäng)
    const titleLength = input.title?.length || 0;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 25;
    } else if (titleLength > 0) {
      score += Math.max(5, 25 - Math.abs(45 - titleLength) / 2);
    }

    // Beskrivningsanalys (25 poäng)
    const descLength = input.description?.length || 0;
    if (descLength >= 300 && descLength <= 1500) {
      score += 25;
    } else if (descLength > 0) {
      score += Math.max(5, 25 - Math.abs(800 - descLength) / 100);
    }

    // Meta-beskrivning (20 poäng)
    const metaLength = input.metaDescription?.length || 0;
    if (metaLength >= 120 && metaLength <= 160) {
      score += 20;
    } else if (metaLength > 0) {
      score += Math.max(5, 20 - Math.abs(140 - metaLength) / 5);
    }

    // Nyckelordsdensitet (15 poäng)
    const keywordDensity = this.calculateKeywordDensity(input.description, input.keywords);
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      score += 15;
    } else if (keywordDensity > 0) {
      score += Math.max(3, 15 - Math.abs(2 - keywordDensity) * 5);
    }

    // Läsbarhet (15 poäng)
    const readabilityScore = this.calculateReadabilityScore(input.description);
    score += Math.round(readabilityScore * 0.15);

    return Math.min(maxScore, Math.round(score));
  }

  /**
   * Beräkna nyckelordsdensitet i procent
   */
  calculateKeywordDensity(text: string, keywords: string[]): number {
    if (!text || !keywords.length) return 0;

    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;

    if (totalWords === 0) return 0;

    let keywordCount = 0;
    const lowerKeywords = keywords.map((k) => k.toLowerCase());

    for (const word of words) {
      if (lowerKeywords.some((kw) => word.includes(kw))) {
        keywordCount++;
      }
    }

    return (keywordCount / totalWords) * 100;
  }

  /**
   * Beräkna läsbarhetspoäng (0-100)
   */
  private calculateReadabilityScore(text: string): number {
    if (!text) return 0;

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const syllables = this.countSyllables(text);

    if (sentences.length === 0 || words.length === 0) return 50;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease (anpassad för svenska)
    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    // Normalisera till 0-100
    return Math.max(0, Math.min(100, fleschScore));
  }

  /**
   * Räkna stavelser i text
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;

    for (const word of words) {
      // Enkel stavelsräkning för svenska
      const matches = word.match(/[aeiouyåäö]+/gi);
      count += matches ? matches.length : 1;
    }

    return count;
  }

  /**
   * Beräkna läsbarhetsbetyg (A-F)
   */
  calculateReadability(text: string): string {
    const score = this.calculateReadabilityScore(text);

    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score >= 50) return 'E';
    return 'F';
  }

  /**
   * Analysera sentiment i text
   */
  analyzeSentiment(text: string): { score: number; label: string } {
    const positiveWords = [
      'bra',
      'utmärkt',
      'fantastisk',
      'kvalitet',
      'premium',
      'perfekt',
      'underbar',
      'härlig',
      'elegant',
      'smidig',
      'modern',
      'innovativ',
      'hållbar',
      'ekologisk',
      'naturlig',
    ];

    const negativeWords = ['dålig', 'billig', 'bristfällig', 'problem', 'fel', 'saknas'];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of words) {
      if (positiveWords.some((pw) => word.includes(pw))) positiveCount++;
      if (negativeWords.some((nw) => word.includes(nw))) negativeCount++;
    }

    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords === 0) {
      return { score: 0.5, label: 'neutral' };
    }

    const score = positiveCount / totalSentimentWords;

    let label = 'neutral';
    if (score > 0.6) label = 'positive';
    if (score < 0.4) label = 'negative';

    return { score, label };
  }

  /**
   * Få SEO-förslag för förbättring
   */
  getSuggestions(input: SeoAnalysisInput): string[] {
    const suggestions: string[] = [];

    const titleLength = input.title?.length || 0;
    if (titleLength < 30) {
      suggestions.push('Utöka titeln till minst 30 tecken för bättre SEO');
    } else if (titleLength > 60) {
      suggestions.push('Korta ner titeln till max 60 tecken för att undvika trunkering');
    }

    const metaLength = input.metaDescription?.length || 0;
    if (metaLength < 120) {
      suggestions.push('Utöka meta-beskrivningen till minst 120 tecken');
    } else if (metaLength > 160) {
      suggestions.push('Korta ner meta-beskrivningen till max 160 tecken');
    }

    const keywordDensity = this.calculateKeywordDensity(input.description, input.keywords);
    if (keywordDensity < 1) {
      suggestions.push('Öka användningen av nyckelord i beskrivningen');
    } else if (keywordDensity > 3) {
      suggestions.push('Minska nyckelordsdensiteten för att undvika keyword stuffing');
    }

    const readability = this.calculateReadability(input.description);
    if (readability === 'E' || readability === 'F') {
      suggestions.push('Förenkla meningsstrukturen för bättre läsbarhet');
    }

    return suggestions;
  }

  /**
   * Fullständig SEO-analys
   */
  analyzeContent(input: SeoAnalysisInput): SeoAnalysisResult {
    const titleLength = input.title?.length || 0;
    const metaLength = input.metaDescription?.length || 0;

    const titleScore = titleLength >= 30 && titleLength <= 60 ? 100 : Math.max(0, 100 - Math.abs(45 - titleLength) * 2);
    const descriptionScore = this.calculateReadabilityScore(input.description);
    const metaScore = metaLength >= 120 && metaLength <= 160 ? 100 : Math.max(0, 100 - Math.abs(140 - metaLength));
    const keywordDensity = this.calculateKeywordDensity(input.description, input.keywords);
    const readability = this.calculateReadabilityScore(input.description);

    return {
      score: this.calculateSeoScore(input),
      breakdown: {
        titleScore,
        descriptionScore,
        metaScore,
        keywordDensity,
        readability,
      },
      suggestions: this.getSuggestions(input),
    };
  }
}
