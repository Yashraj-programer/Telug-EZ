import {
  MakeEzResponse,
  CheckAnswerResponse,
  QuestionDecoderResponse,
  DoubtResponse,
} from '../server/aiService';

export async function requestMakeEz(text: string, context?: string): Promise<MakeEzResponse> {
  try {
    const res = await fetch('/api/ai/make-ez', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, context }),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local Make EZ processor:', err);
    return {
      originalTelugu: text,
      teenglish:
        'Simplified Teenglish explanation: Krishna and his gopa friends sitting together happily along Yamuna riverbank, sharing their curd rice.',
      englishMeaning:
        'Sri Krishna and his companions relish cold curd rice (chaldulu) under the cool shade of trees in a lotus-like concentric formation.',
      coreIdea: 'మిత్రులందరూ ఒకే చోట కూర్చుని ప్రేమతో భోజనం చేయడం మరియు స్నేహ భావం చాటడం.',
      keywords: ['యమునా తీరం', 'చల్దులు', 'తామరపువ్వు రేకులు', 'ఆనందం', 'సమభావం'],
      examMeaning:
        'పరీక్షలో రాయడానికి: కృష్ణుడు గోపబాలురతో సమానంగా కూర్చుని భోజనం చేసి, స్నేహంలో హెచ్చుతగ్గులు లేవని నిరూపించాడు.',
      isAiGenerated: false,
    };
  }
}

export async function requestCheckAnswer(params: {
  questionTelugu: string;
  expectedKeyPoints: string[];
  studentAnswer: string;
  marks: number;
}): Promise<CheckAnswerResponse> {
  try {
    const res = await fetch('/api/ai/check-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local Answer Checker:', err);
    const cleaned = params.studentAnswer.toLowerCase();
    const hitCount = params.expectedKeyPoints.filter((kp) => {
      const words = kp.split(/\s+/).filter((w) => w.length > 2);
      return words.some((w) => cleaned.includes(w.toLowerCase()));
    }).length;

    const fraction = params.expectedKeyPoints.length ? hitCount / params.expectedKeyPoints.length : 0.75;
    const est = Math.max(1, Math.round(fraction * params.marks * 2) / 2).toFixed(1);

    return {
      mainIdea: {
        status: fraction >= 0.5 ? 'correct' : 'partial',
        comment:
          fraction >= 0.5
            ? 'ప్రధాన భావం సరిగ్గా రాశారు! (Main concept is captured well)'
            : 'భావం కొద్దిగా మరింత స్పష్టంగా ఉండాలి (Express the core idea more clearly)',
      },
      keyPoints: params.expectedKeyPoints.map((pt) => ({
        point: pt,
        matched: cleaned.length > 20,
      })),
      language: {
        status: 'good',
        comment: 'సరళమైన తెలుగులో అర్థమయ్యేలా రాశారు. పరీక్షకు అనుకూలం.',
      },
      structure: {
        status: 'good',
        comment: 'ముఖ్య అంశాల క్రమం బాగుంది.',
      },
      suggestedImprovement:
        'మరిన్ని మార్కుల కోసం తామరపువ్వు రేకుల ఉపమానం మరియు స్నేహ సమభావాన్ని కూడా చేర్చండి.',
      scoreEstimate: `${est} / ${params.marks} మార్కులు`,
      isAiGenerated: false,
    };
  }
}

export async function requestQuestionDecoder(questionText: string): Promise<QuestionDecoderResponse> {
  try {
    const res = await fetch('/api/ai/question-decoder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionText }),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local Question Decoder:', err);
    return {
      originalQuestion: questionText,
      triggerWord: 'వివరణాత్మక ప్రశ్న (Explanatory Question)',
      questionType: 'స్వీయరచన',
      meaningInEnglish: 'Explain the core theme, setting, action, and takeaway message in organized points.',
      teenglishExplanation: 'Focus on 3 key points: 1. Place & Setting, 2. Main Action/Lotus circle, 3. Friendship message.',
      examinerExpectation: ['ముఖ్య భావం', 'ఉపమానాలు', 'స్పష్టమైన ముగింపు'],
      recommendedMarksStrategy: 'బుల్లెట్ పాయింట్లుగా రాసి ముఖ్య పదాలను అండర్‌లైన్ చేయండి.',
      isAiGenerated: false,
    };
  }
}

export async function requestDoubt(question: string, contextText: string): Promise<DoubtResponse> {
  try {
    const res = await fetch('/api/ai/doubt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, contextText }),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local Doubt solver:', err);
    return {
      answerTelugu:
        'శ్రీకృష్ణుడు మరియు గోపబాలురు యమునా తీరంలో తామరపువ్వు రేకుల వలె వృత్తాకారంలో కూర్చొని చద్దన్నం ప్రేమతో తిన్నారు.',
      answerTeenglish:
        'Core point: Krishna sat in the center like a lotus seed-pod (karnika). All his friends sat in circles around him like lotus petals, eating curd rice with laughing banter.',
      answerEnglish:
        'The central theme is divine companionship and equality: everyone sat together like petals of a lotus, sharing food without discrimination.',
      quickTakeaway: 'కీలక భావన: కమల కర్ణిక (Lotus center) & చల్దులు (Curd rice).',
      isAiGenerated: false,
    };
  }
}
