// componentes/reports/FineReportList.tsx

import React, { useState } from 'react';
import { type FineReportFilters, type FineReportItem } from '../../types/Report';
import { getFineReport } from '../../services/fineReportService'; 

interface Props {
    onBack: () => void;
}

const FineReportList: React.FC<Props> = ({ onBack }) => {
    const [reportData, setReportData] = useState<FineReportItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false); // NOVO ESTADO
    
    // Filtros do RF22 (Tabela 12)
    const [filters, setFilters] = useState<FineReportFilters>({
        dataInicial: '', 
        dataFinal: '',
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
            const data = await getFineReport(filters);
            setReportData(data);
            setReportGenerated(true); // Sucesso na geração
        } catch (error) {
            alert("Erro ao gerar relatório de multas.");
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
        <div className="fine-report-list">
            <h3 style={{ marginTop: 0 }}>Relatório de Multas a Receber</h3>
            
            {/* --- FILTROS (Tabela 12) - CONTÊINER ESTILIZADO --- */}
            <div style={containerStyle}>
                
                {/* Linha 1: Data Inicial, Data Final, Nickname (Grid 3 colunas) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
                    
                    <div>
                        <label style={labelStyle}>* Data Inicial:</label>
                        <input type="date" name="dataInicial" value={filters.dataInicial} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div>
                        <label style={labelStyle}>* Data Final:</label>
                        <input type="date" name="dataFinal" value={filters.dataFinal} onChange={handleChange} style={inputStyle} required />
                    </div>
                    
                    <div>
                        <label style={labelStyle}># Nickname:</label>
                        <input type="text" name="nicknameUsuario" placeholder="Buscar por nickname" value={filters.nicknameUsuario} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
                
                {/* Linha 2: Botões */}
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

            {/* --- TABELA DE RESULTADOS (Atributos do relatório) --- */}
            {reportGenerated && reportData.length > 0 && (
                <>
                    <h4 style={{ marginTop: '30px' }}>Total de Multas Pendentes: {reportData.length} (Ordenado por Data de Início Crescente)</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Cód. Multa</th>
                                    <th style={{ padding: '10px' }}>Nickname</th>
                                    <th style={{ padding: '10px' }}>Cód. Emp.</th>
                                    <th style={{ padding: '10px' }}>Data Início</th>
                                    <th style={{ padding: '10px' }}>Valor (R$)</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>{item.codigoMulta}</td>
                                        <td style={{ padding: '10px' }}>{item.nicknameUsuario}</td>
                                        <td style={{ padding: '10px' }}>{item.codigoEmprestimo}</td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.dataInicioVigencia}</td>
                                        <td style={{ padding: '10px' }}>{item.valorMulta.toFixed(2)}</td>
                                        <td style={{ padding: '10px' }}>{item.statusMulta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            
            {/* RENDERIZA SÓ APÓS A PRIMEIRA TENTATIVA E SE O RESULTADO FOR VAZIO */}
            {reportGenerated && !loading && reportData.length === 0 && (
                <p>Nenhuma multa pendente encontrada para os filtros selecionados.</p>
            )}
        </div>
    );
};

export default FineReportList;