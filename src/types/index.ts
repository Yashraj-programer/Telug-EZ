export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface PageRecallQuestion {
  id: string;
  question: string;
  questionTeenglish?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface LessonPage {
  pageNumber: number;
  title: string;
  teluguHeading: string;
  originalText: string;
  teenglish: string;
  englishMeaning: string;
  coreIdea: string;
  keywords: string[];
  memoryChain: string[];
  kindaExplanation?: {
    simpleNote: string;
    quickCheck: string;
  };
  dontGetItExplanation?: {
    simplifiedTelugu: string;
    teenglishBreakdown: string;
    realLifeAnalogy: string;
    examTip: string;
  };
  recallQuestions: PageRecallQuestion[];
}

export interface PadyamItem {
  id: string;
  number: number;
  title: string;
  meter: string; // e.g. ఉత్పలమాల, చంపకమాల, తేటగీతి
  originalPadyam: string;
  simpleMeaning: string;
  teenglish: string;
  englishMeaning: string;
  keywords: string[];
  memoryChain: string[];
  recallTriggers: {
    prompt: string;
    blanks: { index: number; trigger: string; isBlank: boolean }[];
  };
  examMeaning: string;
}

export interface KaviParichayamData {
  kaviName: string;
  kaalam: string;
  janmasthalam: string;
  thallidandrulu: string;
  rachanala: string[];
  specialIdentity: string;
  memoryCode: {
    label: string;
    value: string;
    teenglish: string;
  }[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    tip: string;
  }[];
  fullExamAnswer: string;
}

export interface TextbookQuestion {
  id: string;
  questionTelugu: string;
  questionTeenglish: string;
  questionEnglish: string;
  questionType: 'స్వీయరచన (2 మార్కులు)' | 'స్వీయరచన (4 మార్కులు)' | 'వ్యాసరూప సమాధానం (8 మార్కులు)' | 'భావం / తాత్పర్యం';
  marks: number;
  expectedKeyPoints: string[];
  keywords: string[];
  memoryTriggers: string[];
  answerSkeleton: string[];
  modelAnswer: string;
  teenglishModelAnswer: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  teluguMeaning: string;
  englishMeaning: string;
  category: 'కఠిన పదాలు' | 'ప్రకృతి - వికృతి' | 'పర్యాయపదాలు' | 'నానార్థాలు';
  vikruthiOrSynonym?: string;
  exampleSentence?: string;
}

export interface GrammarItem {
  id: string;
  title: string;
  category: 'సంధులు' | 'సమాసాలు' | 'విభక్తులు' | 'వాక్య రకాలు';
  ruleTelugu: string;
  ruleEnglish: string;
  teenglishRule: string;
  examples: {
    word: string;
    split: string;
    explanation: string;
  }[];
}

export interface LessonData {
  id: string;
  title: string;
  lessonNumber: number;
  class: number;
  board: string;
  subject: string;
  author: string;
  summaryTelugu: string;
  summaryEnglish: string;
  pages: LessonPage[];
  padyams: PadyamItem[];
  questions: TextbookQuestion[];
  vocabulary: VocabularyItem[];
  grammar: GrammarItem[];
  kaviParichayam: KaviParichayamData;
}

export interface SpacedItem {
  id: string;
  type: 'page' | 'padyam' | 'question' | 'vocab' | 'kavi' | 'grammar';
  title: string;
  description: string;
  intervalStage: 'today' | 'tomorrow' | '3days' | 'examReady';
  dueTime: number; // timestamp
  repetitions: number;
  easeFactor: number;
  isWeak: boolean;
}

export interface AnswerEvaluation {
  mainIdea: {
    status: 'correct' | 'partial' | 'missing';
    comment: string;
  };
  keyPoints: {
    point: string;
    matched: boolean;
  }[];
  language: {
    status: 'good' | 'minor_issues' | 'needs_work';
    comment: string;
  };
  structure: {
    status: 'good' | 'adequate' | 'incomplete';
    comment: string;
  };
  suggestedImprovement: string;
  scoreEstimate: string; // e.g. "3.5 / 4 Marks"
}
