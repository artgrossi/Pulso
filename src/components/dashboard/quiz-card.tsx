'use client';

import { useState, useTransition } from 'react';
import { submitQuizAttempt } from '@/lib/actions/content';
import { Icon } from '@/components/ui/Icon';

interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation: string | null;
  sort_order: number;
}

interface QuizCardProps {
  quizId: string;
  title: string;
  description: string | null;
  questions: QuizQuestion[];
  coinsReward: number;
  alreadyAttempted: boolean;
}

export function QuizCard({ quizId, title, description, questions, coinsReward, alreadyAttempted }: QuizCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(alreadyAttempted);
  const [result, setResult] = useState<{ score: number; total: number; coinsEarned: number } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  function selectOption(index: number) {
    if (showExplanation) return;
    setSelectedOption(index);
  }

  function confirmAnswer() {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);
    setShowExplanation(true);
  }

  function nextQuestion() {
    setShowExplanation(false);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit quiz
      const finalAnswers = [...answers];
      finalAnswers[currentQuestion] = answers[currentQuestion];

      startTransition(async () => {
        const res = await submitQuizAttempt(
          quizId,
          finalAnswers.map(a => a ?? 0),
        );
        setResult({ score: res.score, total: res.total, coinsEarned: res.coinsEarned });
        setShowResults(true);
      });
    }
  }

  if (alreadyAttempted && !isOpen) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Icon name="check-circle" size={20} className="text-emerald-500" />
          </span>
          <div>
            <h4 className="text-sm font-medium">{title}</h4>
            <p className="text-xs text-gray-500">Quiz ja respondido</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Icon name="lightbulb" size={20} className="text-purple-400" />
          </span>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{title}</h4>
            {description && <p className="text-xs text-gray-500">{description}</p>}
            <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-600">
              <span>{questions.length} perguntas</span>
              <span>·</span>
              <span>{coinsReward} moedas (gabarito perfeito)</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-3 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
        >
          Iniciar Quiz
        </button>
      </div>
    );
  }

  // Show results
  if (showResults && result) {
    const isPerfect = result.score === result.total;
    return (
      <div className={`rounded-xl border p-5 backdrop-blur-sm ${isPerfect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            <Icon name={isPerfect ? 'trophy' : 'document-text'} size={36} className={isPerfect ? 'text-emerald-400' : 'text-amber-400'} />
          </div>
          <h4 className="text-lg font-bold">{isPerfect ? 'Perfeito!' : 'Bom trabalho!'}</h4>
          <p className="mt-1 text-sm text-gray-400">
            Voce acertou <strong className={isPerfect ? 'text-emerald-400' : 'text-amber-400'}>{result.score}</strong> de {result.total} perguntas
          </p>
          {result.coinsEarned > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-400">
              <Icon name="coin" size={14} />
              +{result.coinsEarned} moedas
            </div>
          )}
          {!isPerfect && (
            <p className="mt-3 text-xs text-gray-500">
              Acerte todas para ganhar as moedas! Revise o conteudo e tente novamente.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Active quiz
  const question = questions[currentQuestion];
  const isCorrect = selectedOption === question.correct_option_index;

  return (
    <div className="rounded-xl border border-purple-500/20 bg-white/90 p-5 backdrop-blur-sm">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">Pergunta {currentQuestion + 1}/{questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i < currentQuestion ? 'bg-purple-500' :
                i === currentQuestion ? 'bg-purple-400' :
                'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h4 className="mb-4 text-sm font-medium leading-relaxed">{question.question_text}</h4>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, i) => {
          let style = 'border-gray-200 hover:border-gray-300';
          if (showExplanation) {
            if (i === question.correct_option_index) {
              style = 'border-emerald-500 bg-emerald-500/10';
            } else if (i === selectedOption && !isCorrect) {
              style = 'border-red-500 bg-red-500/10';
            } else {
              style = 'border-gray-200 opacity-50';
            }
          } else if (selectedOption === i) {
            style = 'border-purple-500 bg-purple-500/10';
          }

          return (
            <button
              key={i}
              onClick={() => selectOption(i)}
              disabled={showExplanation}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ${style}`}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-400">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-xs ${isCorrect ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
          <Icon name={isCorrect ? 'check-circle' : 'x-circle'} size={14} className="mt-0.5 shrink-0" />
          <span>{isCorrect ? 'Correto! ' : 'Incorreto. '}{question.explanation}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4">
        {!showExplanation ? (
          <button
            onClick={confirmAnswer}
            disabled={selectedOption === null}
            className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
          >
            Confirmar Resposta
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={isPending}
            className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
          >
            {isPending ? 'Enviando...' : currentQuestion < questions.length - 1 ? 'Proxima Pergunta' : 'Ver Resultado'}
          </button>
        )}
      </div>
    </div>
  );
}
