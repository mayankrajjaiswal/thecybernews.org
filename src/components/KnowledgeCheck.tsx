import React, { useState } from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface KnowledgeCheckProps {
  title?: string;
  questions: QuizQuestion[];
}

export default function KnowledgeCheck({ title = "Knowledge Check", questions }: KnowledgeCheckProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    
    if (idx === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const isSuccess = percentage >= 70;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 my-10 not-prose" data-testid="quiz-completion">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {isSuccess ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            )}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h3>
          <p className="text-slate-600 mb-6">You scored <span className="font-bold text-slate-900">{score} out of {questions.length}</span> ({percentage}%)</p>
          
          <button 
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8 my-10 not-prose shadow-sm relative overflow-hidden" data-testid="quiz-container">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out" 
          style={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {title}
        </h3>
        <span className="text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          Question {currentQuestionIdx + 1} of {questions.length}
        </span>
      </div>

      <p className="text-lg font-medium text-slate-800 mb-6">{currentQuestion.question}</p>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
          
          if (!isAnswered) {
            btnClass += "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-slate-700";
          } else {
            if (idx === currentQuestion.correctAnswerIndex) {
              btnClass += "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium shadow-sm"; // Correct answer always highlights
            } else if (idx === selectedAnswer) {
              btnClass += "border-red-400 bg-red-50 text-red-900"; // Wrong answer selected
            } else {
              btnClass += "border-slate-200 bg-white text-slate-400 opacity-60"; // Unselected wrong answers fade out
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={btnClass}
              data-testid={`option-${idx}`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 border flex-shrink-0
                  ${!isAnswered ? 'border-slate-300 text-transparent' : 
                    idx === currentQuestion.correctAnswerIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                    idx === selectedAnswer ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200 text-transparent'
                  }
                `}>
                  {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  )}
                  {isAnswered && idx === selectedAnswer && idx !== currentQuestion.correctAnswerIndex && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`p-5 rounded-xl mb-6 animate-in fade-in slide-in-from-bottom-2 ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'bg-emerald-100 border border-emerald-200' : 'bg-slate-200 border border-slate-300'}`}>
          <p className="text-sm font-bold text-slate-900 mb-1">
            {selectedAnswer === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-slate-700 text-sm">{currentQuestion.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-8 rounded-lg transition-colors ml-auto block"
          data-testid="next-btn"
        >
          {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
        </button>
      )}
    </div>
  );
}
