// componentes/reports/ReportSelector.tsx

import React, { useState } from 'react';
import LoanReportList from './LoanReportList';
import FineReportList from './FineReportList';
import ReviewReportList from './ReviewReportList';

type ReportType = 'none' | 'loans' | 'fines' | 'reviews';

const ReportSelector: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<ReportType>('none');
    
    const reportOptions = [
        { type: 'loans' as ReportType, name: 'Empréstimos por Período' },
        { type: 'fines' as ReportType, name: 'Multas a Receber' },
        { type: 'reviews' as ReportType, name: 'Avaliações por Período' },
    ];

    const renderReportComponent = () => {
        switch (selectedReport) {
            case 'loans':
                return <LoanReportList onBack={() => setSelectedReport('none')} />;
            case 'fines':
                return <FineReportList onBack={() => setSelectedReport('none')} />;
            case 'reviews':
                return <ReviewReportList onBack={() => setSelectedReport('none')} />;
            default:
                return (
                    
                    <div style={{ padding: '0px 20px 20px 20px', borderRadius: '8px' }}> 
                
                        <h3>Selecione o Relatório a ser emitido:</h3>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {reportOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => setSelectedReport(option.type)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="report-selector">
            
            {renderReportComponent()}
        </div>
    );
};

export default ReportSelector;