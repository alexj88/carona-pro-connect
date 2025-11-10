// src/pages/UsuarioPage.tsx (ATUALIZADO)

import React, { useState, useEffect } from 'react';
import { getUsuarios, deleteUsuario, createUsuario, updateUsuario } from '../services/usuarioService';
import { Usuario } from '../types';
import UserForm from '../components/UserForm'; // Importa o formulário
import AdminNav from '../components/AdminNav';

const UsuarioPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estado para controlar a edição (se null, está no modo criação ou lista)
    const [editingUser, setEditingUser] = useState<Usuario | null>(null); 
    
    // Estado para mostrar o formulário de criação
    const [showCreateForm, setShowCreateForm] = useState(false);

    // --- Lógica de Carregamento e Deleção (Existente) ---
    
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

    useEffect(() => {
        loadUsuarios();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;
        
        try {
            await deleteUsuario(id);
            loadUsuarios(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao deletar usuário.");
        }
    };

    // --- Lógica de Criação e Edição (NOVO) ---
    
    // Função acionada pelo UserForm (para CREATE ou UPDATE)
    const handleFormSubmit = async (formData: Omit<Usuario, 'id'> & { id?: number }) => {
        setError(null); // Limpa erros anteriores
        
        try {
            if (formData.id) {
                // Modo Edição (PUT)
                await updateUsuario(formData.id, formData);
                alert('Usuário atualizado com sucesso!');
                setEditingUser(null); // Sai do modo edição
            } else {
                // Modo Criação (POST)
                await createUsuario(formData);
                alert('Usuário criado com sucesso!');
                setShowCreateForm(false); // Esconde o formulário de criação
            }
            loadUsuarios(); // Recarrega a lista
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro ao salvar usuário.";
            setError(errorMessage);
        }
    };
    
    const handleCancelForm = () => {
        setEditingUser(null);
        setShowCreateForm(false);
    };

    // --- Renderização ---
    
    if (loading) return <div>Carregando lista de usuários...</div>;
    
    return (
    <>
        <AdminNav />
        <div style={{ padding: '20px' }}>
            <h1>Gerenciamento de Usuários</h1>

            {error && <div style={{ color: 'white', backgroundColor: 'red', padding: '10px', marginBottom: '15px' }}>{error}</div>}

            {/* Renderiza o formulário se estiver em modo criação OU edição */}
            {(showCreateForm || editingUser) ? (
                <UserForm 
                    initialData={editingUser} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleCancelForm}
                />
            ) : (
                <button onClick={() => setShowCreateForm(true)} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    + Adicionar Novo Usuário
                </button>
            )}
            
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
                                onClick={() => setEditingUser(user)} // Entra no modo edição
                                disabled={!!editingUser}
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
    </>
    );
};

export default UsuarioPage;