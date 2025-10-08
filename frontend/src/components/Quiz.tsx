import { useState } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, BookOpen, Lightbulb } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Quiz as QuizType, QuizAttempt } from '../lib/storage';
import { generateQuizQuestions } from '../lib/aiService';

export function Quiz() {
  const { selectedPdfIds, pdfs, addQuiz, addQuizAttempt, updateProgress } = useApp();
  const [quizType, setQuizType] = useState<'mcq' | 'saq' | 'laq' | 'mixed'>('mcq');
  const [questionCount, setQuestionCount] = useState(5);
  const [currentQuiz, setCurrentQuiz] = useState<QuizType | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuiz = async () => {
    if (selectedPdfIds.length === 0) {
      alert('Please select at least one PDF from the Library');
      return;
    }

    setIsGenerating(true);
    try {
      const selectedPdfs = pdfs.filter(p => selectedPdfIds.includes(p.id));
      const pdfContext = selectedPdfs.map(p => p.title).join(', ');

      // Use the first selected PDF's backend ID for backend API call
      const primaryPdf = selectedPdfs[0];
      const backendPdfId = primaryPdf.backendId || primaryPdf.id;

      const questions = await generateQuizQuestions(pdfContext, quizType, questionCount, backendPdfId);

      const newQuiz: QuizType = {
        id: `quiz-${Date.now()}`,
        pdfIds: selectedPdfIds,
        quizType,
        questions,
        createdAt: new Date().toISOString(),
      };

      addQuiz(newQuiz);
      setCurrentQuiz(newQuiz);
      setAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    let score = 0;
    const maxScore = currentQuiz.questions.length;

    currentQuiz.questions.forEach((question) => {
      const userAnswer = answers[question.id] || '';
      if (userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        score++;
      }
    });

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: currentQuiz.id,
      answers,
      score,
      maxScore,
      completedAt: new Date().toISOString(),
    };

    addQuizAttempt(attempt);

    currentQuiz.questions.forEach((question) => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

      selectedPdfIds.forEach((pdfId) => {
        updateProgress({
          pdfId,
          topic: question.topic,
          strengthScore: isCorrect ? 80 : 40,
          quizCount: 1,
          correctAnswers: isCorrect ? 1 : 0,
          totalAnswers: 1,
          lastAttempt: new Date().toISOString(),
        });
      });
    });

    setShowResults(true);
  };

  const handleNewQuiz = () => {
    setCurrentQuiz(null);
    setAnswers({});
    setShowResults(false);
  };

  if (!currentQuiz) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-lg mb-4">
            <Play className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Generate Quiz</h2>
          <p className="text-gray-600">
            Test your knowledge with AI-generated questions from your selected PDFs
          </p>
        </div>

        {selectedPdfIds.length === 0 && (
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-6 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="font-medium text-black">No PDFs selected</p>
              <p className="text-sm text-gray-600 mt-1">
                Go to the Library tab and select PDFs to generate quizzes from.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-black rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-3">Question Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'mcq', label: 'MCQ' },
                { value: 'saq', label: 'Short Answer' },
                { value: 'laq', label: 'Long Answer' },
                { value: 'mixed', label: 'Mixed' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setQuizType(type.value as any)}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                    quizType === type.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-3">
              Number of Questions: {questionCount}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || selectedPdfIds.length === 0}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const getScore = () => {
    let score = 0;
    currentQuiz.questions.forEach((question) => {
      const userAnswer = answers[question.id] || '';
      if (userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        score++;
      }
    });
    return score;
  };

  const score = showResults ? getScore() : 0;
  const percentage = showResults ? Math.round((score / currentQuiz.questions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {showResults && (
        <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-black mb-2">Quiz Completed!</h3>
            <div className="text-4xl font-bold text-black mb-2">
              {score} / {currentQuiz.questions.length}
            </div>
            <div className="text-lg text-gray-600">Score: {percentage}%</div>
          </div>
          <button
            onClick={handleNewQuiz}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Generate New Quiz
          </button>
        </div>
      )}

      <div className="space-y-6">
        {currentQuiz.questions.map((question, index) => {
          const userAnswer = answers[question.id] || '';
          const isCorrect =
            showResults &&
            userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          const isAnswered = !!userAnswer;

          return (
            <div
              key={question.id}
              className={`bg-white border-2 rounded-lg p-6 ${
                showResults
                  ? isCorrect
                    ? 'border-green-500'
                    : isAnswered
                    ? 'border-red-500'
                    : 'border-gray-300'
                  : 'border-black'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium bg-black text-white px-3 py-1 rounded">
                      Q{index + 1}
                    </span>
                    <span className="text-sm text-gray-600">{question.type.toUpperCase()}</span>
                    <span className="text-sm text-gray-600">• {question.topic}</span>
                  </div>
                  <h4 className="text-lg font-medium text-black">{question.question}</h4>
                </div>
                {showResults && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : isAnswered ? (
                      <XCircle className="w-6 h-6 text-red-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              {question.type === 'mcq' && question.options ? (
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const isSelected = userAnswer === option;
                    const isCorrectOption = showResults && option === question.correctAnswer;

                    return (
                      <button
                        key={optIndex}
                        onClick={() => !showResults && setAnswers({ ...answers, [question.id]: option })}
                        disabled={showResults}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          showResults
                            ? isCorrectOption
                              ? 'border-green-500 bg-green-50'
                              : isSelected
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                            : isSelected
                            ? 'border-black bg-gray-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              showResults
                                ? isCorrectOption
                                  ? 'border-green-500 bg-green-500'
                                  : isSelected
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-gray-300'
                                : isSelected
                                ? 'border-black bg-black'
                                : 'border-gray-300'
                            }`}
                          >
                            {(isSelected || isCorrectOption) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={userAnswer}
                  onChange={(e) =>
                    !showResults && setAnswers({ ...answers, [question.id]: e.target.value })
                  }
                  disabled={showResults}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none disabled:bg-gray-50"
                  rows={question.type === 'laq' ? 6 : 3}
                />
              )}

              {showResults && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-black mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-black mb-1">Correct Answer:</p>
                      <p className="text-gray-700">{question.correctAnswer}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults && (
        <div className="sticky bottom-4 mt-6">
          <button
            onClick={handleSubmitQuiz}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}
