import { Button } from "@/components/ui/button";
import { Car, Users, MapPin, Star } from "lucide-react";
import heroImage from "@/assets/hero-rideshare.jpg";

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Conecte-se,
            <br />
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Compartilhe,
            </span>
            <br />
            Economize
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            A plataforma de caronas corporativas da Accenture que conecta colegas, 
            reduz custos e promove sustentabilidade.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Car className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Caronas Seguras</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Times Conectados</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Rotas Inteligentes</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <Star className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Avaliações</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6"
            >
              Começar Agora
            </Button>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;