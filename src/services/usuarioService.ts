import { Usuario } from '../types';

// Obtém a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USUARIO_URL = `${API_BASE_URL}/usuarios`;

// --- Funções CRUD ---

/**
 * [GET] Busca todos os usuários.
 */
export async function getUsuarios(): Promise<Usuario[]> {
    const response = await fetch(USUARIO_URL);
    if (!response.ok) {
        throw new Error('Falha ao buscar usuários.');
    }
    return response.json();
}

/**
 * [POST] Cria um novo usuário.
 */
export async function createUsuario(data: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await fetch(USUARIO_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao criar usuário.');
    }
    return response.json();
}

/**
 * [PUT] Atualiza um usuário existente.
 */
export async function updateUsuario(id: number, data: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await fetch(`${USUARIO_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao atualizar usuário.');
    }
    return response.json();
}

/**
 * [DELETE] Remove um usuário.
 */
export async function deleteUsuario(id: number): Promise<void> {
    const response = await fetch(`${USUARIO_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.status === 204) {
        return; // Sucesso, 204 No Content
    }

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Falha ao remover usuário.');
    }
}