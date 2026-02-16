'use client';

import { useState, useTransition } from 'react';
import type { QuizQuestion } from '@/lib/types/database';
import { submitQuizAttempt } from '@/lib/actions/content';
import { useToast } from '@/components/ui/toast';

interface InteractiveQuizProps {
  quizId: string;
  quizTitle: string;
  questions: QuizQuestion[];
  coinsReward: number;
}

export function InteractiveQuiz({ quizId, quizTitle, questions, coinsReward }: InteractiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; coinsEarned: number } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToast();

  const question = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const isCorrect = selectedAnswer === question?.correct_option_index;
  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = selectedAnswers.every((a) => a !== null);

  function handleSelectOption(optionIndex: number) {
    if (showExplanation) return; // Can't change after revealing

    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  }

  function handleNext() {
    setShowExplanation(false);
    if (isLastQuestion) {
      // Submit quiz
      const answers = selectedAnswers.filter((a): a is number => a !== null);
      startTransition(async () => {
        const res = await submitQuizAttempt(quizId, answers);
        setResult(res);
        if (res.coinsEarned > 0) {
          addToast({
            type: 'success',
            title: 'Quiz completo!',
            description: `Você acertou tudo e ganhou ${res.coinsEarned} moedas!`,
          });
        } else {
          addToast({
            type: 'info',
            title: 'Quiz finalizado',
            description: `Você acertou ${res.score} de ${res.total}.`,
          });
        }
      });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  // Result screen
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const isPerfect = result.score === result.total;

    return (
      <div className="animate-scale-in rounded-2xl border border-gray-800 bg-gray-900/60 p-6 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/60 text-3xl">
          {isPerfect ? '🎉' : percentage >= 60 ? '👏' : '📚'}
        </div>
        <h3 className="mb-1 text-lg font-bold">
          {isPerfect ? 'Perfeito!' : percentage >= 60 ? 'Muito bem!' : 'Continue estudando!'}
        </h3>
        <p className="mb-4 text-sm text-gray-400">
          Você acertou {result.score} de {result.total} perguntas ({percentage}%)
        </p>

        {result.coinsEarned > 0 && (
          <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400">
            🪙 +{result.coinsEarned} moedas
          </div>
        )}

        {/* Answer summary */}
        <div className="mt-4 space-y-2 text-left">
          {questions.map((q, i) => {
            const answered = selectedAnswers[i];
            const correct = answered === q.correct_option_index;
            return (
              <div
                key={q.id}
                className={`flex items-center gap-3 rounded-lg p-3 text-xs ${
                  correct
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                <span className="shrink-0 text-sm">{correct ? '✓' : '✕'}</span>
                <span className="flex-1 text-gray-300">{q.question_text}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm">
      {/* Header */}
      <div className="border-b border-gray-800/50 px-5 py-4 sm:px-6">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>{quizTitle}</span>
          <span>{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${((currentIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div key={currentIndex} className="animate-fade-in p-5 sm:p-6">
        <h4 className="mb-5 text-base font-semibold leading-relaxed sm:text-lg">
          {question.question_text}
        </h4>

        <div className="space-y-2">
          {question.options.map((option, optIndex) => {
            const isSelected = selectedAnswer === optIndex;
            const isCorrectOption = optIndex === question.correct_option_index;

            let optionStyle = 'border-gray-700 bg-gray-800/50 hover:border-gray-600';
            if (showExplanation) {
              if (isCorrectOption) {
                optionStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'border-red-500/50 bg-red-500/10 text-red-300';
              } else {
                optionStyle = 'border-gray-800 bg-gray-900/50 opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'border-emerald-500/50 bg-emerald-500/10';
            }

            return (
              <button
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                disabled={showExplanation}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all active:scale-[0.98] disabled:cursor-default ${optionStyle}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  showExplanation && isCorrectOption
                    ? 'bg-emerald-500 text-white'
                    : showExplanation && isSelected && !isCorrectOption
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                }`}>
                  {showExplanation ? (
                    isCorrectOption ? '✓' : isSelected ? '✕' : String.fromCharCode(65 + optIndex)
                  ) : (
                    String.fromCharCode(65 + optIndex)
                  )}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mt-4 animate-fade-in rounded-lg bg-cyan-500/10 p-4 text-xs text-cyan-300">
            <span className="font-semibold">Explicação:</span> {question.explanation}
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <button
            onClick={handleNext}
            disabled={isPending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Finalizando...
              </>
            ) : isLastQuestion ? (
              `Finalizar quiz (${coinsReward} moedas)`
            ) : (
              'Próxima pergunta'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
