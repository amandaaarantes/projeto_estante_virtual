// services/fineReportService.ts

import { type FineReportFilters, type FineReportItem } from '../types/Report';

// MOCK: Dados brutos de Multas
const mockFinesData: FineReportItem[] = [
    { codigoMulta: 'M001', nicknameUsuario: 'userA', codigoEmprestimo: 'E100', 
      dataInicioVigencia: '2025-10-05', valorMulta: 15.00, statusMulta: 'Aguardando pagamento' },
    { codigoMulta: 'M002', nicknameUsuario: 'userB', codigoEmprestimo: 'E101', 
      dataInicioVigencia: '2025-11-01', valorMulta: 10.00, statusMulta: 'Aguardando pagamento' },
    { codigoMulta: 'M003', nicknameUsuario: 'userA', codigoEmprestimo: 'E102', 
      dataInicioVigencia: '2025-11-10', valorMulta: 5.00, statusMulta: 'Multa paga' },
];

// [RF22] Emitir relatório de multas a receber
export const getFineReport = async (filters: FineReportFilters): Promise<FineReportItem[]> => {
    
    // 1. FILTRAGEM (Multas pendentes - statusMulta !== 'Multa paga')
    let filteredData = mockFinesData.filter(item => {
        if (item.statusMulta === 'Multa paga') return false; // Apenas multas pendentes

        // Filtros de Data (assumindo YYYY-MM-DD para o mock)
        const filterStartDate = filters.dataInicial; 
        const filterEndDate = filters.dataFinal;
        const itemDate = item.dataInicioVigencia; 
        
        const matchDate = (itemDate >= filterStartDate && itemDate <= filterEndDate);
        
        // Filtro Nickname
        const matchNickname = !filters.nicknameUsuario
            ? true
            : item.nicknameUsuario.includes(filters.nicknameUsuario);
            
        return matchDate && matchNickname;
    });

    // 2. ORDENAÇÃO: pela data do início da vigência da multa (crescente)
    filteredData.sort((a, b) => {
        if (a.dataInicioVigencia < b.dataInicioVigencia) return -1;
        if (a.dataInicioVigencia > b.dataInicioVigencia) return 1;
        return 0;
    });

    return filteredData;
};