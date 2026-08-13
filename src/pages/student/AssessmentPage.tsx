import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StudentLayout } from '../../components/layout/StudentLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Clock, Award } from 'lucide-react';

const mockQuizData = {
  title: 'Module Quiz: Supervised Learning',
  passingScore: 80,
  questions: [
    {
      id: 1,
      text: 'Which evaluation metric is most sensitive to large outlier errors in Linear Regression models?',
      options: ['Mean Absolute Error (MAE)', 'Mean Squared Error (MSE)', 'R-Squared Score', 'Classification Accuracy'],
      correctAnswer: 1, // MSE
    },
    {
      id: 2,
      text: 'What is the primary purpose of the activation function in a neural network?',
      options: ['To initialize weights', 'To introduce non-linearity', 'To normalize the input', 'To calculate the loss'],
      correctAnswer: 1,
    },
    {
      id: 3,
      text: 'Which of the following algorithms is best suited for classification tasks?',
      options: ['Linear Regression', 'K-Means Clustering', 'Logistic Regression', 'Principal Component Analysis'],
      correctAnswer: 2,
    }
  ]
};

export const AssessmentPage: React.FC = () => {
  const { courseId, assessmentId } = useParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = mockQuizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuizData.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optIndex
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentQuestionIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirstQuestion) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    mockQuizData.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
    
    const percentage = Math.round((correctCount / mockQuizData.questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);
  };

  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined;

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Assessment Engine</span>
            <h1 className="text-xl font-black text-slate-900 mt-0.5">{mockQuizData.title}</h1>
            <p className="text-xs text-slate-500">Passing score: {mockQuizData.passingScore}% • Multiple Choice</p>
          </div>
          {!submitted && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-bold shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Time Left: 14:45</span>
            </div>
          )}
        </div>

        {!submitted ? (
          <Card className="p-6 md:p-8 space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Question {currentQuestionIndex + 1} of {mockQuizData.questions.length}</span>
                <span>{Math.round(((currentQuestionIndex) / mockQuizData.questions.length) * 100)}% Completed</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex) / mockQuizData.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 text-lg leading-relaxed">
                {currentQuestion.text}
              </h3>

              <div className="space-y-3 text-sm">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm transform scale-[1.01]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 text-slate-500'}`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        {opt}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <Button variant="outline" onClick={handlePrev} disabled={isFirstQuestion}>
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button variant="primary" onClick={handleSubmit} disabled={!hasAnsweredCurrent}>
                  Submit Assessment
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNext} disabled={!hasAnsweredCurrent}>
                  Next Question
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${score >= mockQuizData.passingScore ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              <Award className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">
                {score >= mockQuizData.passingScore ? 'Assessment Passed! 🎉' : 'Assessment Failed'}
              </h2>
              <p className="text-slate-600">
                You scored <strong className={`text-xl ${score >= mockQuizData.passingScore ? 'text-emerald-600' : 'text-red-600'}`}>{score}%</strong>. 
                {score >= mockQuizData.passingScore ? ' Backend verification recorded.' : ` You need ${mockQuizData.passingScore}% to pass.`}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-center gap-4">
              <Link to="/student/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              {score >= mockQuizData.passingScore ? (
                <Link to="/student/certificates">
                  <Button variant="primary">Claim Certificate</Button>
                </Link>
              ) : (
                <Button variant="primary" onClick={() => {
                  setSubmitted(false);
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                }}>
                  Retake Assessment
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
};
