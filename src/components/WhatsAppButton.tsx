import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://api.whatsapp.com/send?phone=5521996327544&text=Olá! Vim pelo site e gostaria de saber mais informações.", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 md:w-20 md:h-20 shadow-2xl shadow-green-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      style={{
        animation: 'pulse-whatsapp 2s ease-in-out infinite',
      }}
    >
      <MessageCircle className="h-8 w-8 md:h-10 md:w-10 group-hover:scale-110 transition-transform" />
      <span className="sr-only">Atendimento WhatsApp</span>
      
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 bg-card border border-border rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <span className="text-sm font-medium">Fale conosco!</span>
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
