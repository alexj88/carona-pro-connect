import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Lock, User, Building } from "lucide-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name?: string, picture?: string) => void;
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
      const userData = { email, name: "Usuário Local", picture: "" };
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent("userLogin", { detail: userData }));
      onLogin(email, "Usuário Local", "");
      onClose();
    }
  };

  // Registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      console.log("Registro:", { name, email, company, role, department, photo });
      const userData = { email, name, picture: "" };
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new CustomEvent("userLogin", { detail: userData }));
      onLogin(email, name, "");
      onClose();
    }
  };

  // Login com Google
 const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
  if (credentialResponse.credential) {
    try {
      // Decode JWT payload without external library
      const token = credentialResponse.credential;
      const base64Url = token.split(".")[1] || "";
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded: any = JSON.parse(jsonPayload);

      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };

      // Salva no localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Dispara evento customizado para outras partes da app
      window.dispatchEvent(new CustomEvent("userLogin", { detail: userData }));

      // Passa para o Header e fecha o modal
      onLogin(decoded.email, decoded.name, decoded.picture);
      onClose();
    } catch (error) {
      console.error("Erro ao decodificar token do Google:", error);
    }
  }
};

  const handleGoogleError = () => {
    console.log("Login com Google falhou");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <TabsTrigger value="code">Entrar com Código</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
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

                {/* Login com Google */}
                <div className="mt-4">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOGIN POR CÓDIGO */}
          <TabsContent value="code">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Entrar com código</CardTitle>
                <CardDescription>Receba um código no email e use-o para entrar (simulado)</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // handled by sendCode/verifyCode buttons
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="code-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="code-email"
                        type="email"
                        placeholder="seu.email@accenture.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {!Boolean((localStorage.getItem("loginCodes") && JSON.parse(localStorage.getItem("loginCodes") || "{}")[email])) ? (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="gradient"
                        className="flex-1"
                        onClick={() => {
                          if (!email) return alert("Informe um email");
                          // generate 6-digit code
                          const code = Math.floor(100000 + Math.random() * 900000).toString();
                          const expires = Date.now() + 1000 * 60 * 10; // 10 min
                          let map = {} as any;
                          try { map = JSON.parse(localStorage.getItem("loginCodes") || "{}"); } catch(e) {}
                          map[email] = { code, expires };
                          localStorage.setItem("loginCodes", JSON.stringify(map));
                          // in real app send email; here we show alert for dev
                          alert("Código enviado (simulado): " + code);
                          // trigger UI update by forcing rerender via state change
                          setCodeSent(true);
                        }}
                      >
                        Enviar Código
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="verify-code">Código</Label>
                      <Input
                        id="verify-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        className="pl-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="gradient"
                          onClick={() => {
                            if (!email) return alert("Informe um email");
                            try {
                              const map = JSON.parse(localStorage.getItem("loginCodes") || "{}");
                              const entry = map[email];
                              if (!entry) return alert("Nenhum código encontrado para esse email. Peça um novo código.");
                              if (Date.now() > entry.expires) return alert("Código expirado. Peça um novo código.");
                              if (verificationCode.trim() !== entry.code) return alert("Código inválido.");

                              const userData = { email, name: "Usuário (código)", picture: "" };
                              localStorage.setItem("user", JSON.stringify(userData));
                              window.dispatchEvent(new CustomEvent("userLogin", { detail: userData }));
                              onLogin(email, userData.name, "");
                              onClose();
                            } catch (e) {
                              console.error(e);
                              alert("Erro ao verificar código.");
                            }
                          }}
                        >
                          Verificar Código
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            // allow resending
                            setVerificationCode("");
                            setCodeSent(false);
                            const map = JSON.parse(localStorage.getItem("loginCodes") || "{}");
                            if (map[email]) {
                              delete map[email];
                              localStorage.setItem("loginCodes", JSON.stringify(map));
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REGISTRO */}
          <TabsContent value="register">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>Registre-se para começar a compartilhar caronas</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@accenture.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Accenture"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Input
                      id="role"
                      type="text"
                      placeholder="Analista"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Setor</Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="TI, RH, etc."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo">Foto (opcional)</Label>
                    <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" variant="gradient" className="w-full">
                    Registrar
                  </Button>
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
