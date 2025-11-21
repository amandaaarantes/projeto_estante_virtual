// services/reviewReportService.ts

import { type ReviewReportFilters, type ReviewReportItem } from '../types/Report';

// MOCK: Dados brutos de Avaliações
const mockReviewsData: ReviewReportItem[] = [
    {
        dataAvaliacao: '2025-10-20', tituloLivro: 'A Origem', nicknameUsuario: 'userA',
        avaliacaoEstrelas: 5, avaliacaoComentario: 'Excelente livro!'
    },
    {
        dataAvaliacao: '2025-11-01', tituloLivro: 'O Capital', nicknameUsuario: 'admin',
        avaliacaoEstrelas: 3, avaliacaoComentario: 'Bom, mas demorado.'
    },
    {
        dataAvaliacao: '2025-11-15', tituloLivro: 'A Origem', nicknameUsuario: 'userB',
        avaliacaoEstrelas: 4, avaliacaoComentario: 'Muito bom.'
    },
];

// [RF23] Emitir relatório de avaliações por período
export const getReviewReport = async (filters: ReviewReportFilters): Promise<ReviewReportItem[]> => {
    
    // 1. FILTRAGEM
    let filteredData = mockReviewsData.filter(item => {
        
        // Filtros de Data (assumindo YYYY-MM-DD para o mock)
        const filterStartDate = filters.dataInicial; 
        const filterEndDate = filters.dataFinal;
        const itemDate = item.dataAvaliacao; 
        
        const matchDate = (itemDate >= filterStartDate && itemDate <= filterEndDate);
        
        // Filtro Código Livro
        const matchBook = !filters.codigoLivro
            ? true
            : item.tituloLivro.includes(filters.codigoLivro); // Usando Título no mock
            
        // Filtro Nickname
        const matchNickname = !filters.nicknameUsuario
            ? true
            : item.nicknameUsuario.includes(filters.nicknameUsuario);
            
        return matchDate && matchBook && matchNickname;
    });

    // 2. ORDENAÇÃO: pela data da avaliação (decrescente)
    filteredData.sort((a, b) => {
        if (a.dataAvaliacao > b.dataAvaliacao) return -1;
        if (a.dataAvaliacao < b.dataAvaliacao) return 1;
        return 0;
    });

    return filteredData;
};