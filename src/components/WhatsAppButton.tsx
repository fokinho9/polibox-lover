import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://api.whatsapp.com/send?phone=5521996327544&text=Olá! Vim pelo site e gostaria de saber mais informações.", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      style={{
        animation: 'pulse-whatsapp 2s ease-in-out infinite',
      }}
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7 group-hover:scale-110 transition-transform" />
      <span className="sr-only">Atendimento WhatsApp</span>
      
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-2 bg-card border border-border rounded-lg px-2 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <span className="text-xs font-medium">Fale conosco!</span>
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-[-45deg]" />
      </div>
      
      <style>{`
        @keyframes pulse-whatsapp {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4), 0 25px 50px -12px rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(34, 197, 94, 0), 0 25px 50px -12px rgba(34, 197, 94, 0.6);
          }
        }
      `}</style>
    </button>
  );
};

export default WhatsAppButton;
