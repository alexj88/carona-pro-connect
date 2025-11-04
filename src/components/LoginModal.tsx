import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Lock, User, Building } from "lucide-react";
import { useGoogleLogin, CredentialResponse } from "@react-oauth/google";
import SocialButton from "@/components/ui/social-button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  // Login tradicional
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
      onClose();
    }
  };

  // Registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      console.log("Registro:", { name, email, company, role, department, photo });
      onLogin(email);
      onClose();
    }
  };

  // Login com Google usando hook
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Token do Google:", tokenResponse.access_token);
      // Aqui você pode usar o token para pegar dados do usuário ou enviar para backend
      onLogin("google-user"); // substitua pelo email real se decodificar o token
      onClose();
    },
    onError: () => console.log("Login com Google falhou"),
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Bem-vindo ao Corp Ride
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Entre em sua conta</CardTitle>
                <CardDescription>Use seu email corporativo da Accenture</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@accenture.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="gradient" className="w-full">
                    Entrar
                  </Button>
                </form>

                {/* Botão Google */}
                <div className="mt-4 space-y-2">
                  <SocialButton
                    variant="outline"
                    className="w-full"
                    icon={
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 533.5 544.3"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Google"
                      >
                        <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.6-37.7-4.9-55.8H272v105.6h146.9c-6.3 34.1-25.3 62.9-54 82.1v68h87.2c51-47 80.4-116.3 80.4-199.9z"/>
                        <path fill="#34A853" d="M272 544.3c73 0 134.4-24.1 179.2-65.3l-87.2-68c-24.2 16.3-55.1 26-92 26-70.8 0-130.9-47.8-152.4-112.1H31.2v70.6C75.6 493 170.6 544.3 272 544.3z"/>
                        <path fill="#FBBC05" d="M119.6 323.5c-10.7-31.9-10.7-66.4 0-98.3V154.6H31.2c-39.1 76.2-39.1 167.1 0 243.3l88.4-74.4z"/>
                        <path fill="#EA4335" d="M272 107.8c39.6 0 75.3 13.6 103.4 40.4l77.6-77.6C405.9 24.4 347.1 0 272 0 170.6 0 75.6 51.3 31.2 126.6l88.4 70.6C141.1 155.6 201.2 107.8 272 107.8z"/>
                      </svg>
                    }
                    onClick={() => googleLogin()}
                  >
                    Entrar com Google
                  </SocialButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registro */}
          <TabsContent value="register">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>Registre-se para começar a compartilhar caronas</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Mantém todos os campos de registro: Nome, Email, Empresa, Cargo, Setor, Foto e Senha */}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;