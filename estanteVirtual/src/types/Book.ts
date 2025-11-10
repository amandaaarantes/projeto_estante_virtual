
export type BookStatus = 'Disponível' | 'Emprestado' | 'Reservado';

export interface Book {
    id: string; 
    codigoIdentificador: string; 
    titulo: string;
    autor: string;
    genero: string;
    anoPublicacao: number;
    status: BookStatus;
    dataCadastro: string; 
}

export interface BookFilters {
    titulo?: string;
    autor?: string;
    periodoInicial?: string; 
    periodoFinal?: string;   
}