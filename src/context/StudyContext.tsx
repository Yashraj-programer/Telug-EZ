import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SpacedItem, LessonData } from '../types';
import { LESSON_1_DATA } from '../data/lesson1';

export type ActiveTab =
  | 'home'
  | 'learn'
  | 'padyam'
  | 'kavi'
  | 'answer_builder'
  | 'decoder'
  | 'make_ez'
  | 'revise'
  | 'practice'
  | 'progress'
  | 'emergency';

interface StudyContextType {
  lesson: LessonData;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
  pageRatings: Record<number, 'got_it' | 'kinda' | 'dont_get_it'>;
  setPageRating: (pageNum: number, rating: 'got_it' | 'kinda' | 'dont_get_it') => void;
  completedPages: number[];
  markPageCompleted: (pageNum: number) => void;
  
  // Gamification
  xp: number;
  addXP: (amount: number, reason?: string) => void;
  streak: number;
  recentXPGain: { amount: number; reason: string } | null;

  // Padyam & Kavi
  selectedPadyamId: string;
  setSelectedPadyamId: (id: string) => void;
  completedPadyams: string[];
  markPadyamCompleted: (id: string) => void;
  kaviQuizCompleted: boolean;
  setKaviQuizCompleted: (val: boolean) => void;

  // Answer builder
  selectedQuestionId: string;
  setSelectedQuestionId: (id: string) => void;
  savedAnswers: Record<string, { answer: string; score: string; date: string }>;
  saveStudentAnswer: (questionId: string, answer: string, score: string) => void;

  // Spaced Revision & Weak items
  spacedQueue: SpacedItem[];
  markItemReviewed: (id: string, success: boolean) => void;
  weakTopics: string[];
  addWeakTopic: (topic: string) => void;
  removeWeakTopic: (topic: string) => void;

  // Ask AI Modal trigger
  aiModalOpen: boolean;
  openAiModal: (contextText?: string, initialQuestion?: string) => void;
  closeAiModal: () => void;
  aiModalContext: { contextText: string; initialQuestion?: string };

  // Quick stats
  overallReadiness: number;
  resetProgress: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const INITIAL_SPACED_ITEMS: SpacedItem[] = [
  {
    id: 'rev-p1',
    type: 'page',
    title: 'పుట 1: యమునా తీర ప్రయాణం & ఆకలి',
    description: 'ఎండ తీవ్రత వల్ల బాలురకు ఆకలి వేయడం.',
    intervalStage: 'today',
    dueTime: Date.now() - 1000,
    repetitions: 1,
    easeFactor: 2.5,
    isWeak: false,
  },
  {
    id: 'rev-pad1',
    type: 'padyam',
    title: 'పద్యం 1: తామరపువ్వు కర్ణిక ఉపమానం',
    description: 'రండని ముందట నిలిచి... తామర రేకుల వలె గోపబాలురు.',
    intervalStage: 'today',
    dueTime: Date.now() - 1000,
    repetitions: 0,
    easeFactor: 2.1,
    isWeak: true,
  },
  {
    id: 'rev-kavi',
    type: 'kavi',
    title: 'బమ్మెర పోతన కవి పరిచయం (15వ శతాబ్దం)',
    description: 'జన్మస్థలం బమ్మెర, రచన భాగవతం, బిరుదు సహజ పండితుడు.',
    intervalStage: 'tomorrow',
    dueTime: Date.now() + 86400000,
    repetitions: 2,
    easeFactor: 2.5,
    isWeak: false,
  },
  {
    id: 'rev-q1',
    type: 'question',
    title: 'శ్రీకృష్ణుడు మిత్రులను భోజనానికి ఎందుకు పిలిచాడు?',
    description: 'ఎండ తీవ్రత, తీవ్రమైన ఆకలి, చల్దుల మూటలు విప్పడం.',
    intervalStage: '3days',
    dueTime: Date.now() + 86400000 * 3,
    repetitions: 3,
    easeFactor: 2.6,
    isWeak: false,
  },
  {
    id: 'rev-vocab-chaldi',
    type: 'vocab',
    title: 'చల్ది / చల్దులు అర్థం',
    description: 'చద్దన్నము (రాత్రి మిగిలిన పెరుగు లేదా నీళ్ల అన్నం).',
    intervalStage: 'examReady',
    dueTime: Date.now() + 86400000 * 7,
    repetitions: 4,
    easeFactor: 2.8,
    isWeak: false,
  },
  {
    id: 'rev-gram-guna',
    type: 'grammar',
    title: 'గుణ సంధి సూత్రం & ఉదాహరణలు',
    description: 'అ-కారమునకు ఇ, ఉ, ఋ లు పరమైనప్పుడు ఏ, ఓ, అర్ లు అగును.',
    intervalStage: 'today',
    dueTime: Date.now() - 500,
    repetitions: 1,
    easeFactor: 2.2,
    isWeak: true,
  },
];

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [pageRatings, setPageRatings] = useState<Record<number, 'got_it' | 'kinda' | 'dont_get_it'>>(() => {
    try {
      const saved = localStorage.getItem('teluguez_page_ratings');
      return saved ? JSON.parse(saved) : { 1: 'got_it' };
    } catch {
      return { 1: 'got_it' };
    }
  });

