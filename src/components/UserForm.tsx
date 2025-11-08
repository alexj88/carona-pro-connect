import React, { useState, useEffect } from 'react';
import { Usuario } from '../types';

// Define o tipo para os dados do formulário, que pode incluir 'id' se for edição.
type UserFormData = Omit<Usuario, 'id'> & { id?: number };

interface UserFormProps {
    initialData?: Usuario | null; // Dados iniciais para edição
    onSubmit: (data: UserFormData) => void;
    onCancel: () => void;
}

const emptyUserData: UserFormData = {
    nome: '',
    email: '',
    telefone: '',
};

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<UserFormData>(emptyUserData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito para preencher o formulário quando initialData (edição) muda
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(emptyUserData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // O componente pai (UsuarioPage) fará a chamada API
        await onSubmit(formData); 
        setIsSubmitting(false);
        setFormData(emptyUserData); // Limpa após o envio
    };

    return (
        <div style={{ border: '1px solid #007bff', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
            <h2>{initialData ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Telefone:</label>
                    <input
                        type="text"
                        name="telefone"
                        value={formData.telefone || ''}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#007bff', color: 'white', marginRight: '10px' }}>
                    {isSubmitting ? 'Salvando...' : (initialData ? 'Salvar Edição' : 'Criar Usuário')}
                </button>
                <button type="button" onClick={onCancel} style={{ backgroundColor: '#ccc' }}>
                    {initialData ? 'Cancelar Edição' : 'Cancelar'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;