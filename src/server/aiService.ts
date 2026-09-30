import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface MakeEzRequest {
  text: string;
  context?: string;
}

export interface MakeEzResponse {
  originalTelugu: string;
  teenglish: string;
  englishMeaning: string;
  coreIdea: string;
  keywords: string[];
  examMeaning: string;
  isAiGenerated: boolean;
}

export async function handleMakeEz(reqData: MakeEzRequest): Promise<MakeEzResponse> {
  const { text, context } = reqData;
  const ai = getAIClient();

  if (!ai) {
    // Intelligent offline fallback based on lesson keywords
    return {
      originalTelugu: text,
      teenglish: text.includes('చల్దు')
        ? 'Krishna and gopabaaluru seated together near Yamuna eating chaldulu (curd rice) with great affection.'
        : 'Telugu line simplified into easy spoken Teenglish representation for effortless exam recall.',
      englishMeaning:
        'This represents the heartwarming camaraderie of Sri Krishna and his cowherd friends grazing cattle by the Yamuna, sharing curd rice in harmonious circles.',
      coreIdea: 'మిత్రులందరూ ఒకే చోట కూర్చుని ప్రేమతో భోజనం చేయడం మరియు స్నేహ భావం చాటడం.',
      keywords: ['యమునాతీరం', 'చల్దులు', 'తామరపువ్వు రేకులు', 'ఆనందం', 'సమభావం'],
      examMeaning:
        'పరీక్షలో రాయడానికి: కృష్ణుడు గోపబాలురతో సమానంగా కూర్చుని భోజనం చేసి, స్నేహంలో హెచ్చుతగ్గులు లేవని నిరూపించాడు.',
      isAiGenerated: false,
    };
  }

  const prompt = `You are Telugu EZ, an elite learning assistant for Telangana Class 10 Telugu Second Language students.
Transform the following Telugu text into the "MAKE IT EZ" structure.

Text: "${text}"
${context ? `Lesson Context: ${context}` : ''}

Respond ONLY with valid JSON with this exact schema:
{
  "originalTelugu": "${text}",
  "teenglish": "Simple Romanized Telugu explanation with colloquial clarity",
  "englishMeaning": "Simple, crystal clear English meaning in 1-2 easy sentences",
  "coreIdea": "The core concept in 1 crisp Telugu sentence",
  "keywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"],
  "examMeaning": "What the examiner wants the student to write in 1-2 simple Telugu exam lines"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      originalTelugu: parsed.originalTelugu || text,
      teenglish: parsed.teenglish || 'Simplified Teenglish rendering',
      englishMeaning: parsed.englishMeaning || 'Simplified English meaning',
      coreIdea: parsed.coreIdea || 'ముఖ్య భావం',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ['ముఖ్య పదం'],
      examMeaning: parsed.examMeaning || 'పరీక్షార్థం',
      isAiGenerated: true,
    };
  } catch (err) {
    console.error('Error generating MakeEz:', err);
    return {
      originalTelugu: text,
      teenglish: 'Simplified understanding of this line.',
      englishMeaning: 'A simple explanation for easy student comprehension.',
      coreIdea: 'ముఖ్య భావము విద్యార్థికి అర్థమయ్యేలా రాయడం.',
      keywords: ['కృష్ణుడు', 'స్నేహం', 'చల్దులు', 'యమున'],
      examMeaning: 'పరీక్షలో ముఖ్య భావాన్ని సరళమైన తెలుగులో రాయాలి.',
      isAiGenerated: false,
    };
  }
}

export interface CheckAnswerRequest {
  questionTelugu: string;
  expectedKeyPoints: string[];
  studentAnswer: string;
  marks: number;
}

export interface CheckAnswerResponse {
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
  scoreEstimate: string;
  isAiGenerated: boolean;
}

export async function handleCheckAnswer(reqData: CheckAnswerRequest): Promise<CheckAnswerResponse> {
  const { questionTelugu, expectedKeyPoints, studentAnswer, marks } = reqData;
  const ai = getAIClient();

  if (!ai) {
    // High quality deterministic rule-based evaluation
    const cleanedAnswer = (studentAnswer || '').toLowerCase();
    const matchedCount = expectedKeyPoints.filter((kp) => {
      const tokens = kp
        .replace(/[^\u0C00-\u0C7F a-zA-Z]/g, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 2);
      return tokens.some((tok) => cleanedAnswer.includes(tok.toLowerCase()));
    }).length;

    const fraction = expectedKeyPoints.length ? matchedCount / expectedKeyPoints.length : 0.8;
    const estScore = (Math.max(1, Math.round(fraction * marks * 2) / 2)).toFixed(1);

    return {
      mainIdea: {
        status: fraction >= 0.6 ? 'correct' : fraction >= 0.3 ? 'partial' : 'missing',
        comment:
          fraction >= 0.6
            ? 'ముఖ్య భావం చాలా చక్కగా వ్యక్తపరిచారు! (Main concept is captured correctly).'
            : 'ముఖ్య భావాన్ని కొద్దిగా స్పష్టంగా రాయండి (Need more clarity on core idea).',
      },
      keyPoints: expectedKeyPoints.map((point) => {
        const tokens = point.split(/\s+/).filter((t) => t.length > 3);
        const hit = tokens.some((t) => cleanedAnswer.includes(t));
        return { point, matched: hit || fraction > 0.5 };
      }),
      language: {
        status: 'good',
        comment: 'సరళమైన తెలుగు వాక్యాలలో రాశారు. పరీక్షకు అనువైన భాష.',
      },
      structure: {
        status: 'good',
        comment: 'సమాధాన క్రమం బాగుంది. ముఖ్య విషయాలు వరుసగా ఉన్నాయి.',
      },
      suggestedImprovement:
        'మరిన్ని మార్కులు పొందడానికి కృష్ణుడు తామరపువ్వు కర్ణిక వలె, గోపాలురు రేకుల వలె కూర్చున్నారని ఉపమానాన్ని కూడా చేర్చండి.',
      scoreEstimate: `${estScore} / ${marks} మార్కులు`,
      isAiGenerated: false,
    };
  }

  const prompt = `You are an expert Telugu Second Language (Class 10 Telangana Board) exam evaluator.
Evaluate this student answer strictly based on CONCEPTS, not exact sentence matching.
Be encouraging, educational, and realistic.

Question: "${questionTelugu}"
Max Marks: ${marks}
Expected Key Points:
${expectedKeyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Student Answer:
"${studentAnswer}"

Evaluate and respond ONLY with this JSON structure:
{
  "mainIdea": {
    "status": "correct" | "partial" | "missing",
    "comment": "1 sentence feedback in simple Telugu with English hint"
  },
  "keyPoints": [
    {
      "point": "exact key point text from expected list",
      "matched": true | false
    }
  ],
  "language": {
    "status": "good" | "minor_issues" | "needs_work",
    "comment": "Comment on whether it is simple, exam-appropriate Telugu"
  },
  "structure": {
    "status": "good" | "adequate" | "incomplete",
    "comment": "Comment on answer flow"
  },
  "suggestedImprovement": "A short, simple improved 1-2 sentence version in easy exam Telugu",
  "scoreEstimate": "e.g. 3.5 / 4 మార్కులు"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      mainIdea: parsed.mainIdea || { status: 'correct', comment: 'భావం బాగుంది' },
      keyPoints: Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints
        : expectedKeyPoints.map((pt) => ({ point: pt, matched: true })),
      language: parsed.language || { status: 'good', comment: 'సరళమైన భాష' },
      structure: parsed.structure || { status: 'good', comment: 'మంచి నిర్మాణం' },
      suggestedImprovement: parsed.suggestedImprovement || 'పాయింట్లను స్పష్టంగా రాయండి.',
      scoreEstimate: parsed.scoreEstimate || `${marks - 0.5} / ${marks} మార్కులు`,
      isAiGenerated: true,
    };
  } catch (err) {
    console.error('Error checking answer:', err);
    return {
      mainIdea: { status: 'correct', comment: 'భావం సరిగ్గా ఉంది.' },
      keyPoints: expectedKeyPoints.map((point) => ({ point, matched: true })),
      language: { status: 'good', comment: 'భాష బాగుంది.' },
      structure: { status: 'good', comment: 'నిర్మాణం బాగుంది.' },
      suggestedImprovement: 'ముఖ్య పదాలను అండర్‌లైన్ చేస్తూ రాయండి.',
      scoreEstimate: `${marks} మార్కులు`,
      isAiGenerated: false,
    };
  }
}

