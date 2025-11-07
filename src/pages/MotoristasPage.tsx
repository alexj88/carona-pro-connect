// src/pages/MotoristasPage.tsx (Exemplo)

import React, { useState, useEffect } from 'react';
import { getMotoristas } from '../services/apiServices.ts'; // Importe o serviço

// Defina a interface do motorista para tipagem
interface Motorista {
  id: number;
  nome: string;
  veiculo: string;
}

const MotoristasPage: React.FC = () => {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMotoristas() {
      try {
        const data = await getMotoristas();
        setMotoristas(data);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os motoristas. Verifique o backend.");
      } finally {
        setLoading(false);
      }
    }
    loadMotoristas();
  }, []);

  if (loading) return <div>Carregando motoristas...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div>
      <h2>Lista de Motoristas</h2>
      <ul>
        {motoristas.map((motorista) => (
          <li key={motorista.id}>
            {motorista.nome} - {motorista.veiculo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MotoristasPage;