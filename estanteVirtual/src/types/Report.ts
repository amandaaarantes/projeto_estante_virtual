// types/Report.ts (Arquivo estendido)

// Tipos para Filtros de Empréstimos (RF21)
export type LoanStatus = 'Todos' | 'Em dia' | 'Atrasado';

export interface ReportFilters {
    dataInicial: string; 
    dataFinal: string;   
    statusEmprestimo?: LoanStatus; 
    codigoLivro?: string;
    nicknameUsuario?: string;
}

// Atributos do relatório de Empréstimos (RF21)
export interface LoanReportItem {
    codigoEmprestimo: string;
    nicknameUsuario: string;
    tituloLivro: string;
    dataEmprestimo: string;
    dataPrazoDevolucao: string;
    dataRealDevolucao: string;
    statusEmprestimo: 'Em dia' | 'Atrasado';
}

// Tipos para Filtros de Multas (RF22)
export interface FineReportFilters {
    dataInicial: string; // XX/XX/XXXX
    dataFinal: string;   // XX/XX/XXXX
    nicknameUsuario?: string;
}

// Atributos do relatório de Multas (RF22)
export interface FineReportItem {
    codigoMulta: string;
    nicknameUsuario: string;
    codigoEmprestimo: string;
    dataInicioVigencia: string;
    valorMulta: number;
    statusMulta: string;
}

// Tipos para Filtros de Avaliações (RF23)
export interface ReviewReportFilters {
    dataInicial: string; // XX/XX/XXXX
    dataFinal: string;   // XX/XX/XXXX
    codigoLivro?: string;
    nicknameUsuario?: string;
}

// Atributos do relatório de Avaliações (RF23)
export interface ReviewReportItem {
    dataAvaliacao: string;
    tituloLivro: string; 
    nicknameUsuario: string;
    avaliacaoEstrelas: number;
    avaliacaoComentario: string;
}