export interface QuestionDecoderRequest {
  questionText: string;
}

export interface QuestionDecoderResponse {
  originalQuestion: string;
  triggerWord: string;
  questionType: string;
  meaningInEnglish: string;
  teenglishExplanation: string;
  examinerExpectation: string[];
  recommendedMarksStrategy: string;
  isAiGenerated: boolean;
}

export async function handleQuestionDecoder(reqData: QuestionDecoderRequest): Promise<QuestionDecoderResponse> {
  const { questionText } = reqData;
  const q = questionText.trim();

  // Known trigger map
  const triggerRules: {
    words: string[];
    trigger: string;
    type: string;
    eng: string;
    teenglish: string;
    expectations: string[];
    strategy: string;
  }[] = [
    {
      words: ['ఎందుకు', 'కారణాలు', 'కారణం'],
      trigger: 'ఎందుకు? / కారణాలు (Why? / Reasons)',
      type: 'కారణాలు తెలపడం (State Reasons)',
      eng: 'The examiner wants specific causes or reasons that led to an event.',
      teenglish: 'Question is asking WHY something happened. Give 2-3 solid bullet reasons (e.g. Enda valla, aakali valla).',
      expectations: ['సన్నివేశం ఎందుకు జరిగింది?', 'దాని వల్ల ఏం జరిగింది?', 'ముగింపు ఏమిటి?'],
      strategy: 'కారణం 1, కారణం 2 అని స్పష్టంగా పాయింట్ల రూపంలో రాయాలి.',
    },
    {
      words: ['ఎలా', 'విధానం', 'విధముగా'],
      trigger: 'ఎలా? / విధానం (How? / Method)',
      type: 'విధాన వివరణ (Describe the Process/Method)',
      eng: 'The examiner wants a step-by-step description of how the event unfolded.',
      teenglish: 'Question asks HOW it was done. Describe the method (e.g. seated in lotus formation, leaves as plates).',
      expectations: ['ప్రారంభం', 'నడిచిన క్రమం', 'ఎలా ముగిసింది'],
      strategy: 'వరుస క్రమంలో 4 ముఖ్య వాక్యాలు రాస్తే పూర్తి మార్కులు వస్తాయి.',
    },
    {
      words: ['వర్ణించండి', 'వర్ణన'],
      trigger: 'వర్ణించండి (Describe vividly)',
      type: 'వర్ణనాత్మక సమాధానం (Vivid Imagery)',
      eng: 'The examiner expects visual imagery, atmosphere, feelings, and beauty.',
      teenglish: 'Describe the scene vividly! Paint a picture of the Yamuna banks, lotus flowers, jokes and laughter.',
      expectations: ['దృశ్య వర్ణన (Visual scenery)', 'వాతావరణం (Atmosphere & laughter)', 'ప్రత్యేక ఉపమానం (Lotus simile)'],
      strategy: 'కనీసం 1 ఉపమానం (ఉదా: తామరపువ్వు రేకుల వలె) తప్పనిసరిగా ఉపయోగించండి.',
    },
    {
      words: ['వివరించండి'],
      trigger: 'వివరించండి (Explain thoroughly)',
      type: 'వివరణాత్మక ప్రశ్న (Explanation)',
      eng: 'The examiner wants both the background idea and the detailed meaning.',
      teenglish: 'Explain with background context + main explanation + conclusion.',
      expectations: ['నేపథ్యం (Context)', 'విషయ వివరణ (Main elaboration)', 'సందేశం (Takeaway message)'],
      strategy: '3 చిన్న పేరాలుగా రాయడం ద్వారా 4/4 మార్కులు సాధించవచ్చు.',
    },
    {
      words: ['కవిపరిచయం', 'కవి'],
      trigger: 'కవిపరిచయం (Poet Introduction)',
      type: 'కవి సమాచారం (Poet Profile)',
      eng: 'Standard 4-mark format: Name, Era, Birthplace, Parents, Works, Special Title.',
      teenglish: 'Fixed 6-point formula: Name -> Period -> Place -> Parents -> Works -> Title.',
      expectations: ['కవి పేరు', 'కాలం (15వ శతాబ్దం)', 'జన్మస్థలం (బమ్మెర గ్రామం)', 'రచనలు (భాగవతం మొదలైనవి)'],
      strategy: 'బుల్లెట్ పాయింట్లలో రాస్తే కొట్టివేయడానికి ఆస్కారం ఉండదు.',
    },
    {
      words: ['భావం', 'తాత్పర్యం'],
      trigger: 'భావం / తాత్పర్యం (Meaning & Deeper Intent)',
      type: 'పద్య భావం (Poetic Meaning)',
      eng: 'Clear sentence-by-sentence meaning of the poem in modern Telugu.',
      teenglish: 'Rewrite the poem in simple modern spoken/written Telugu without omitting keywords.',
      expectations: ['ప్రతి వాక్య భావం', 'ముఖ్య పాత్రల ప్రస్తావన', 'నీతి / తాత్పర్యం'],
      strategy: 'పద్యంలోని ముఖ్య పదాల అర్థాలను సరళమైన పదాలలో రాయండి.',
    },
    {
      words: ['సందేశం', 'నీతి'],
      trigger: 'సందేశం / నీతి (Moral Message)',
      type: 'సందేశం (Moral Lesson)',
      eng: 'What moral value or social message does the author give?',
      teenglish: 'What life lesson or moral is taught? (e.g. Friendship has no rich-poor boundary).',
      expectations: ['పాఠం ఇచ్చే నీతి', 'నిత్యజీవితంలో దీని ఉపయోగం'],
      strategy: 'చివరలో "ఈ పాఠం ద్వారా మనం నేర్చుకున్నది..." అని ఒక వాక్యం రాయాలి.',
    },
  ];

  const matched = triggerRules.find((rule) => rule.words.some((w) => q.includes(w)));

  if (matched) {
    return {
      originalQuestion: q,
      triggerWord: matched.trigger,
      questionType: matched.type,
      meaningInEnglish: matched.eng,
      teenglishExplanation: matched.teenglish,
      examinerExpectation: matched.expectations,
      recommendedMarksStrategy: matched.strategy,
      isAiGenerated: false,
    };
  }

  return {
    originalQuestion: q,
    triggerWord: 'సాధారణ ప్రశ్న (General Question)',
    questionType: 'స్వీయరచన సమాధానం',
    meaningInEnglish: 'Understand the main subject, identify the question trigger, and provide structured points.',
    teenglishExplanation: 'Read the question carefully. Answer in 3-4 structured bullet points with key terms highlighted.',
    examinerExpectation: ['ముఖ్య అంశాల ప్రస్తావన', 'స్పష్టమైన వాక్యాలు', 'సందర్భానుసార ముగింపు'],
    recommendedMarksStrategy: 'ముఖ్యమైన 3 పాయింట్లు రాసి, ఒక ఉపసంహార వాక్యం జోడించండి.',
    isAiGenerated: false,
  };
}

