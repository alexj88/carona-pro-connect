import React, { useState, useEffect } from 'react';
import { getMotoristas, deleteMotorista, createMotorista, updateMotorista } from '../services/motoristaService';
import { Motorista } from '../types';
import DriverForm from '../components/DriverForm'; // Importa o formulário

const MotoristaPage: React.FC = () => {
    const [motoristas, setMotoristas] = useState<Motorista[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estado para controlar a edição (se null, está no modo criação ou lista)
    const [editingDriver, setEditingDriver] = useState<Motorista | null>(null); 
    
    // Estado para mostrar o formulário de criação
    const [showCreateForm, setShowCreateForm] = useState(false);

    // --- Lógica de Carregamento e Deleção (Existente) ---
    
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

    useEffect(() => {
        loadMotoristas();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este motorista?")) return;
        
        try {
            await deleteMotorista(id);
            loadMotoristas(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao deletar motorista.");
        }
    };

    // --- Lógica de Criação e Edição (NOVO) ---
    
    // Função acionada pelo DriverForm (para CREATE ou UPDATE)
    const handleFormSubmit = async (formData: Omit<Motorista, 'id'> & { id?: number }) => {
        setError(null); // Limpa erros anteriores
        
        try {
            if (formData.id) {
                // Modo Edição (PUT)
                // A função updateMotorista espera o ID e os dados, mas sem o ID no objeto de dados
                const { id, ...dataToUpdate } = formData;
                await updateMotorista(id, dataToUpdate as Omit<Motorista, 'id'>);
                alert('Motorista atualizado com sucesso!');
                setEditingDriver(null); // Sai do modo edição
            } else {
                // Modo Criação (POST)
                await createMotorista(formData);
                alert('Motorista criado com sucesso!');
                setShowCreateForm(false); // Esconde o formulário de criação
            }
            loadMotoristas(); // Recarrega a lista
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro ao salvar motorista.";
            setError(errorMessage);
        }
    };
    
    const handleCancelForm = () => {
        setEditingDriver(null);
        setShowCreateForm(false);
    };

    // --- Renderização ---
    
    if (loading) return <div>Carregando lista de motoristas...</div>;
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Gerenciamento de Motoristas</h1>

            {error && <div style={{ color: 'white', backgroundColor: 'red', padding: '10px', marginBottom: '15px' }}>{error}</div>}

            {/* Renderiza o formulário se estiver em modo criação OU edição */}
            {(showCreateForm || editingDriver) ? (
                <DriverForm 
                    initialData={editingDriver} 
                    onSubmit={handleFormSubmit} 
                    onCancel={handleCancelForm}
                />
            ) : (
                <button onClick={() => setShowCreateForm(true)} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ff9900', color: 'white', border: 'none', cursor: 'pointer' }}>
                    + Adicionar Novo Motorista
                </button>
            )}
            
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
                                onClick={() => setEditingDriver(driver)} // Entra no modo edição
                                disabled={!!editingDriver}
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