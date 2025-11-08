import React, { useState, useEffect } from 'react';
import { getCorridasPorPassageiro, aceitarCorrida, atualizarStatusCorrida, deleteCorrida } from '../services/corridaService';
import { Corrida } from '../types';

// ID do passageiro para buscar as corridas (MUDE PARA TESTAR OUTROS PASSAGEIROS)
const PASSAGEIRO_ID_TESTE = 1; 
// ID do motorista que ACEITA a corrida (MUDE PARA TESTAR OUTROS MOTORISTAS)
const MOTORISTA_ID_TESTE = 2; 

const CorridaPage: React.FC = () => {
    const [corridas, setCorridas] = useState<Corrida[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para carregar os dados
    const loadCorridas = async () => {
        setLoading(true);
        try {
            const data = await getCorridasPorPassageiro(PASSAGEIRO_ID_TESTE);
            setCorridas(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar corridas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCorridas();
    }, []);

    // Ações de gerenciamento
    const handleAction = async (corridaId: number, action: 'aceitar' | 'iniciar' | 'concluir' | 'cancelar' | 'deletar') => {
        try {
            switch (action) {
                case 'aceitar':
                    await aceitarCorrida(corridaId, MOTORISTA_ID_TESTE);
                    alert(`Corrida ${corridaId} aceita pelo Motorista ${MOTORISTA_ID_TESTE}!`);
                    break;
                case 'iniciar':
                    await atualizarStatusCorrida(corridaId, 'em_andamento');
                    alert(`Corrida ${corridaId} iniciada!`);
                    break;
                case 'concluir':
                    await atualizarStatusCorrida(corridaId, 'concluida');
                    alert(`Corrida ${corridaId} concluída!`);
                    break;
                case 'cancelar':
                    await atualizarStatusCorrida(corridaId, 'cancelada');
                    alert(`Corrida ${corridaId} cancelada.`);
                    break;
                case 'deletar':
                    if (!window.confirm("Confirmar exclusão?")) return;
                    await deleteCorrida(corridaId);
                    alert(`Corrida ${corridaId} deletada.`);
                    break;
            }
            // Recarrega a lista para mostrar a atualização
            loadCorridas(); 
        } catch (err) {
            setError(err instanceof Error ? err.message : `Erro ao executar a ação: ${action}.`);
        }
    };


    if (loading) return <div>Carregando painel de corridas...</div>;
    if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Painel de Corridas (Passageiro ID: {PASSAGEIRO_ID_TESTE})</h1>
            
            <h2>Status das Corridas</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {corridas.length === 0 ? (
                    <li>Nenhuma corrida encontrada para este passageiro.</li>
                ) : (
                    corridas.map((corrida) => (
                        <li key={corrida.id} style={{ border: '1px solid #0056b3', margin: '15px 0', padding: '15px', borderRadius: '5px' }}>
                            <p><strong>Corrida ID: {corrida.id}</strong> - Status: <span style={{ color: 'blue', fontWeight: 'bold' }}>{corrida.status.toUpperCase()}</span></p>
                            <p>De: {corrida.origem} | Para: {corrida.destino}</p>
                            <p>Motorista ID: {corrida.motorista_id || 'Aguardando'}</p>
                            
                            <div style={{ marginTop: '10px' }}>
                                {/* Botões de Ação Dinâmicos */}
                                {corrida.status === 'solicitada' && (
                                    <button onClick={() => handleAction(corrida.id, 'aceitar')} style={{ backgroundColor: 'green', color: 'white', marginRight: '5px' }}>
                                        ACEITAR (Mtr {MOTORISTA_ID_TESTE})
                                    </button>
                                )}
                                {corrida.status === 'aceita' && (
                                    <button onClick={() => handleAction(corrida.id, 'iniciar')} style={{ backgroundColor: 'orange', color: 'white', marginRight: '5px' }}>
                                        INICIAR
                                    </button>
                                )}
                                {corrida.status === 'em_andamento' && (
                                    <button onClick={() => handleAction(corrida.id, 'concluir')} style={{ backgroundColor: 'darkblue', color: 'white', marginRight: '5px' }}>
                                        CONCLUIR
                                    </button>
                                )}
                                
                                {corrida.status !== 'concluida' && corrida.status !== 'cancelada' && corrida.status !== 'em_andamento' && (
                                     <button onClick={() => handleAction(corrida.id, 'cancelar')} style={{ backgroundColor: 'gray', color: 'white', marginRight: '5px' }}>
                                        CANCELAR
                                    </button>
                                )}
                                <button onClick={() => handleAction(corrida.id, 'deletar')} style={{ backgroundColor: 'red', color: 'white' }}>
                                    DELETAR
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default CorridaPage;