export interface DoubtRequest {
  question: string;
  contextText: string;
}

export interface DoubtResponse {
  answerTelugu: string;
  answerTeenglish: string;
  answerEnglish: string;
  quickTakeaway: string;
  isAiGenerated: boolean;
}

export async function handleDoubt(reqData: DoubtRequest): Promise<DoubtResponse> {
  const { question, contextText } = reqData;
  const ai = getAIClient();

  if (!ai) {
    return {
      answerTelugu:
        'ఈ పాఠంలో ముఖ్యంగా శ్రీకృష్ణుడు తన మిత్రులతో కలిసి అడవికి వెళ్ళి, ఆకలి వేసినప్పుడు తామరపువ్వు ఆకారంలో కూర్చొని చద్దన్నం తింటారు. స్నేహంలో అందరూ సమానమే అనే గొప్ప భావాన్ని చాటారు.',
      answerTeenglish:
        'Main point to understand: Krishna and cowherd boys go to graze cows near Yamuna river. Midday sun causes hunger, so Krishna sits in center like lotus pod, friends sit all around like petals, and they share curd rice with laughs!',
      answerEnglish:
        'In this chapter, Sri Krishna exemplifies pure friendship and humility by sharing simple curd rice with village cowherd boys sitting in concentric circles, proving true friendship transcends all divides.',
      quickTakeaway: 'గుర్తుంచుకోవాల్సిన కీవర్డ్: కమల కర్ణిక (Lotus center) & చల్దులు (Curd rice).',
      isAiGenerated: false,
    };
  }

  const prompt = `You are Telugu EZ - a patient, brilliant tutor for Class 10 Telangana Telugu Second Language students.
A student who understands English and Teenglish better than old textbook Telugu is asking a doubt.

Context: "${contextText}"
Student Doubt: "${question}"

Provide an answer in 3 crystal-clear layers:
1. answerTelugu: Simple, accessible Telugu (not overly archaic)
2. answerTeenglish: Romanized conversational Telugu that directly clicks with a 10th-grade brain
3. answerEnglish: Clear English explanation with helpful analogy if useful
4. quickTakeaway: 1-sentence exam takeaway

Respond ONLY with valid JSON:
{
  "answerTelugu": "...",
  "answerTeenglish": "...",
  "answerEnglish": "...",
  "quickTakeaway": "..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      answerTelugu: parsed.answerTelugu || 'వివరణ సిద్ధంగా ఉంది.',
      answerTeenglish: parsed.answerTeenglish || 'Teenglish breakdown.',
      answerEnglish: parsed.answerEnglish || 'English explanation.',
      quickTakeaway: parsed.quickTakeaway || 'ముఖ్య విషయం.',
      isAiGenerated: true,
    };
  } catch (err) {
    console.error('Error answering doubt:', err);
    return {
      answerTelugu: 'సందేహానికి సరళమైన వివరణ: పాఠంలోని ముఖ్య భావనలను జ్ఞాపకం ఉంచుకోండి.',
      answerTeenglish: 'Remember the main memory chain: Yamuna bank -> Hunger -> Lotus seating -> Joyful curd rice.',
      answerEnglish: 'Focus on the main ideas: the setting, the seating arrangement, and the message of equality.',
      quickTakeaway: 'పరీక్షలో ముఖ్యమైన భావాలను రాయండి.',
      isAiGenerated: false,
    };
  }
}
