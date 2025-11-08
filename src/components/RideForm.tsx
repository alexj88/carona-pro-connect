import React, { useState } from 'react';
import { Corrida } from '../types';

// Omitimos campos gerados automaticamente ou não necessários na solicitação
type RideRequestData = Omit<Corrida, 'id' | 'motorista_id' | 'status' | 'data_solicitacao' | 'data_conclusao'>;

interface RideFormProps {
    onSubmit: (data: RideRequestData) => Promise<void>;
}

const initialFormData: RideRequestData = {
    passageiro_id: 0,
    origem: '',
    destino: '',
};

const RideForm: React.FC<RideFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<RideRequestData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'passageiro_id' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.passageiro_id <= 0) {
            alert("Por favor, insira um ID de passageiro válido.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData(initialFormData); // Limpa o formulário
        } catch (error) {
            // O tratamento de erro será feito no componente pai
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ border: '1px solid #0056b3', padding: '20px', marginBottom: '30px', borderRadius: '5px' }}>
            <h2>Solicitar Nova Corrida (POST)</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                
                <div>
                    <label>ID do Passageiro:</label>
                    <input
                        type="number"
                        name="passageiro_id"
                        value={formData.passageiro_id === 0 ? '' : formData.passageiro_id}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '5px', width: '100px' }}
                    />
                </div>
                
                <div>
                    <label>Origem:</label>
                    <input
                        type="text"
                        name="origem"
                        value={formData.origem}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '5px' }}
                    />
                </div>
                
                <div>
                    <label>Destino:</label>
                    <input
                        type="text"
                        name="destino"
                        value={formData.destino}
                        onChange={handleChange}
                        required
                        style={{ marginLeft: '5px' }}
                    />
                </div>
                
                <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#0056b3', color: 'white', padding: '10px 15px' }}>
                    {isSubmitting ? 'Solicitando...' : 'Solicitar Corrida'}
                </button>
            </form>
        </div>
    );
};

export default RideForm;