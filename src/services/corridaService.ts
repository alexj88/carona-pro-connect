// src/services/corridaService.ts

import { Corrida } from '../types';

// Obtém a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const CORRIDA_URL = `${API_BASE_URL}/corridas`;

// --- Funções CRUD e Gerenciamento ---

/**
 * [GET] Busca corridas pelo ID do passageiro.
 */
export async function getCorridasPorPassageiro(passageiroId: number): Promise<Corrida[]> {
    const response = await fetch(`${CORRIDA_URL}/passageiro/${passageiroId}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar corridas do passageiro.');
    }
    return response.json();
}

/**
 * [POST] Solicita uma nova corrida.
 * Data deve conter: passageiro_id, origem, destino
 */
export async function solicitarCorrida(data: Omit<Corrida, 'id' | 'motorista_id' | 'status' | 'data_solicitacao' | 'data_conclusao'>): Promise<Corrida> {
    const response = await fetch(CORRIDA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao solicitar corrida.');
    }
    return response.json();
}

/**
 * [PUT] Motorista aceita a corrida (atualiza motorista_id e status para 'aceita').
 */
export async function aceitarCorrida(corridaId: number, motoristaId: number): Promise<Corrida> {
    const response = await fetch(`${CORRIDA_URL}/${corridaId}/aceitar`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motorista_id: motoristaId }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao aceitar corrida.');
    }
    return response.json();
}

/**
 * [PUT] Atualiza o status da corrida (em_andamento, concluida, cancelada).
 */
export async function atualizarStatusCorrida(corridaId: number, status: string): Promise<Corrida> {
    const response = await fetch(`${CORRIDA_URL}/${corridaId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao atualizar status da corrida.');
    }
    return response.json();
}

/**
 * [DELETE] Remove uma corrida.
 */
export async function deleteCorrida(id: number): Promise<void> {
    const response = await fetch(`${CORRIDA_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        return; // Sucesso, 204 No Content
    }

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao remover corrida.');
    }
}