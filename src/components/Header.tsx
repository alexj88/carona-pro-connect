import { Button } from "@/components/ui/button";
import { Car, Menu, User, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import appIcon from "@/assets/app-icon.png";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Link } from "react-router-dom";

interface HeaderProps {
  onLogin?: () => void;
  onMenuClick?: () => void;
  isLoggedIn?: boolean;
}

const Header = ({ onLogin, onMenuClick, isLoggedIn = false }: HeaderProps) => {
  const [user, setUser] = useState<{ name: string; email: string; picture: string } | null>(null);
  const [status, setStatus] = useState<string>("Passageiro");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement | null>(null);

  // Recupera dados do usuário do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Monitora evento de login customizado
  useEffect(() => {
    const handleUserLogin = (event: Event) => {
      const customEvent = event as CustomEvent;
      setUser(customEvent.detail);
    };

    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  // Monitora mudanças no localStorage (para logout e abas diferentes)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("user");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fecha menu de status ao clicar fora
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!showStatusMenu) return;
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowStatusMenu(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [showStatusMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={appIcon} alt="Corp Ride" className="h-8 w-8 rounded-lg" />
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Corp Ride
            </h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            Sobre
          </Link>
        </nav>
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-3">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                      <div>
                        <span className="font-bold">{user.name}</span>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>

                    <div className="w-full border-t my-2" />

                    <Link
                      to="/profile"
                      className="text-sm text-primary hover:underline"
                    >
                      Editar perfil
                    </Link>

                    <div className="relative">
                      <button
                        className="flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-muted transition"
                        onClick={() => setShowStatusMenu((s) => !s)}
                        aria-haspopup="true"
                        aria-expanded={showStatusMenu}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            status === "Passageiro"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                          aria-hidden
                        />
                        {status === "Passageiro" ? (
                          <>
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{status}</span>
                          </>
                        ) : (
                          <>
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{status}</span>
                          </>
                        )}
                      </button>

                      {showStatusMenu && (
                        <div
                          ref={statusMenuRef}
                          className="absolute right-0 mt-1 w-48 bg-popover border rounded-md shadow-md p-2"
                        >
                          <button
                            className={`w-full text-left px-2 py-1 hover:bg-muted ${
                              status === "Passageiro"
                                ? "bg-primary/10 font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              setStatus("Passageiro");
                              setShowStatusMenu(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                              <span>Passageiro</span>
                            </div>
                          </button>
                          <button
                            className={`w-full text-left px-2 py-1 hover:bg-muted ${
                              status === "Motorista"
                                ? "bg-primary/10 font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              setStatus("Motorista");
                              setShowStatusMenu(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                              <span>Motorista</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="w-full border-t my-2" />

                    <div className="w-full">
                      <span className="font-semibold text-sm mb-1 block">
                        Histórico de Caronas
                      </span>
                      <ul className="text-xs space-y-1">
                        <li>12/09/2025 - Recife → Graças</li>
                        <li>05/09/2025 - Graças → Recife</li>
                        <li>28/08/2025 - Recife → Graças</li>
                        <li className="text-muted-foreground">...mais</li>
                      </ul>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                      onClick={handleLogout}
                    >
                      Sair
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button variant="gradient" onClick={onLogin}>
              Entrar
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
