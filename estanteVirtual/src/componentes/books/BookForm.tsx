import React, { useState } from 'react';
import { type Book, type BookStatus } from '../../types/Book';
import { createBook, updateBook } from '../../services/bookService';

interface BookFormProps {
    bookToEdit?: Book;
    onBookSaved: () => void;
    onCancel: () => void;
}

const initialBookState: Omit<Book, 'id' | 'dataCadastro' | 'status'> & { status: BookStatus } = {
    codigoIdentificador: '',
    titulo: '',
    autor: '',
    descricao: '',    
    localizacao: '',  
    dataPublicacao: new Date().getFullYear(),
    status: 'Disponível', 
};

const BookForm: React.FC<BookFormProps> = ({ bookToEdit, onBookSaved, onCancel }) => {
    
    const [bookData, setBookData] = useState(
        bookToEdit ? {
            codigoIdentificador: bookToEdit.codigoIdentificador,
            titulo: bookToEdit.titulo,
            autor: bookToEdit.autor,
            descricao: bookToEdit.descricao,
            localizacao: bookToEdit.localizacao,
            dataPublicacao: bookToEdit.dataPublicacao,
            status: bookToEdit.status,
        } : initialBookState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!bookToEdit;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Garante que dataPublicacao seja um número (ou 0 se vazio)
        const finalValue = (type === 'number' || name === 'dataPublicacao') ? parseInt(value) || 0 : value;

        if (name === 'status') {
            setBookData(prev => ({ ...prev, [name]: value as BookStatus }));
        } else {
            setBookData(prev => ({ ...prev, [name]: finalValue }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditing && bookToEdit) {
                await updateBook(bookToEdit.id, bookData); 
                alert(`Livro "${bookData.titulo}" editado com sucesso!`);
            } else {
                await createBook(bookData); 
                alert('Livro cadastrado com sucesso!');
            }
            onBookSaved(); 
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar o livro.');
        } finally {
            setLoading(false);
        }
    };

    // ESTILOS COPIADOS DO FineForm.tsx
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
                {isEditing ? `Editar Livro: ${bookToEdit?.titulo}` : 'Cadastro de Novo Livro'}
            </h3>
            <form onSubmit={handleSubmit}>
                
                {/* Linha 1: Cód. Identificador, Título, Autor */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Código Identificador</label>
                        <input 
                            name="codigoIdentificador" 
                            value={bookData.codigoIdentificador} 
                            onChange={handleChange} 
                            placeholder="Código Identificador" 
                            required 
                            disabled={isEditing} 
                            style={inputStyle}
                        />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Título</label>
                        <input 
                            name="titulo" 
                            value={bookData.titulo} 
                            onChange={handleChange} 
                            placeholder="Título" 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Autor</label>
                        <input 
                            name="autor" 
                            value={bookData.autor} 
                            onChange={handleChange} 
                            placeholder="Autor" 
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Linha 2: Descrição/Sinopse (Full Width) */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={labelStyle}>Descrição / Sinopse</label>
                    <textarea 
                        name="descricao" 
                        value={bookData.descricao} 
                        onChange={handleChange} 
                        placeholder="Descrição / Sinopse" 
                        rows={3}
                        required 
                        style={{ ...inputStyle, height: 'auto', resize: 'vertical' }} // Garantir o estilo do input
                    />
                </div>
                
                {/* Linha 3: Localização, Ano de Publicação, Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={labelStyle}>Localização Física</label>
                        <input 
                            name="localizacao" 
                            value={bookData.localizacao} 
                            onChange={handleChange} 
                            placeholder="Ex: A1-EST1" 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Ano de Publicação</label>
                        <input 
                            name="dataPublicacao" 
                            value={bookData.dataPublicacao} 
                            onChange={handleChange} 
                            type="number" 
                            placeholder="Ex: 2024" 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Status</label>
                        <select 
                            name="status" 
                            value={bookData.status} 
                            onChange={handleChange} 
                            required
                            style={{...inputStyle, height: '41px'}} // Ajuste fino de altura
                        >
                            <option value="Disponível">Disponível</option>
                            <option value="Emprestado">Emprestado</option>
                        </select>
                    </div>
                </div>
                
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
                
                {/* Botões - Estilos copiados do FineForm.tsx */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit" 
                        disabled={loading}
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
                        {loading ? 'Salvando...' : (isEditing ? 'Salvar Edição' : 'Cadastrar')}
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

export default BookForm;