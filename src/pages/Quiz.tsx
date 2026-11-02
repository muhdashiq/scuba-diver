import { History } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizAnswer, QuizQuestion } from '@/types';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { QuizSetup, type QuizSetupValue } from '@/components/quiz/QuizSetup';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { QuizResults } from '@/components/quiz/QuizResults';
import { QUIZ_QUESTIONS } from '@/data/quizQuestions';
import { buildQuiz, scoreQuiz, TIME_PER_QUESTION_SECONDS } from '@/utils/quizEngine';
import { useAppStore, uid } from '@/store/useAppStore';
import { toast } from '@/lib/toast';

type Phase = { name: 'setup' } | { name: 'running'; questions: QuizQuestion[]; config: QuizSetupValue; run: number } | { name: 'results'; questions: QuizQuestion[]; answers: QuizAnswer[]; config: QuizSetupValue };

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>({ name: 'setup' });
  const history = useAppStore((s) => s.quizHistory);
  const addResult = useAppStore((s) => s.addQuizResult);

  const start = (config: QuizSetupValue) => setPhase({ name: 'running', questions: buildQuiz(QUIZ_QUESTIONS, config), config, run: Date.now() });
  const finish = (questions: QuizQuestion[], answers: QuizAnswer[], config: QuizSetupValue) => {
    const s = scoreQuiz(answers);
    addResult({ id: uid(), date: new Date().toISOString(), categories: config.categories, difficulty: config.difficulty, timed: config.timed, total: s.total, correct: s.correct, percentage: s.percentage, answers });
    toast.success('Result saved to History');
    setPhase({ name: 'results', questions, answers, config });
  };

  if (phase.name === 'running') {
    return <QuizRunner key={phase.run} questions={phase.questions} timeLimit={phase.config.timed ? TIME_PER_QUESTION_SECONDS[phase.config.difficulty] : null} onFinish={(a) => finish(phase.questions, a, phase.config)} onQuit={() => setPhase({ name: 'setup' })} />;
  }
  if (phase.name === 'results') {
    return <QuizResults questions={phase.questions} answers={phase.answers} onRetry={() => start(phase.config)} onNew={() => setPhase({ name: 'setup' })} />;
  }
  return (
    <>
      <ScreenHeader
        back={{ to: '/learn', label: 'Learn' }}
        title="Knowledge Quiz"
        subtitle="Educational self-test — not an official certification exam."
        actions={history.length > 0 ? <Link to="/history" aria-label="Quiz history" className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary/10"><History className="h-[22px] w-[22px]" /></Link> : undefined}
      />
      <QuizSetup onStart={start} />
    </>
  );
}
