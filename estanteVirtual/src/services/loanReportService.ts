// services/loanReportService.ts

import { type ReportFilters, type LoanReportItem } from '../types/Report';

// MOCK: Simulação de dados brutos de empréstimo (deve ser integrado com sua lógica real)
const mockLoansData: LoanReportItem[] = [
    {
        codigoEmprestimo: '101', nicknameUsuario: 'userA', tituloLivro: 'A Origem', 
        dataEmprestimo: '2025-10-01', dataPrazoDevolucao: '2025-10-10', dataRealDevolucao: '2025-10-10', 
        statusEmprestimo: 'Em dia'
    },
    {
        codigoEmprestimo: '102', nicknameUsuario: 'admin', tituloLivro: 'O Capital', 
        dataEmprestimo: '2025-10-15', dataPrazoDevolucao: '2025-10-25', dataRealDevolucao: '-', 
        statusEmprestimo: 'Atrasado'
    },
    {
        codigoEmprestimo: '103', nicknameUsuario: 'userA', tituloLivro: 'Código Limpo', 
        dataEmprestimo: '2025-11-01', dataPrazoDevolucao: '2025-11-15', dataRealDevolucao: '-', 
        statusEmprestimo: 'Em dia'
    },
];


// [RF21] Emitir relatório de empréstimos por período
export const getLoanReport = async (filters: ReportFilters): Promise<LoanReportItem[]> => {
    // Para fins de demonstração, o filtro de data está usando YYYY-MM-DD
    const { dataInicial, dataFinal, statusEmprestimo, codigoLivro, nicknameUsuario } = filters;

    // 1. FILTRAGEM
    let filteredData = mockLoansData.filter(item => {
        const itemDate = item.dataEmprestimo;
        
        // Verifica data (Obrigatório)
        const matchDate = (itemDate >= dataInicial && itemDate <= dataFinal);
        
        // Verifica Status
        const matchStatus = statusEmprestimo === 'Todos' || !statusEmprestimo
            ? true
            : item.statusEmprestimo === statusEmprestimo;

        // Verifica Código do Livro
        const matchBook = !codigoLivro || codigoLivro === 'Nenhum'
            ? true
            : item.tituloLivro.includes(codigoLivro); 

        // Verifica Nickname do Usuário
        const matchNickname = !nicknameUsuario || nicknameUsuario === 'Nenhum'
            ? true
            : item.nicknameUsuario.includes(nicknameUsuario);
            
        return matchDate && matchStatus && matchBook && matchNickname;
    });

    // 2. ORDENAÇÃO: pela data prazo para devolução (decrescente)
    filteredData.sort((a, b) => {
        if (a.dataPrazoDevolucao > b.dataPrazoDevolucao) return -1;
        if (a.dataPrazoDevolucao < b.dataPrazoDevolucao) return 1;
        return 0;
    });

    return filteredData;
};