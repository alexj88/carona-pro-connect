import { Button } from "@/components/ui/button";
import { Car, Menu, User } from "lucide-react";
import appIcon from "@/assets/app-icon.png";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Link } from "react-router-dom";

interface HeaderProps {
  onLogin?: () => void;
  onMenuClick?: () => void;
  isLoggedIn?: boolean;
}

const Header = ({ onLogin, onMenuClick, isLoggedIn = false }: HeaderProps) => {
  const handleLogout = () => {
    window.location.href = "/";
  };
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
          {/* Links removidos conforme solicitado */}
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            Sobre
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-3">
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <span className="font-bold">João Silva</span>
                        <div className="text-xs text-muted-foreground">joao.silva@email.com</div>
                      </div>
                    </div>
                    <div className="w-full border-t my-2" />
                    <Link to="/profile" className="text-sm text-primary hover:underline">Editar perfil</Link>
                    <span className="text-xs text-green-600">Status: Online</span>
                    <div className="w-full border-t my-2" />
                    <div className="w-full">
                      <span className="font-semibold text-sm mb-1 block">Histórico de Caronas</span>
                      <ul className="text-xs space-y-1">
                        <li>12/09/2025 - São Paulo → Alphaville</li>
                        <li>05/09/2025 - Alphaville → São Paulo</li>
                        <li>28/08/2025 - São Paulo → Alphaville</li>
                        <li className="text-muted-foreground">...mais</li>
                      </ul>
                    </div>
                    <Button variant="destructive" size="sm" className="w-full mt-2" onClick={handleLogout}>Sair</Button>
                  </div>
                </PopoverContent>
              </Popover>
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