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
        className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none" 
        overlayBlur
      >
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-primary/30 shadow-2xl shadow-primary/30 overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-glow/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6">
            {!completed ? (
              <div className="space-y-6">
                {/* Header with icon */}
                <div className="text-center">
                  {/* Reinauguration Banner */}
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full blur-xl opacity-60 animate-pulse" />
                    <div className="relative flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full shadow-lg shadow-orange-500/50">
                      <Star className="h-4 w-4 text-yellow-300 animate-pulse" />
                      <span className="text-white text-sm font-bold uppercase tracking-wider">🎉 Reinauguração 🎉</span>
                      <Star className="h-4 w-4 text-yellow-300 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full blur-lg opacity-60 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/50">
                      <Gift className="h-8 w-8 text-white" />
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 animate-pulse" />
                    <Zap className="absolute -bottom-1 -left-1 h-4 w-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400 animate-pulse">
                    GANHE 40% OFF
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Desconto exclusivo de reinauguração!
                  </p>
                </div>

                {/* Progress bar */}
                <div className="relative">
                  <div className="flex gap-1.5">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                          i < currentQuestion 
                            ? "bg-gradient-to-r from-primary to-cyan-glow shadow-sm shadow-primary/50" 
                            : i === currentQuestion 
                              ? "bg-gradient-to-r from-primary/80 to-cyan-glow/80 animate-pulse" 
                              : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {currentQuestion + 1} de {questions.length}
                  </p>
                </div>

                {/* Question */}
                <div className="text-center py-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-3">
                    <CurrentIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {questions[currentQuestion].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedOption !== null}
                      className={`w-full group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                        selectedOption === option
                          ? "border-primary bg-primary/20 scale-[0.98]"
                          : "border-gray-700 hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-between p-4">
                        <span className={`font-medium transition-colors ${
                          selectedOption === option ? "text-primary" : "text-foreground"
                        }`}>
                          {option}
                        </span>
                        <ChevronRight className={`h-5 w-5 transition-all duration-300 ${
                          selectedOption === option 
                            ? "text-primary translate-x-1" 
                            : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                        }`} />
                      </div>
                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Success state */
              <div className="text-center py-6 space-y-6">
                {/* Animated success icon */}
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-primary to-cyan-glow rounded-full blur-xl opacity-60 animate-pulse scale-110" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 via-primary to-cyan-glow rounded-full flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>
                  <Star className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-pulse" />
                  <Zap className="absolute -bottom-1 -left-2 h-6 w-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="absolute top-1/2 -right-4 h-5 w-5 text-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>

                {/* Success message */}
                <div className="space-y-3">
                  {/* Reinauguration Badge */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full blur-lg opacity-60 animate-pulse" />
                    <div className="relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full shadow-lg shadow-orange-500/50">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Reinauguração</span>
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 animate-pulse">
                    PARABÉNS!
                  </h3>
                  
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-orange-500/30 rounded-xl blur-md" />
                    <div className="relative px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border-2 border-orange-500/50">
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400">
                        40% OFF
                      </p>
                      <p className="text-sm text-white/80 mt-1">
                        Desconto de reinauguração ativado!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timer warning */}
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-sm">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span className="font-semibold">Válido por 30 minutos</span>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleClose}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-cyan-glow to-primary bg-[length:200%_100%] hover:bg-[length:100%_100%] transition-all duration-500 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
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
