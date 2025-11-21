import React, { useState } from 'react';
import { type Loan, type LoanStatus } from '../../types/Loan';
import { createLoan, updateLoan } from '../../services/loanService';

interface Props {
    loanToEdit?: Loan;
    onSuccess: () => void;
    onCancel: () => void;
}

const LoanForm: React.FC<Props> = ({ loanToEdit, onSuccess, onCancel }) => {
    const isEditing = !!loanToEdit;
    
    const [formData, setFormData] = useState<Partial<Loan>>(
        loanToEdit || {
            codigoIdentificador: '',
            dataEmprestimo: '',
            dataPrazo: '',
            status: 'Em dia',
            nicknameUsuario: '',
            codigoLivro: ''
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && loanToEdit) {
                await updateLoan(loanToEdit.id, formData);
                alert("Empréstimo atualizado!");
            } else {
                await createLoan(formData as Loan);
                alert("Empréstimo registrado!");
            }
            onSuccess();
        } catch (err: any) {
            alert(err.message);
        }
    };
    
    // ESTILOS COPIADOS DO FineForm.tsx e UserForm.tsx
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
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '0.9em',
        color: '#555'
    };

    return (
        <div style={containerStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
                {isEditing ? 'Editar Empréstimo' : 'Novo Empréstimo'}
            </h3>
            <form onSubmit={handleSubmit}>
                
                {/* Linha 1: Cód. Empréstimo, Nickname */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Cód. Empréstimo</label>
                        <input 
                            name="codigoIdentificador" 
                            placeholder="Cód. Empréstimo" 
                            value={formData.codigoIdentificador} 
                            onChange={handleChange} 
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Nickname</label>
                        <input 
                            name="nicknameUsuario" 
                            placeholder="Nickname" 
                            value={formData.nicknameUsuario} 
                            onChange={handleChange} 
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Linha 2: Cód. Livro, Data Empréstimo, Prazo */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Cód. Livro</label>
                        <input 
                            name="codigoLivro" 
                            placeholder="Cód. Livro" 
                            value={formData.codigoLivro} 
                            onChange={handleChange} 
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Data Emp.:</label>
                        <input 
                            type="date" 
                            name="dataEmprestimo" 
                            value={formData.dataEmprestimo} 
                            onChange={handleChange} 
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Prazo:</label>
                        <input 
                            type="date" 
                            name="dataPrazo" 
                            value={formData.dataPrazo} 
                            onChange={handleChange} 
                            disabled={isEditing} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Linha 3: Devolução Real, Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={labelStyle}>Devolução Real:</label>
                        <input 
                            type="date" 
                            name="dataDevolucaoReal" 
                            value={formData.dataDevolucaoReal || ''} 
                            onChange={handleChange} 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Status:</label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange}
                            style={{...inputStyle, height: '41px'}} // Ajuste fino de altura
                        >
                            <option value="Em dia">Em dia</option>
                            <option value="Atrasado">Atrasado</option>
                            <option value="Devolvido">Devolvido</option>
                        </select>
                    </div>
                </div>
                
                {/* Botões - Estilos copiados do FineForm.tsx */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit" 
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
                        Salvar
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};
export default LoanForm;