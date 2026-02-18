'use client';

import { useState, useTransition } from 'react';
import { DIAGNOSIS_QUESTIONS, assignTrack, type TrackSlug } from '@/lib/types/database';
import { TRACK_CONFIG } from '@/lib/constants';
import { submitDiagnosis } from '@/lib/actions/diagnosis';

type Answers = Record<string, boolean>;

export function DiagnosisWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [isPending, startTransition] = useTransition();

  const question = DIAGNOSIS_QUESTIONS[currentStep];
  const totalSteps = DIAGNOSIS_QUESTIONS.length;
  const progress = ((currentStep) / totalSteps) * 100;

  function handleAnswer(value: boolean) {
    const newAnswers = { ...answers, [question.field]: value };
    setAnswers(newAnswers);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleSubmit() {
    startTransition(() => {
      submitDiagnosis({
        has_overdue_debt: answers.has_overdue_debt ?? false,
        can_save_monthly: answers.can_save_monthly ?? false,
        has_emergency_fund: answers.has_emergency_fund ?? false,
        knows_retirement_target: answers.knows_retirement_target ?? false,
        understands_pgbl_vgbl: answers.understands_pgbl_vgbl ?? false,
      });
    });
  }

  if (showResult) {
    const trackSlug: TrackSlug = assignTrack({
      has_overdue_debt: answers.has_overdue_debt ?? false,
      can_save_monthly: answers.can_save_monthly ?? false,
      has_emergency_fund: answers.has_emergency_fund ?? false,
      knows_retirement_target: answers.knows_retirement_target ?? false,
      understands_pgbl_vgbl: answers.understands_pgbl_vgbl ?? false,
    });
    const track = TRACK_CONFIG[trackSlug];

    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${track.bgColor} text-3xl`}>
              {track.icon}
            </div>
            <h2 className="mb-2 text-2xl font-bold">Sua trilha: {track.name}</h2>
            <p className="text-gray-400">{track.description}</p>
          </div>

          <div className={`mb-6 rounded-xl border ${track.borderColor} ${track.bgColor} p-4`}>
            <p className="text-sm text-gray-600">
              Preparamos uma jornada personalizada para você. Conteúdo diário de 5-10 minutos,
              quizzes e desafios práticos que vão te ajudar a evoluir no seu próprio ritmo.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {isPending ? 'Iniciando...' : 'Começar minha jornada'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>Pergunta {currentStep + 1} de {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8 backdrop-blur-sm">
        <h2 className="mb-8 text-center text-xl font-semibold leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => handleAnswer(question.field === 'has_overdue_debt' ? true : true)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-6 py-4 text-left text-sm font-medium text-white transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
          >
            {question.yes_label}
          </button>
          <button
            onClick={() => handleAnswer(question.field === 'has_overdue_debt' ? false : false)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-6 py-4 text-left text-sm font-medium text-white transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
          >
            {question.no_label}
          </button>
        </div>

        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="mt-6 w-full text-center text-xs text-gray-500 transition-colors hover:text-gray-600"
          >
            Voltar para pergunta anterior
          </button>
        )}
      </div>
    </div>
  );
}