  const [completedPages, setCompletedPages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('teluguez_completed_pages');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('teluguez_xp');
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [streak] = useState<number>(3);
  const [recentXPGain, setRecentXPGain] = useState<{ amount: number; reason: string } | null>(null);

  const [selectedPadyamId, setSelectedPadyamId] = useState<string>('pad-1');
  const [completedPadyams, setCompletedPadyams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('teluguez_completed_padyams');
      return saved ? JSON.parse(saved) : ['pad-1'];
    } catch {
      return ['pad-1'];
    }
  });

  const [kaviQuizCompleted, setKaviQuizCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('teluguez_kavi_completed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('q-1');
  const [savedAnswers, setSavedAnswers] = useState<Record<string, { answer: string; score: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('teluguez_saved_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [spacedQueue, setSpacedQueue] = useState<SpacedItem[]>(() => {
    try {
      const saved = localStorage.getItem('teluguez_spaced_queue');
      return saved ? JSON.parse(saved) : INITIAL_SPACED_ITEMS;
    } catch {
      return INITIAL_SPACED_ITEMS;
    }
  });

  const [weakTopics, setWeakTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('teluguez_weak_topics');
      return saved ? JSON.parse(saved) : ['తామరపువ్వు కర్ణిక భావం', 'గుణ సంధి సూత్రం'];
    } catch {
      return ['తామరపువ్వు కర్ణిక భావం', 'గుణ సంధి సూత్రం'];
    }
  });

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalContext, setAiModalContext] = useState<{ contextText: string; initialQuestion?: string }>({
    contextText: '',
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('teluguez_page_ratings', JSON.stringify(pageRatings));
  }, [pageRatings]);

  useEffect(() => {
    localStorage.setItem('teluguez_completed_pages', JSON.stringify(completedPages));
  }, [completedPages]);

  useEffect(() => {
    localStorage.setItem('teluguez_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('teluguez_completed_padyams', JSON.stringify(completedPadyams));
  }, [completedPadyams]);

  useEffect(() => {
    localStorage.setItem('teluguez_kavi_completed', JSON.stringify(kaviQuizCompleted));
  }, [kaviQuizCompleted]);

  useEffect(() => {
    localStorage.setItem('teluguez_saved_answers', JSON.stringify(savedAnswers));
  }, [savedAnswers]);

  useEffect(() => {
    localStorage.setItem('teluguez_spaced_queue', JSON.stringify(spacedQueue));
  }, [spacedQueue]);

  useEffect(() => {
    localStorage.setItem('teluguez_weak_topics', JSON.stringify(weakTopics));
  }, [weakTopics]);

  const addXP = (amount: number, reason: string = 'Progress updated') => {
    setXp((prev) => prev + amount);
    setRecentXPGain({ amount, reason });
    setTimeout(() => {
      setRecentXPGain(null);
    }, 3000);
  };

  const setPageRating = (pageNum: number, rating: 'got_it' | 'kinda' | 'dont_get_it') => {
    setPageRatings((prev) => ({ ...prev, [pageNum]: rating }));
    if (rating === 'got_it') {
      addXP(15, `పుట ${pageNum} సంపూర్ణంగా అర్థమైంది! (+15 XP)`);
    } else if (rating === 'kinda') {
      addXP(10, `పుట ${pageNum} సమీక్ష (+10 XP)`);
    } else {
      addXP(5, `ప్రయత్నించినందుకు (+5 XP)`);
    }
  };

  const markPageCompleted = (pageNum: number) => {
    if (!completedPages.includes(pageNum)) {
      setCompletedPages((prev) => [...prev, pageNum]);
      addXP(20, `పుట ${pageNum} పూర్తి చేశారు! (+20 XP)`);
    }
  };

  const markPadyamCompleted = (id: string) => {
    if (!completedPadyams.includes(id)) {
      setCompletedPadyams((prev) => [...prev, id]);
      addXP(25, 'పద్యం రీకాల్ పూర్తి! (+25 XP)');
    }
  };

  const saveStudentAnswer = (questionId: string, answer: string, score: string) => {
    setSavedAnswers((prev) => ({
      ...prev,
      [questionId]: { answer, score, date: new Date().toLocaleDateString() },
    }));
    addXP(30, 'సమాధాన నిర్మాణం పూర్తి! (+30 XP)');
  };

  const markItemReviewed = (id: string, success: boolean) => {
    setSpacedQueue((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStage: 'today' | 'tomorrow' | '3days' | 'examReady' = success
          ? item.intervalStage === 'today'
            ? 'tomorrow'
            : item.intervalStage === 'tomorrow'
            ? '3days'
            : 'examReady'
          : 'today';

        return {
          ...item,
          intervalStage: nextStage,
          repetitions: item.repetitions + 1,
          isWeak: !success,
          dueTime: success ? Date.now() + 86400000 * 2 : Date.now() + 3600000,
        };
      })
    );
    addXP(success ? 15 : 5, success ? 'రివిజన్ విజయవంతం! (+15 XP)' : 'రివిజన్ సమీక్ష (+5 XP)');
  };

  const addWeakTopic = (topic: string) => {
    if (!weakTopics.includes(topic)) {
      setWeakTopics((prev) => [...prev, topic]);
    }
  };

  const removeWeakTopic = (topic: string) => {
    setWeakTopics((prev) => prev.filter((t) => t !== topic));
  };

  const openAiModal = (contextText?: string, initialQuestion?: string) => {
    setAiModalContext({
      contextText: contextText || LESSON_1_DATA.pages[currentPageIndex]?.originalText || LESSON_1_DATA.summaryTelugu,
      initialQuestion,
    });
    setAiModalOpen(true);
  };

  const closeAiModal = () => {
    setAiModalOpen(false);
  };

  const resetProgress = () => {
    setCompletedPages([1]);
    setPageRatings({ 1: 'got_it' });
    setCompletedPadyams([]);
    setKaviQuizCompleted(false);
    setSavedAnswers({});
    setSpacedQueue(INITIAL_SPACED_ITEMS);
    setWeakTopics(['తామరపువ్వు కర్ణిక భావం', 'గుణ సంధి సూత్రం']);
  };

  // Calculate readiness metric: weighted combination of pages, padyams, questions, kavi
  const pageWeight = (completedPages.length / LESSON_1_DATA.pages.length) * 35;
  const padyamWeight = (completedPadyams.length / LESSON_1_DATA.padyams.length) * 25;
  const questionWeight = (Object.keys(savedAnswers).length / LESSON_1_DATA.questions.length) * 25;
  const kaviWeight = kaviQuizCompleted ? 15 : 5;
  const overallReadiness = Math.min(100, Math.round(pageWeight + padyamWeight + questionWeight + kaviWeight));

  return (
    <StudyContext.Provider
      value={{
        lesson: LESSON_1_DATA,
        activeTab,
        setActiveTab,
        currentPageIndex,
        setCurrentPageIndex,
        pageRatings,
        setPageRating,
        completedPages,
        markPageCompleted,
        xp,
        addXP,
        streak,
        recentXPGain,
        selectedPadyamId,
        setSelectedPadyamId,
        completedPadyams,
        markPadyamCompleted,
        kaviQuizCompleted,
        setKaviQuizCompleted,
        selectedQuestionId,
        setSelectedQuestionId,
        savedAnswers,
        saveStudentAnswer,
        spacedQueue,
        markItemReviewed,
        weakTopics,
        addWeakTopic,
        removeWeakTopic,
        aiModalOpen,
        openAiModal,
        closeAiModal,
        aiModalContext,
        overallReadiness,
        resetProgress,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
