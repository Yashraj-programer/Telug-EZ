/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { DesktopSidebar } from './components/DesktopSidebar';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { LessonFlow } from './components/LessonFlow';
import { MakeItEZTool } from './components/MakeItEZTool';
import { PadyamMode } from './components/PadyamMode';
import { KaviParichayamMode } from './components/KaviParichayamMode';
import { PracticeHub } from './components/PracticeHub';
import { AnswerRebuildSystem } from './components/AnswerRebuildSystem';
import { QuestionDecoder } from './components/QuestionDecoder';
import { SpacedRevisionView } from './components/SpacedRevisionView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { EmergencyModeView } from './components/EmergencyModeView';
import { AskAIModal } from './components/AskAIModal';

const AppContent: React.FC = () => {
  const { activeTab } = useStudy();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex font-sans antialiased selection:bg-amber-200/80">
      {/* Desktop Sidebar (visible on lg+) */}
      <DesktopSidebar />

      {/* Main Content Canal */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 pt-6 pb-24 lg:pb-16">
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'learn' && <LessonFlow />}
          {activeTab === 'make_ez' && <MakeItEZTool />}
          {activeTab === 'padyam' && <PadyamMode />}
          {activeTab === 'kavi' && <KaviParichayamMode />}
          {activeTab === 'practice' && <PracticeHub />}
          {activeTab === 'answer_builder' && <AnswerRebuildSystem />}
          {activeTab === 'decoder' && <QuestionDecoder />}
          {activeTab === 'revise' && <SpacedRevisionView />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'emergency' && <EmergencyModeView />}
        </main>
      </div>

      <AskAIModal />
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}
