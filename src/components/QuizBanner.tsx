import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/contexts/QuizContext";
import QuizModal from "./QuizModal";

const QuizBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasCompletedQuiz } = useQuiz();

  if (hasCompletedQuiz) {
    return (
      <div className="bg-gradient-to-r from-primary/20 via-cyan-glow/10 to-primary/20 border-y border-primary/30 py-3">
        <div className="container-main flex items-center justify-center gap-3">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-primary font-bold">40% OFF ATIVADO</span>
          <span className="text-muted-foreground">em todos os produtos!</span>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-y border-yellow-500/30 py-3">
        <div className="container-main flex items-center justify-center gap-3 flex-wrap">
          <Gift className="h-5 w-5 text-yellow-400" />
          <span className="text-foreground font-medium">Responda 4 perguntas e ganhe</span>
          <span className="text-yellow-400 font-bold">40% OFF</span>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold ml-2"
          >
            Participar
          </Button>
        </div>
      </div>
      <QuizModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default QuizBanner;
