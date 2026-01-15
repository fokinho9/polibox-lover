import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://api.whatsapp.com/send?phone=5521996327544&text=Olá! Vim pelo site e gostaria de saber mais informações.", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7 group-hover:scale-110 transition-transform" />
      <span className="sr-only">Atendimento WhatsApp</span>
      
    </button>
  );
};

export default WhatsAppButton;
