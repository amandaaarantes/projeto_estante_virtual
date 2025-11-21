// componentes/reports/ReviewReportList.tsx

import React, { useState } from 'react';
import { type ReviewReportFilters, type ReviewReportItem } from '../../types/Report';
import { getReviewReport } from '../../services/reviewReportService';

interface Props {
    onBack: () => void;
}

const ReviewReportList: React.FC<Props> = ({ onBack }) => {
    const [reportData, setReportData] = useState<ReviewReportItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false); // NOVO ESTADO
    
    // Filtros do RF23 (Tabela 13)
    const [filters, setFilters] = useState<ReviewReportFilters>({
        dataInicial: '', 
        dataFinal: '',
        codigoLivro: '',
        nicknameUsuario: '',       
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateReport = async () => {
        if (!filters.dataInicial || !filters.dataFinal) {
            alert("As datas inicial e final são obrigatórias.");
            return;
        }

        setLoading(true);
        setReportGenerated(false); // Resetar antes de buscar
        try {
            const data = await getReviewReport(filters);
            setReportData(data);
            setReportGenerated(true); // Sucesso na geração
        } catch (error) {
            alert("Erro ao gerar relatório de avaliações.");
            setReportData([]);
            setReportGenerated(true); // Ocorreu um erro, mas a tentativa foi feita
        } finally {
            setLoading(false);
        }
    };

    // ESTILOS PADRÃO DO FORMULÁRIO (Baseado no ReviewForm.tsx)
    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc', 
        borderRadius: '8px',      
        padding: '20px',          
        marginBottom: '20px',     
        backgroundColor: '#f9f9f9', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px', 
        height: '41px', 
        boxSizing: 'border-box',
        border: '1px solid #ddd', 
        borderRadius: '4px'
    };
    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '5px', 
        fontWeight: 'bold', 
        fontSize: '0.9em', 
        color: '#555'
    };
    const buttonStyle: React.CSSProperties = {
        padding: '10px 20px', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    return (
        <div className="review-report-list">
            <h3 style={{ marginTop: 0 }}>Relatório de Avaliações por Período</h3>
            
            {/* --- FILTROS (Tabela 13) - CONTÊINER ESTILIZADO --- */}
            <div style={containerStyle}>
                
                {/* Linha 1: Data Inicial, Data Final (Grid 2 colunas) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    
                    <div>
                        <label style={labelStyle}>*Data Inicial:</label>
                        <input type="date" name="dataInicial" value={filters.dataInicial} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div>
                        <label style={labelStyle}>*Data Final:</label>
                        <input type="date" name="dataFinal" value={filters.dataFinal} onChange={handleChange} style={inputStyle} required />
                    </div>
                </div>

                {/* Linha 2: Cód. Livro, Nickname, Botões (Grid 1fr 1fr 1fr) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
                    
                    <div>
                        <label style={labelStyle}># Cód. Livro:</label>
                        <input type="text" name="codigoLivro" placeholder="Buscar por código" value={filters.codigoLivro} onChange={handleChange} style={inputStyle} />
                    </div>
                    
                    <div>
                        <label style={labelStyle}># Nickname:</label>
                        <input type="text" name="nicknameUsuario" placeholder="Buscar por nickname" value={filters.nicknameUsuario} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleGenerateReport} disabled={loading}
                            style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
                        >
                            {loading ? 'Gerando...' : 'Gerar Relatório'}
                        </button>
                        <button onClick={onBack}
                            style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white', fontWeight: 'normal' }}
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>

            {/* --- TABELA DE RESULTADOS (Atributos do relatório) --- */}
            {reportGenerated && reportData.length > 0 && (
                <>
                    <h4 style={{ marginTop: '30px' }}>Total de Avaliações: {reportData.length} (Ordenado por Data Decrescente)</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Data</th>
                                    <th style={{ padding: '10px' }}>Título do Livro</th>
                                    <th style={{ padding: '10px' }}>Nickname</th>
                                    <th style={{ padding: '10px' }}>Estrelas</th>
                                    <th style={{ padding: '10px' }}>Comentário</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.dataAvaliacao}</td>
                                        <td style={{ padding: '10px' }}>{item.tituloLivro}</td>
                                        <td style={{ padding: '10px' }}>{item.nicknameUsuario}</td>
                                        <td style={{ padding: '10px' }}>{'⭐'.repeat(item.avaliacaoEstrelas)} ({item.avaliacaoEstrelas}/5)</td>
                                        <td style={{ padding: '10px', maxWidth: '300px' }}>{item.avaliacaoComentario}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            
            {/* RENDERIZA SÓ APÓS A PRIMEIRA TENTATIVA E SE O RESULTADO FOR VAZIO */}
            {reportGenerated && !loading && reportData.length === 0 && (
                <p>Nenhuma avaliação encontrada para os filtros selecionados.</p>
            )}
        </div>
    );
};

export default ReviewReportList;