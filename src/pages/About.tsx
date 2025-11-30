import React from "react";
import heroBg from "@/assets/hero-rideshare.jpg";
import Header from "@/components/Header";
const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} onMenuClick={() => {}} />
    
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      

      <div className="absolute inset-0 bg-black/60" />
      <div className="container mx-auto py-8 px-4 relative z-10 text-white">
        <h2 className="text-3xl font-extrabold mb-4 text-primary">
          Sobre o Carona Pro Connect
        </h2>
        <p className="mb-4 text-lg text-white/80">
          O{" "}
          <span className="font-semibold text-primary">Carona Pro Connect</span>{" "}
          é uma plataforma pensada para facilitar a conexão entre colaboradores
          da Accenture que desejam compartilhar caronas para o trabalho ou
          eventos.
        </p>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Recursos principais:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Criação e gerenciamento de grupos de carona.</li>
            <li>Visualização de caronas disponíveis em tempo real.</li>
            <li>Chat integrado para combinar detalhes do trajeto.</li>
            <li>Perfil personalizado para cada usuário.</li>
            <li>Sistema de avaliação para motoristas e passageiros.</li>
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Nossa missão</h3>
          <p>
            Promover sustentabilidade, economia e integração entre equipes,
            tornando o deslocamento mais prático, seguro e colaborativo.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Como funciona?</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Faça seu cadastro ou login na plataforma.</li>
            <li>Crie ou entre em grupos de carona.</li>
            <li>Procure por caronas disponíveis ou ofereça uma.</li>
            <li>Combine os detalhes pelo chat e aproveite a viagem!</li>
          </ol>
        </div>
        <p className="mt-8 text-center text-white/60">
          &copy; {new Date().getFullYear()} Carona Pro Connect. Todos os
          direitos reservados.
        </p>
      </div>
    </div>
  </div>
  );
};

export default About;
