import React from 'react';
import { Link } from 'react-router-dom';

const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50', // Cor para diferenciar do tema principal
    marginBottom: '20px',
    color: 'white'
};

const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'underline',
    fontWeight: 'bold',
};

const AdminNav: React.FC = () => {
    return (
        <nav style={navStyle}>
            <span>Painel CRUD:</span>
            <Link to="/admin/corridas" style={linkStyle}>Corridas</Link>
            <Link to="/admin/usuarios" style={linkStyle}>Usuários</Link>
            <Link to="/admin/motoristas" style={linkStyle}>Motoristas</Link>
            <Link to="/" style={{ ...linkStyle, marginLeft: 'auto' }}>Voltar ao Dashboard Principal</Link>
        </nav>
    );
};

export default AdminNav;