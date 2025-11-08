import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    marginBottom: '20px',
};

const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: '4px',
};

const Layout: React.FC = () => {
    return (
        <div className="layout">
            <header style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
                <h1>Carona Pro Connect - Dashboard Administrativo</h1>
            </header>

            <nav style={navStyle}>
                <Link to="/" style={linkStyle}>Início (Corridas)</Link>
                <Link to="/usuarios" style={linkStyle}>Gerenciar Usuários</Link>
                <Link to="/motoristas" style={linkStyle}>Gerenciar Motoristas</Link>
            </nav>

            <main style={{ padding: '0 20px' }}>
                {/* O Outlet renderiza o componente da rota atual */}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;