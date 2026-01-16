import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface QuizContextType {
  hasCompletedQuiz: boolean;
  discountPercent: number;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const discountPercent = 40;

  useEffect(() => {
    const quizCompleted = localStorage.getItem("quiz_completed");
    if (quizCompleted === "true") {
      setHasCompletedQuiz(true);
    }
  }, []);

  const completeQuiz = () => {
    setHasCompletedQuiz(true);
    localStorage.setItem("quiz_completed", "true");
  };

  const resetQuiz = () => {
    setHasCompletedQuiz(false);
    localStorage.removeItem("quiz_completed");
  };

  return (
    <QuizContext.Provider value={{ hasCompletedQuiz, discountPercent, completeQuiz, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
