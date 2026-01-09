import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  return (
    <Button
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg shadow-green-500/30 animate-pulse-glow"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Atendimento</span>
    </Button>
  );
};

export default WhatsAppButton;
