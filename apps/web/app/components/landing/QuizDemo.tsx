'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Trophy, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QUIZ_QUESTION = {
  question: 'How much impact can $25 create on Altrue?',
  answers: [
    { id: 'a', text: '$25 — What you give is what they get', correct: false },
    { id: 'b', text: '$50 — Most companies match 1:1', correct: false },
    { text: '$100 — With 4x company matching', correct: true, id: 'c' },
    { id: 'd', text: '$250 — Through our viral sharing', correct: false },
  ],
  explanation: 'With Altrue\'s company matching partnerships, your $25 donation can be matched up to 4x, creating $100 of real impact for causes you care about!',
  points: 50,
};

export function QuizDemo() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswer = (answerId: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerId);
    setShowResult(true);
    setHasAnswered(true);
    
    const isCorrect = QUIZ_QUESTION.answers.find(a => a.id === answerId)?.correct;
    if (isCorrect) {
      setScore(QUIZ_QUESTION.points);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setHasAnswered(false);
  };

  const correctAnswer = QUIZ_QUESTION.answers.find(a => a.correct);
  const isCorrect = selectedAnswer === correctAnswer?.id;

  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4">
            <Lightbulb className="w-4 h-4" />
            Learn & Earn
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Knowledge Multiplies
            <span className="text-[#D4AF37]"> Impact</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Take quizzes about causes you care about and earn points while learning how to maximize your giving potential.
          </p>
        </motion.div>

        {/* Quiz Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Score Badge */}
          <motion.div
            className="absolute -top-4 -right-4 sm:right-8 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-2xl px-4 py-3 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <p className="text-white/50 text-xs">Your Points</p>
                <motion.p 
                  className="text-[#D4AF37] font-bold text-xl"
                  key={score}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                >
                  {score}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Quiz Container */}
          <div className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] rounded-3xl p-6 sm:p-10 border border-white/5">
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="text-white/40 text-sm">Question 1 of 5</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {QUIZ_QUESTION.question}
              </h3>
            </div>

            {/* Answers */}
            <div className="space-y-3 mb-8">
              {QUIZ_QUESTION.answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer.id;
                const showCorrect = showResult && answer.correct;
                const showIncorrect = showResult && isSelected && !answer.correct;

                return (
                  <motion.button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    disabled={hasAnswered}
                    className={`w-full p-4 sm:p-5 rounded-xl text-left transition-all border-2 ${
                      showCorrect
                        ? 'bg-green-500/10 border-green-500/50'
                        : showIncorrect
                        ? 'bg-red-500/10 border-red-500/50'
                        : isSelected
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50'
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                    whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        showCorrect
                          ? 'bg-green-500/20'
                          : showIncorrect
                          ? 'bg-red-500/20'
                          : isSelected
                          ? 'bg-[#D4AF37]/20'
                          : 'bg-white/10'
                      }`}>
                        {showCorrect ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : showIncorrect ? (
                          <X className="w-5 h-5 text-red-500" />
                        ) : (
                          <span className={`font-semibold ${
                            isSelected ? 'text-[#D4AF37]' : 'text-white/60'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                        )}
                      </div>
                      <span className={`flex-1 ${
                        showCorrect
                          ? 'text-green-400'
                          : showIncorrect
                          ? 'text-red-400'
                          : isSelected
                          ? 'text-white'
                          : 'text-white/80'
                      }`}>
                        {answer.text}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Result */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-6 rounded-2xl mb-6 ${
                    isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-green-500/20' : 'bg-[#D4AF37]/20'
                    }`}>
                      {isCorrect ? (
                        <Trophy className="w-6 h-6 text-green-500" />
                      ) : (
                        <Lightbulb className="w-6 h-6 text-[#D4AF37]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-[#D4AF37]'}`}>
                        {isCorrect ? '🎉 Correct! +' + QUIZ_QUESTION.points + ' points!' : 'Not quite, but here\'s the insight:'}
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {QUIZ_QUESTION.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {hasAnswered ? (
                <>
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/10 py-6"
                  >
                    Try Again
                  </Button>
                  <Button
                    className="flex-1 bg-[#D4AF37] hover:bg-[#C4A035] text-black font-semibold py-6"
                  >
                    Continue Learning
                    <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                </>
              ) : (
                <p className="text-white/40 text-sm text-center w-full">
                  Select an answer to see how much impact you can create
                </p>
              )}
            </div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#D4AF37]/10 blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-[#3B82F6]/10 blur-2xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
