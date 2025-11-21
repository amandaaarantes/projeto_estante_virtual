// componentes/reports/LoanReportList.tsx

import React, { useState } from 'react';
import { type ReportFilters, type LoanReportItem } from '../../types/Report';
import { getLoanReport } from '../../services/loanReportService'; 

interface Props {
    onBack: () => void;
}

const LoanReportList: React.FC<Props> = ({ onBack }) => {
    const [reportData, setReportData] = useState<LoanReportItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false); // NOVO ESTADO
    
    // Inicialização dos filtros (Data Inicial e Final são obrigatórios)
    const [filters, setFilters] = useState<ReportFilters>({
        dataInicial: '', 
        dataFinal: '',
        statusEmprestimo: 'Todos', 
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
            const data = await getLoanReport(filters);
            setReportData(data);
            setReportGenerated(true); // Sucesso na geração
        } catch (error) {
            alert("Erro ao gerar relatório de empréstimos.");
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
        <div className="loan-report-list">
            <h3 style={{ marginTop: 0 }}>Relatório de Empréstimos por Período</h3>
            
            {/* --- FILTROS (Tabela 11) - CONTÊINER ESTILIZADO --- */}
            <div style={containerStyle}>
                
                {/* Linha 1: Data Inicial, Data Final, Status, Cód. Livro (Grid 4 colunas) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
                    
                    <div>
                        <label style={labelStyle}>*Data Inicial:</label>
                        <input type="date" name="dataInicial" value={filters.dataInicial} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div>
                        <label style={labelStyle}>*Data Final:</label>
                        <input type="date" name="dataFinal" value={filters.dataFinal} onChange={handleChange} style={inputStyle} required />
                    </div>

                    <div>
                        <label style={labelStyle}># Status:</label>
                        <select name="statusEmprestimo" value={filters.statusEmprestimo} onChange={handleChange} style={inputStyle}>
                            <option value="Todos">Todos</option>
                            <option value="Em dia">Em dia</option>
                            <option value="Atrasado">Atrasado</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}># Cód. Livro:</label>
                        <input type="text" name="codigoLivro" placeholder="Buscar por código" value={filters.codigoLivro} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>
                
                {/* Linha 2: Nickname e Botões (Grid 1fr 3fr) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '15px', alignItems: 'end' }}>
                    
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
                    <h4 style={{ marginTop: '30px' }}>Total de Empréstimos: {reportData.length}</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Cód. Emp.</th>
                                    <th style={{ padding: '10px' }}>Nickname</th>
                                    <th style={{ padding: '10px' }}>Título do Livro</th>
                                    <th style={{ padding: '10px' }}>Data Emp.</th>
                                    <th style={{ padding: '10px' }}>Data Prazo</th>
                                    <th style={{ padding: '10px' }}>Dev. Real</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>{item.codigoEmprestimo}</td>
                                        <td style={{ padding: '10px' }}>{item.nicknameUsuario}</td>
                                        <td style={{ padding: '10px' }}>{item.tituloLivro}</td>
                                        <td style={{ padding: '10px' }}>{item.dataEmprestimo}</td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.dataPrazoDevolucao}</td>
                                        <td style={{ padding: '10px' }}>{item.dataRealDevolucao}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em',
                                                backgroundColor: item.statusEmprestimo === 'Em dia' ? '#d4edda' : '#f8d7da',
                                                color: item.statusEmprestimo === 'Em dia' ? '#155724' : '#721c24'
                                            }}>
                                                {item.statusEmprestimo}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            
            {/* RENDERIZA SÓ APÓS A PRIMEIRA TENTATIVA E SE O RESULTADO FOR VAZIO */}
            {reportGenerated && !loading && reportData.length === 0 && (
                <p>Nenhum empréstimo encontrado para os filtros selecionados.</p>
            )}
        </div>
    );
};

export default LoanReportList;