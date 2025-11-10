import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ... outras importações
import Index from './pages/Index'; // Sua página principal (Dashboard)
import About from './pages/About'; 
import NotFound from './pages/NotFound';

// Importações dos Componentes de Página de Gerenciamento
import UsuarioPage from './pages/UsuarioPage';
import MotoristaPage from './pages/MotoristasPage';
import CorridaPage from './pages/CorridaPage';

const App: React.FC = () => {
    // ... const queryClient = new QueryClient();

    return (
        // <QueryClientProvider client={queryClient}>
        // <TooltipProvider>
        // <Sonner>
        <Router> 
            <Routes>
                {/* 1. ROTAS DO FRONTEND VISUAL (AS QUE JÁ EXISTIAM) */}
                <Route path="/" element={<Index />} />        {/* Home/Dashboard */}
                <Route path="/about" element={<About />} />

                {/* 2. NOVAS ROTAS PARA AS PÁGINAS DE GERENCIAMENTO (ADMIN) */}
                {/* Use /admin para separar as rotas do CRUD do seu layout principal */}
                <Route path="/admin/corridas" element={<CorridaPage />} />
                <Route path="/admin/usuarios" element={<UsuarioPage />} />
                <Route path="/admin/motoristas" element={<MotoristaPage />} />

                {/* Rota para 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
        // </Sonner>
        // </TooltipProvider>
        // </QueryClientProvider>
    );
};

export default App;