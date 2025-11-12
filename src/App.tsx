import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Map from "./pages/Map";
import Ride from "./pages/Ride";
import UsuarioPage from "./pages/UsuarioPage";
import MotoristaPage from "./pages/MotoristasPage";
import CorridaPage from "./pages/CorridaPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider clientId="877812251895-p7lkq11ia84bjt4517dd8ijuphsb47n8.apps.googleusercontent.com">
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/map" element={<Map />} />
          
          {/* ROTAS DE ADMIN */}
                <Route path="/admin/corridas" element={<CorridaPage />} />
                <Route path="/admin/usuarios" element={<UsuarioPage />} />
                <Route path="/admin/motoristas" element={<MotoristaPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;