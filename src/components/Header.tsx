import { Button } from "@/components/ui/button";
import { Car, Menu, User } from "lucide-react";
import appIcon from "@/assets/app-icon.png";

interface HeaderProps {
  onLogin?: () => void;
  onMenuClick?: () => void;
  isLoggedIn?: boolean;
}

const Header = ({ onLogin, onMenuClick, isLoggedIn = false }: HeaderProps) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={appIcon} alt="Accenture Ride" className="h-8 w-8 rounded-lg" />
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Accenture Ride
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-foreground/80 hover:text-primary transition-colors">
            Início
          </a>
          <a href="#rides" className="text-foreground/80 hover:text-primary transition-colors">
            Caronas
          </a>
          <a href="#groups" className="text-foreground/80 hover:text-primary transition-colors">
            Grupos
          </a>
          <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">
            Sobre
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={onMenuClick}>
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="gradient" onClick={onLogin}>
              Entrar
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;