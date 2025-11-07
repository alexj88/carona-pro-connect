export interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone?: string | null; // O telefone é opcional na interface
}

export interface Motorista {
    id: number;
    nome: string;
    email: string;
    veiculo: string;
    placa: string;
    // Adicione outros campos, se existirem (ex: status_disponibilidade)
}

export interface Corrida {
    id: number;
    passageiro_id: number;
    motorista_id: number | null;
    origem: string;
    destino: string;
    status: 'solicitada' | 'aceita' | 'em_andamento' | 'concluida' | 'cancelada';
    data_solicitacao: string; // string que representa o timestamp do banco
    data_conclusao?: string | null;
}