// src/pages/UsuarioPage.tsx (Exemplo de componente)

import React, { useState, useEffect } from 'react';
import { getUsuarios, deleteUsuario } from '../services/usuarioService';
import { Usuario } from '../types';

const UsuarioPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para carregar os dados
    const loadUsuarios = async () => {
        setLoading(true);
        try {
            const data = await getUsuarios();
            setUsuarios(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    // Efeito para carregar os dados na montagem do componente
    useEffect(() => {
        loadUsuarios();
    }, []);

    // Função para deletar um usuário
    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;
        
        try {
            await deleteUsuario(id);
            // Se deletado com sucesso, recarrega a lista
            loadUsuarios(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao deletar usuário.");
        }
    };


    if (loading) return <div>Carregando lista de usuários...</div>;
    if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gerenciamento de Usuários</h1>
            {/* Aqui você adicionaria um formulário para POST/PUT */}
            
            <h2>Lista de Usuários</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {usuarios.length === 0 ? (
                    <li>Nenhum usuário cadastrado.</li>
                ) : (
                    usuarios.map((user) => (
                        <li key={user.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                            <strong>{user.nome}</strong> ({user.email})
                            <p>Telefone: {user.telefone || 'N/A'}</p>
                            <button 
                                onClick={() => alert(`Ação de Edição para o usuário ${user.id}`)}
                                style={{ marginRight: '10px' }}
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(user.id)} 
                                style={{ backgroundColor: 'red', color: 'white' }}
                            >
                                Deletar
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default UsuarioPage;