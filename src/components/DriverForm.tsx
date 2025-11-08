import React, { useState, useEffect } from 'react';
import { Motorista } from '../types';

// Define o tipo para os dados do formulário
type DriverFormData = Omit<Motorista, 'id'> & { id?: number };

interface DriverFormProps {
    initialData?: Motorista | null; // Dados iniciais para edição
    onSubmit: (data: DriverFormData) => void;
    onCancel: () => void;
}

const emptyDriverData: DriverFormData = {
    nome: '',
    email: '',
    veiculo: '',
    placa: '',
};

const DriverForm: React.FC<DriverFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<DriverFormData>(emptyDriverData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efeito para preencher o formulário quando initialData (edição) muda
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(emptyDriverData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // O componente pai (MotoristaPage) fará a chamada API
        await onSubmit(formData); 
        setIsSubmitting(false);
        // Não limpa o formulário após o envio, se for edição, o setEditingUser(null) no pai fará o reset indireto
    };

    return (
        <div style={{ border: '1px solid #ff9900', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
            <h2>{initialData ? 'Editar Motorista' : 'Novo Motorista'}</h2>
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
                    <label>Veículo:</label>
                    <input
                        type="text"
                        name="veiculo"
                        value={formData.veiculo}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Placa:</label>
                    <input
                        type="text"
                        name="placa"
                        value={formData.placa}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#ff9900', color: 'white', marginRight: '10px', padding: '8px' }}>
                    {isSubmitting ? 'Salvando...' : (initialData ? 'Salvar Edição' : 'Criar Motorista')}
                </button>
                <button type="button" onClick={onCancel} style={{ backgroundColor: '#ccc', padding: '8px' }}>
                    {initialData ? 'Cancelar Edição' : 'Cancelar'}
                </button>
            </form>
        </div>
    );
};

export default DriverForm;