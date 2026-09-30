import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Zap,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';

type DurationChoice = '15m' | '30m' | '1h' | '3h';

interface CramStep {
  title: string;
  marksPotential: string;
  durationLabel: string;
  teluguHeader: string;
  keyBulletPoints: string[];
}

export const EmergencyModeView: React.FC = () => {
  const { lesson, setActiveTab } = useStudy();
  const [duration, setDuration] = useState<DurationChoice>('30m');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getCramPlan = (): CramStep[] => {
    switch (duration) {
      case '15m':
        return [
          {
            title: '1. బమ్మెర పోతన కవి పరిచయం (Poet Formula)',
            marksPotential: '4 MARKS GUARANTEED',
            durationLabel: '3 mins',
            teluguHeader: 'బమ్మెర పోతన - 6 బుల్లెట్ పాయింట్లు',
            keyBulletPoints: [
              'కవి: బమ్మెర పోతన (15వ శతాబ్దం).',
              'జన్మస్థలం: తెలంగాణ వరంగల్/జనగామ బమ్మెర గ్రామం.',
              'తల్లిదండ్రులు: లక్కమాంబ, కేసన.',
              'ముఖ్య గ్రంథం: శ్రీమదాంధ్ర భాగవతం.',
              'బిరుదు: సహజ పండితుడు (శ్రీరామునికే అంకితం).',
            ],
          },
          {
            title: '2. తామరపువ్వు ఉపమానం (Padyam 1 Bhavam)',
            marksPotential: '4 MARKS',
            durationLabel: '4 mins',
            teluguHeader: 'కమల కర్ణిక & రేకుల ఉపమానం',
            keyBulletPoints: [
              'కృష్ణుడు తామరపువ్వు కర్ణిక (మధ్య భాగం) వలె నిలబడ్డాడు.',
              'గోపబాలురందరూ తామరపువ్వు రేకుల వలె చుట్టూ కూర్చున్నారు.',
              'ప్రతి ఒక్కరికీ కృష్ణుడు తమ ఎదురుగానే ఉన్నట్లు కనిపించాడు.',
            ],
          },
          {
            title: '3. చల్దులారగించుట ముఖ్య భావం',
            marksPotential: '4 MARKS',
            durationLabel: '4 mins',
            teluguHeader: 'కృష్ణుడు భోజనానికి పిలవడం & అమృత చల్దులు',
            keyBulletPoints: [
              'మధ్యాహ్నం ఎండ తీవ్రమై బాలురకు ఆకలి వేసింది.',
              'కృష్ణుడు యమునా నది ఒడ్డున చల్లని చెట్ల నీడకు పిలిచాడు.',
              'మోదుగ, తామర ఆకులలో పెరుగు అన్నం ఒకరికొకరు తినిపించుకున్నారు.',
              'స్నేహంలో పేద-గొప్ప అనే తేడా లేదని నిరూపించారు.',
            ],
          },
          {
            title: '4. సవర్ణదీర్ఘ & గుణ సంధి సూత్రాలు',
            marksPotential: '2-3 MARKS',
            durationLabel: '4 mins',
            teluguHeader: 'గ్యారెంటీ వ్యాకరణ సూత్రాలు',
            keyBulletPoints: [
              'సవర్ణదీర్ఘ సంధి: అ, ఇ, ఉ, ఋ + అవే అచ్చులు = దీర్ఘం (మహా + ఆనందము = మహానందము).',
              'గుణ సంధి: అ-కారము + ఇ, ఉ, ఋ = ఏ, ఓ, అర్ (దేవ + ఇంద్రుడు = దేవేంద్రుడు).',
              'షష్ఠీ తత్పురుష: యమున యొక్క తీరము = యమునాతీరము.',
            ],
          },
        ];

      case '30m':
      default:
        return [
          {
            title: '1. కవి పరిచయం: బమ్మెర పోతన',
            marksPotential: '4 MARKS',
            durationLabel: '5 mins',
            teluguHeader: 'పోతన - కాలం, స్థలం, రచనలు, బిరుదు',
            keyBulletPoints: [
              'కవి: బమ్మెర పోతన, 15వ శతాబ్దం.',
              'స్థలం: వరంగల్/జనగామ జిల్లా బమ్మెర గ్రామం.',
              'రచనలు: శ్రీమదాంధ్ర భాగవతం, వీరభద్ర విజయం, భోగినీ దండకం, నారాయణ శతకం.',
              'బిరుదు: సహజ పండితుడు. నరులకు అంకితమివ్వని నిస్వార్థ భక్త కవి.',
            ],
          },
          {
            title: '2. పద్య భావం: తామరపువ్వు కర్ణిక',
            marksPotential: '4-6 MARKS',
            durationLabel: '6 mins',
            teluguHeader: 'రండని ముందట నిలిచి... పద్య భావం',
            keyBulletPoints: [
              'కృష్ణుడు, బలరాముడు మిత్రులను "రండి" అని పిలిచారు.',
              'తామరపువ్వు మధ్యలోని కర్ణిక చుట్టూ రేకులు అమరినట్లు బాలురు కూర్చున్నారు.',
              'సహజమైన స్నేహ బంధం మరియు సమానత్వానికి ఇది ప్రతీక.',
            ],
          },
          {
            title: '3. 8 మార్కుల వ్యాసరూప సమాధాన అస్థిపంజరం (Skeleton)',
            marksPotential: '8 MARKS',
            durationLabel: '8 mins',
            teluguHeader: 'యమునాతీరంలో చల్దులు ఆరగించిన విధానం',
            keyBulletPoints: [
              '1. నేపథ్యం: ఎండ తీవ్రత వల్ల యమునా తీరంలోని చెట్ల నీడకు చేరడం.',
              '2. కూర్చున్న విధానం: తామర రేకుల వలె కృష్ణుడి చుట్టూ కూర్చోవడం.',
              '3. విస్తళ్ళు: మోదుగ ఆకులు, తామర ఆకులను పళ్ళాలుగా మార్చుకోవడం.',
              '4. భోజనం: చద్దన్నం, పెరుగు, ఊరగాయలు ఒకరికొకరు ముద్దలు తినిపించుకోవడం.',
              '5. ముగింపు: కృష్ణుడు ఈ ఆహారాన్ని అమృతం కంటే మిన్నగా ఆరగించడం.',
            ],
          },
          {
            title: '4. హై-ఈల్డ్ వ్యాకరణం (Grammar Formulas)',
            marksPotential: '4 MARKS',
            durationLabel: '6 mins',
            teluguHeader: 'సంధులు & సమాసాలు',
            keyBulletPoints: [
              'గుణ సంధి: అ + ఇ/ఉ/ఋ = ఏ/ఓ/అర్ (దేవేంద్రుడు, సూర్యోదయము).',
              'సవర్ణదీర్ఘ సంధి: అ/ఇ/ఉ/ఋ + సమాన అచ్చులు = దీర్ఘం (మునీంద్రుడు).',
              'ఉత్వ సంధి: ఉత్తునకు అచ్చు పరమైనప్పుడు సంధి నిత్యము (రాముడతడు).',
              'తత్పురుష సమాసం: యమునాతీరము (యమున యొక్క తీరము - షష్ఠీ).',
              'ద్వంద్వ సమాసం: రామకృష్ణులు (రాముడును, కృష్ణుడును).',
            ],
          },
          {
            title: '5. ముఖ్యమైన పదజాలం (Top Vocabulary)',
            marksPotential: '3-4 MARKS',
            durationLabel: '5 mins',
            teluguHeader: 'అర్థాలు & పర్యాయపదాలు',
            keyBulletPoints: [
              'చల్ది = చద్దన్నము (రాత్రి మిగిలిన పెరుగు అన్నం).',
              'ఆరగించుట = భోజనం చేయుట.',
              'కర్ణిక = తామరపువ్వు మధ్య భాగం / గింజల తిత్తి.',
              'సఖులు = మిత్రులు, చెలికాండ్రు, స్నేహితులు.',
              'అమృతము (ప్రకృతి) -> అముదము (వికృతి).',
            ],
          },
        ];

      case '1h':
      case '3h':
        return [
          {
            title: '1. కవి పరిచయం పూర్తి సమాధానం',
            marksPotential: '4 MARKS',
            durationLabel: '10 mins',
            teluguHeader: 'బమ్మెర పోతన సమగ్ర పరిచయం',
            keyBulletPoints: [
              'పోతన 15వ శతాబ్దానికి చెందిన తెలంగాణ ప్రజా కవి.',
              'వరంగల్ బమ్మెర గ్రామంలో లక్కమాంబ, కేసన దంపతులకు జన్మించారు.',
              'భాగవతం మొదలైన ప్రసిద్ధ రచనలు రచించారు.',
              'సహజ పండితుడు బిరుదం కలిగి ఉన్నారు.',
            ],
          },
          {
            title: '2. 2 పద్యాల సమగ్ర భావాలు',
            marksPotential: '8 MARKS',
            durationLabel: '15 mins',
            teluguHeader: 'పద్యం 1 & పద్యం 2 భావాలు',
            keyBulletPoints: [
              'పద్యం 1: తామరపువ్వు కర్ణిక మరియు రేకుల అమరిక ఉపమానం.',
              'పద్యం 2: మోదుగాకుల విస్తళ్ళలో చల్దులను పంచుకుంటూ నవ్వుకోవడం.',
            ],
          },
          {
            title: '3. స్వీయరచన & వ్యాసరూప సమాధానాలు (4M & 8M)',
            marksPotential: '12 MARKS',
            durationLabel: '20 mins',
            teluguHeader: 'కృష్ణుడు పిలవడం & చల్దులు ఆరగించడం',
            keyBulletPoints: [
              'ఎండ తీవ్రత, తీవ్రమైన ఆకలి మరియు ఆహ్వానం.',
              'తామరపువ్వు అమరిక, మోదుగ విస్తళ్ళు, ముద్దలు తినిపించుకొనుట.',
            ],
          },
          {
            title: '4. పూర్తి వ్యాకరణం & పదజాలం',
            marksPotential: '8 MARKS',
            durationLabel: '15 mins',
            teluguHeader: 'సంధులు, సమాసాలు, ప్రకృతి-వికృతులు',
            keyBulletPoints: [
              'సవర్ణదీర్ఘ, గుణ, ఉత్వ సంధులు.',
              'తత్పురుష & ద్వంద్వ సమాసాలు.',
              'కఠిన పదాలు మరియు నానార్థాలు.',
            ],
          },
        ];
    }
  };

  const steps = getCramPlan();
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-rose-900 via-rose-800 to-stone-900 text-white shadow-xl">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-rose-300 mb-2">
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>DETERMINISTIC EXAM CRAM PATH</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          LAST-MINUTE EMERGENCY MODE
        </h2>
        <p className="text-rose-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
          Only high-yield exam points. Skips textbook filler and targets guaranteed marks.
        </p>

        {/* Time Selector Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {(['15m', '30m', '1h', '3h'] as DurationChoice[]).map((dur) => (
            <button
              key={dur}
              onClick={() => {
                setDuration(dur);
                setActiveStepIndex(0);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                duration === dur
                  ? 'bg-white text-rose-950 shadow-md scale-105'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {dur === '15m'
                ? '⚡ 15 MINUTES'
                : dur === '30m'
                ? '🔥 30 MINUTES'
                : dur === '1h'
                ? '📖 1 HOUR'
                : '🎯 3 HOURS'}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Pills */}
      <div className="surface-card rounded-3xl p-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                idx === activeStepIndex
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[130px] font-telugu">{st.title.split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Cram Step Card */}
      <div className="surface-card rounded-3xl p-6 sm:p-8 space-y-6 border-rose-200">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-700">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentStep.durationLabel} Cram Window</span>
            </div>
            <h3 className="text-xl font-black text-stone-900 mt-1 font-telugu">
              {currentStep.title}
            </h3>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-950 font-black text-xs">
            {currentStep.marksPotential}
          </div>
        </div>

        {/* High Yield Bullet Points */}
        <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3 font-telugu">
          <span className="text-xs font-black uppercase tracking-wider text-rose-950 block">
            {currentStep.teluguHeader}
          </span>
          <div className="space-y-2.5">
            {currentStep.keyBulletPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-stone-900 font-medium">
                <CheckCircle2 className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeStepIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>

          {activeStepIndex < steps.length - 1 ? (
            <button
              onClick={() => setActiveStepIndex((prev) => prev + 1)}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Next High-Return Topic</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('progress')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Check Exam Readiness</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
