import { Motorista } from '../types';

// Obtém a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const MOTORISTA_URL = `${API_BASE_URL}/motoristas`;

// --- Funções CRUD ---

/**
 * [GET] Busca todos os motoristas.
 */
export async function getMotoristas(): Promise<Motorista[]> {
    const response = await fetch(MOTORISTA_URL);
    if (!response.ok) {
        throw new Error('Falha ao buscar motoristas.');
    }
    return response.json();
}

/**
 * [POST] Cria um novo motorista.
 */
export async function createMotorista(data: Omit<Motorista, 'id'>): Promise<Motorista> {
    const response = await fetch(MOTORISTA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao criar motorista.');
    }
    return response.json();
}

/**
 * [PUT] Atualiza um motorista existente.
 */
export async function updateMotorista(id: number, data: Omit<Motorista, 'id'>): Promise<Motorista> {
    const response = await fetch(`${MOTORISTA_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao atualizar motorista.');
    }
    return response.json();
}

/**
 * [DELETE] Remove um motorista.
 */
export async function deleteMotorista(id: number): Promise<void> {
    const response = await fetch(`${MOTORISTA_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        return; // Sucesso, 204 No Content
    }

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao remover motorista.');
    }
}