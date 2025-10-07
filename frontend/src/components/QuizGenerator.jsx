import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Loader } from 'lucide-react';

const QuizGenerator = ({ pdfId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async (type = 'mixed') => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfId, type }),
      });
      const data = await response.json();
      setQuiz(data.questions);
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, answer) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };

  const submitQuiz = async () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (q.type === 'mcq' && userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / quiz.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Save to backend
    try {
      await fetch('/api/save-quiz-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfId,
          score: finalScore,
          totalQuestions: quiz.length,
          correctAnswers: correct,
          answers: userAnswers,
        }),
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  if (!pdfId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Please select a PDF to generate quizzes</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Quiz</h2>
        <p className="text-gray-600 mb-6">
          Test your knowledge with AI-generated quizzes from your study material
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateQuiz('mcq')}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin mx-auto" /> : 'MCQ Quiz'}
          </button>
          <button
            onClick={() => generateQuiz('saq')}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin mx-auto" /> : 'Short Answer'}
          </button>
          <button
            onClick={() => generateQuiz('mixed')}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader className="h-5 w-5 animate-spin mx-auto" /> : 'Mixed Quiz'}
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Results</h2>
          <div className="text-5xl font-bold text-primary-600 mb-2">{score}%</div>
          <p className="text-gray-600">
            You got {Object.values(userAnswers).filter((ans, idx) => ans === quiz[idx]?.correctAnswer).length} out of {quiz.length} correct
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {quiz.map((q, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-gray-800">Q{idx + 1}. {q.question}</p>
                {userAnswers[idx] === q.correctAnswer ? (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                )}
              </div>
              {q.type === 'mcq' && (
                <>
                  <p className="text-sm text-gray-600 mb-1">Your answer: {userAnswers[idx] || 'Not answered'}</p>
                  <p className="text-sm text-green-600 mb-2">Correct answer: {q.correctAnswer}</p>
                </>
              )}
              {q.explanation && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <div className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setQuiz(null);
            setShowResults(false);
          }}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Generate New Quiz
        </button>
      </div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {quiz.length}
          </span>
          <span className="text-sm text-gray-500">{question.type.toUpperCase()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h3>

      {question.type === 'mcq' && (
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(currentQuestion, option)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                userAnswers[currentQuestion] === option
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {(question.type === 'saq' || question.type === 'laq') && (
        <textarea
          value={userAnswers[currentQuestion] || ''}
          onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
          placeholder="Type your answer here..."
          rows={question.type === 'laq' ? 6 : 3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-6"
        />
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {currentQuestion === quiz.length - 1 ? (
          <button
            onClick={submitQuiz}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(Math.min(quiz.length - 1, currentQuestion + 1))}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
