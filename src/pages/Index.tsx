import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import LoginModal from "@/components/LoginModal";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isLoggedIn={true}
          onMenuClick={handleLogout}
        />
        <Dashboard userEmail={userEmail} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLogin={() => setShowLogin(true)}
        isLoggedIn={false}
      />
      <Hero onGetStarted={() => setShowLogin(true)} />
      
      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
