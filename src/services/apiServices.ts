// Acessa a URL: o Vite a injeta no objeto import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Busca a lista de motoristas no backend
 */
export async function getMotoristas() {
  try {
    const response = await fetch(`${API_BASE_URL}/motoristas`);

    if (!response.ok) {
      // Lança um erro se o status HTTP não for 2xx
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar motoristas:", error);
    throw error; // Propaga o erro para o componente React tratar
  }
}

/**
 * Cria um novo motorista (Exemplo de POST)
 */
export async function createMotorista(motoristaData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/motoristas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(motoristaData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar motorista:", error);
    throw error;
  }
}

