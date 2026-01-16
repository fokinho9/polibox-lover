import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface QuizContextType {
  hasCompletedQuiz: boolean;
  discountPercent: number;
  discountExpiresAt: Date | null;
  timeRemaining: string;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const DISCOUNT_DURATION_HOURS = 24;

const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return "00:00:00";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [discountExpiresAt, setDiscountExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("00:00:00");
  const discountPercent = 40;

  useEffect(() => {
    const savedExpiry = localStorage.getItem("quiz_discount_expires");
    if (savedExpiry) {
      const expiryDate = new Date(savedExpiry);
      if (expiryDate > new Date()) {
        setHasCompletedQuiz(true);
        setDiscountExpiresAt(expiryDate);
      } else {
        localStorage.removeItem("quiz_discount_expires");
        localStorage.removeItem("quiz_completed");
      }
    }
  }, []);

  useEffect(() => {
    if (!discountExpiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = discountExpiresAt.getTime() - now.getTime();
      
      if (remaining <= 0) {
        setHasCompletedQuiz(false);
        setDiscountExpiresAt(null);
        setTimeRemaining("00:00:00");
        localStorage.removeItem("quiz_discount_expires");
        localStorage.removeItem("quiz_completed");
        clearInterval(interval);
      } else {
        setTimeRemaining(formatTimeRemaining(remaining));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [discountExpiresAt]);

  const completeQuiz = () => {
    const expiryDate = new Date(Date.now() + DISCOUNT_DURATION_HOURS * 60 * 60 * 1000);
    setHasCompletedQuiz(true);
    setDiscountExpiresAt(expiryDate);
    localStorage.setItem("quiz_completed", "true");
    localStorage.setItem("quiz_discount_expires", expiryDate.toISOString());
  };

  const resetQuiz = () => {
    setHasCompletedQuiz(false);
    setDiscountExpiresAt(null);
    setTimeRemaining("00:00:00");
    localStorage.removeItem("quiz_completed");
    localStorage.removeItem("quiz_discount_expires");
  };

  return (
    <QuizContext.Provider value={{ hasCompletedQuiz, discountPercent, discountExpiresAt, timeRemaining, completeQuiz, resetQuiz }}>
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
