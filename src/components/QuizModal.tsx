import { useState } from "react";
import { Gift, CheckCircle, ChevronRight, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuiz } from "@/contexts/QuizContext";

const questions = [
  {
    question: "Qual tipo de veículo você mais cuida?",
    options: ["Carro", "Moto", "Ambos", "Outro"]
  },
  {
    question: "Com que frequência você lava seu veículo?",
    options: ["Toda semana", "A cada 15 dias", "Uma vez por mês", "Raramente"]
  },
  {
    question: "Qual é sua maior prioridade no cuidado do veículo?",
    options: ["Limpeza", "Brilho e proteção", "Interior", "Tudo isso"]
  },
  {
    question: "Você já usou produtos profissionais de detalhamento?",
    options: ["Sim, sempre uso", "Já experimentei", "Nunca, mas tenho interesse", "Não conheço"]
  }
];

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuizModal = ({ open, onOpenChange }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const { completeQuiz } = useQuiz();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCompleted(true);
      completeQuiz();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset for next time
    setTimeout(() => {
      setCurrentQuestion(0);
      setAnswers([]);
      setCompleted(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={false}>
      <DialogContent 
        className="sm:max-w-md bg-card/95 backdrop-blur-md border-primary/30 shadow-2xl shadow-primary/20 data-[state=open]:animate-[fade-in_0.4s_ease-out,scale-in_0.3s_ease-out] data-[state=closed]:animate-[fade-out_0.3s_ease-out,scale-out_0.2s_ease-out]" 
        overlayBlur
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-display text-2xl">
            <Gift className="h-6 w-6" />
            {completed ? "Parabéns!" : "Ganhe 40% OFF"}
          </DialogTitle>
        </DialogHeader>

        {!completed ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentQuestion ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Pergunta {currentQuestion + 1} de {questions.length}
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                {questions[currentQuestion].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-between text-left h-auto py-3 border-border hover:border-primary hover:bg-primary/10"
                  onClick={() => handleAnswer(option)}
                >
                  <span>{option}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-cyan-glow rounded-full flex items-center justify-center animate-pulse-glow">
                <CheckCircle className="h-10 w-10 text-primary-foreground" />
              </div>
              <Sparkles className="absolute top-0 right-1/4 h-6 w-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute bottom-0 left-1/4 h-4 w-4 text-primary animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-display text-primary mb-2">
                40% DE DESCONTO ATIVADO!
              </h3>
              <p className="text-muted-foreground">
                Seu desconto foi aplicado automaticamente em todos os produtos da loja.
              </p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-cyan-glow text-primary-foreground font-semibold"
            >
              Aproveitar Agora
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
