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
    genero: '',
    anoPublicacao: new Date().getFullYear(),
    status: 'Disponível', // Padrão [RF5]
};

const BookForm: React.FC<BookFormProps> = ({ bookToEdit, onBookSaved, onCancel }) => {
    
    const [bookData, setBookData] = useState<Omit<Book, 'id' | 'dataCadastro'>>(
        bookToEdit ? {
            codigoIdentificador: bookToEdit.codigoIdentificador,
            titulo: bookToEdit.titulo,
            autor: bookToEdit.autor,
            genero: bookToEdit.genero,
            anoPublicacao: bookToEdit.anoPublicacao,
            status: bookToEdit.status,
        } : initialBookState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!bookToEdit;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        
        const finalValue = (type === 'number' || name === 'anoPublicacao') ? parseInt(value) || 0 : value;

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

    return (
        <div style={{ padding: '20px', border: '1px solid #007bff', marginBottom: '20px' }}>
            <h4>{isEditing ? `Editar Livro: ${bookToEdit?.titulo} (RF7)` : 'Cadastro de Novo Livro '}</h4>
            <form onSubmit={handleSubmit}>
                
                { }
                <input 
                    name="codigoIdentificador" 
                    value={bookData.codigoIdentificador} 
                    onChange={handleChange} 
                    placeholder="Código Identificador" 
                    required 
                /><br/>
                <input name="titulo" value={bookData.titulo} onChange={handleChange} placeholder="Título" required /><br/>
                <input name="autor" value={bookData.autor} onChange={handleChange} placeholder="Autor" required /><br/>
                <input name="genero" value={bookData.genero} onChange={handleChange} placeholder="Gênero" required /><br/>
                <input 
                    name="anoPublicacao" 
                    value={bookData.anoPublicacao} 
                    onChange={handleChange} 
                    type="number" 
                    placeholder="Ano de Publicação" 
                    required 
                /><br/>
                
                {}
                <select name="status" value={bookData.status} onChange={handleChange} required>
                    <option value="Disponível">Disponível</option>
                    <option value="Emprestado">Emprestado</option>
                    <option value="Reservado">Reservado</option>
                </select><br/>
                
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
                
                <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                    {loading ? 'Salvando...' : (isEditing ? 'Salvar Edição (RF7)' : 'Cadastrar (RF5)')}
                </button>
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default BookForm;