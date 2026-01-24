import { useState } from "react";
import { Gift, CheckCircle, ChevronRight, Sparkles, Star, Zap, Car, Clock, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuiz } from "@/contexts/QuizContext";
import confetti from "canvas-confetti";

const questions = [
  {
    question: "Qual tipo de veículo você mais cuida?",
    icon: Car,
    options: ["Carro", "Moto", "Ambos", "Outro"]
  },
  {
    question: "Com que frequência você lava seu veículo?",
    icon: Clock,
    options: ["Toda semana", "A cada 15 dias", "Uma vez por mês", "Raramente"]
  },
  {
    question: "Qual é sua maior prioridade no cuidado do veículo?",
    icon: Shield,
    options: ["Limpeza", "Brilho e proteção", "Interior", "Tudo isso"]
  },
  {
    question: "Você já usou produtos profissionais de detalhamento?",
    icon: Heart,
    options: ["Sim, sempre uso", "Já experimentei", "Nunca, mas tenho interesse", "Não conheço"]
  }
];

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fireConfetti = () => {
  const colors = ['#00E5FF', '#00B8D4', '#FFD700'];

  // Single gentle burst
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { y: 0.6, x: 0.5 },
    colors: colors,
    gravity: 1.2
  });
};

const QuizModal = ({ open, onOpenChange }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { completeQuiz } = useQuiz();

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    
    setTimeout(() => {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setCompleted(true);
        completeQuiz();
        setTimeout(() => fireConfetti(), 300);
      }
    }, 400);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentQuestion(0);
      setAnswers([]);
      setCompleted(false);
      setSelectedOption(null);
    }, 300);
  };

  const CurrentIcon = questions[currentQuestion]?.icon || Gift;

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={false}>
      <DialogContent 
        className="sm:max-w-sm p-0 overflow-hidden border-0 bg-transparent shadow-none" 
        overlayBlur
      >
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-primary/30 shadow-2xl shadow-primary/30 overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-cyan-glow/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-4">
            {!completed ? (
              <div className="space-y-4">
                {/* Header with icon */}
                <div className="text-center">
                  {/* Reinauguration Banner */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full shadow-lg shadow-orange-500/40 mb-3">
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                    <span className="text-white text-xs font-bold uppercase">🎉 Reinauguração</span>
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                  </div>
                  
                  <div className="relative inline-flex items-center justify-center mb-3">
                    <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400">
                    GANHE 40% OFF
                  </h2>
                  <p className="text-muted-foreground text-xs mt-1">
                    Responda e ganhe desconto exclusivo!
                  </p>
                </div>

                {/* Progress bar */}
                <div className="relative">
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          i < currentQuestion 
                            ? "bg-gradient-to-r from-primary to-cyan-glow" 
                            : i === currentQuestion 
                              ? "bg-primary/70" 
                              : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-center">
                    {currentQuestion + 1} de {questions.length}
                  </p>
                </div>

                {/* Question */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 mb-2">
                    <CurrentIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-tight">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {questions[currentQuestion].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedOption !== null}
                      className={`w-full group relative overflow-hidden rounded-lg border transition-all duration-300 ${
                        selectedOption === option
                          ? "border-primary bg-primary/20 scale-[0.98]"
                          : "border-gray-700 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-between p-3">
                        <span className={`text-sm font-medium transition-colors ${
                          selectedOption === option ? "text-primary" : "text-foreground"
                        }`}>
                          {option}
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-all duration-300 ${
                          selectedOption === option 
                            ? "text-primary translate-x-1" 
                            : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Success state */
              <div className="text-center py-4 space-y-4">
                {/* Animated success icon */}
                <div className="relative inline-flex">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-primary rounded-full flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Success message */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                    PARABÉNS!
                  </h3>
                  
                  <div className="px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400">
                      40% OFF
                    </p>
                    <p className="text-xs text-white/70 mt-0.5">
                      Desconto ativado!
                    </p>
                  </div>
                </div>

                {/* Timer warning */}
                <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs">
                  <Clock className="h-3 w-3" />
                  <span className="font-semibold">Válido por 30 minutos</span>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleClose}
                  className="w-full h-11 text-sm font-bold bg-gradient-to-r from-primary to-cyan-glow text-primary-foreground rounded-lg shadow-lg shadow-primary/30"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  APROVEITAR AGORA
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
