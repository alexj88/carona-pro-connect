import React, { useState, useEffect } from 'react';
import { getMotoristas, deleteMotorista } from '../services/motoristaService';
import { Motorista } from '../types';

const MotoristaPage: React.FC = () => {
    const [motoristas, setMotoristas] = useState<Motorista[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para carregar os dados
    const loadMotoristas = async () => {
        setLoading(true);
        try {
            const data = await getMotoristas();
            setMotoristas(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar motoristas.");
        } finally {
            setLoading(false);
        }
    };

    // Efeito para carregar os dados na montagem do componente
    useEffect(() => {
        loadMotoristas();
    }, []);

    // Função para deletar um motorista
    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este motorista?")) return;
        
        try {
            await deleteMotorista(id);
            // Se deletado com sucesso, recarrega a lista
            loadMotoristas(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao deletar motorista.");
        }
    };


    if (loading) return <div>Carregando lista de motoristas...</div>;
    if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gerenciamento de Motoristas</h1>
            {/* Aqui você adicionaria um formulário para POST/PUT */}
            
            <h2>Lista de Motoristas Cadastrados</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {motoristas.length === 0 ? (
                    <li>Nenhum motorista cadastrado.</li>
                ) : (
                    motoristas.map((driver) => (
                        <li key={driver.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                            <strong>{driver.nome}</strong> ({driver.email})
                            <p>Veículo: {driver.veiculo} - Placa: {driver.placa}</p>
                            <button 
                                onClick={() => alert(`Ação de Edição para o motorista ${driver.id}`)}
                                style={{ marginRight: '10px' }}
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(driver.id)} 
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

export default MotoristaPage;