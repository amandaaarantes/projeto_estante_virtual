import React, { useState, useEffect } from 'react';
import { type Book, type BookFilters } from '../../types/Book'; 
import { getBooks, deleteBook } from '../../services/bookService'; 
import BookForm from './BookForm'; 

const BookList: React.FC = () => {
    const [bookList, setBookList] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<BookFilters>({});
    const [error, setError] = useState<string | null>(null);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined); 

    const currentUserProfile = 'Bibliotecário' as const; 

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBooks(filters); 
            setBookList(data);
        } catch (err) {
            setError("Erro ao carregar livros.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setBookToEdit(undefined); 
        setIsFormOpen(true);
    }
    
    const handleEdit = (book: Book) => {
        if (currentUserProfile !== 'Bibliotecário' && currentUserProfile !== 'Administrador') {
            alert("Apenas Bibliotecários e Administradores podem editar livros.");
            return;
        }
        setBookToEdit(book);
        setIsFormOpen(true);
    }
    const handleDelete = async (id: string, titulo: string) => {
        // Atores: Administrador pode excluir [RF8]
        if (currentUserProfile !== 'Administrador') { 
            alert("Apenas Administradores podem excluir livros (RF8).");
            return;
        }
        if (window.confirm(`Confirma a exclusão do livro "${titulo}"?`)) { 
            try {
                await deleteBook(id);
                fetchBooks(); 
                alert("Livro excluído com sucesso.");
            } catch (err: any) {
                alert(`Erro ao excluir: ${err.message}`);
            }
        }
    };
    
    useEffect(() => {
        fetchBooks();
    }, [filters.titulo, filters.autor, filters.periodoInicial, filters.periodoFinal]); 

    return (
        <div className="book-list">
            <h3>Gerenciamento de Acervo (Livros)</h3>

            {isFormOpen && (
                <BookForm
                    bookToEdit={bookToEdit}
                    onCancel={() => setIsFormOpen(false)} 
                    onBookSaved={() => {
                        setIsFormOpen(false); 
                        fetchBooks(); 
                    }}
                />
            )}
            
            {}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    placeholder="Buscar por Título" 
                    onChange={(e) => setFilters({...filters, titulo: e.target.value})} 
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <input 
                    placeholder="Buscar por Autor" 
                    onChange={(e) => setFilters({...filters, autor: e.target.value})} 
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                {}
                <input 
                    type="date"
                    onChange={(e) => setFilters({...filters, periodoInicial: e.target.value})} 
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <input 
                    type="date"
                    onChange={(e) => setFilters({...filters, periodoFinal: e.target.value})} 
                    style={{ padding: '8px', marginRight: '10px' }}
                />

                <button 
                    onClick={handleAdd} 
                    style={{ padding: '8px 15px', cursor: 'pointer' }}
                >
                    + Novo Livro (Admin/Bibl)
                </button>
            </div>
            
            {loading && <p>Carregando dados...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Cód. Identificador</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Ano Pub.</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {bookList.map(book => (
                        <tr key={book.id}>
                            <td>{book.codigoIdentificador}</td>
                            <td>{book.titulo}</td>
                            <td>{book.autor}</td>
                            <td>{book.anoPublicacao}</td>
                            <td>{book.status}</td>
                            <td>
                                <button onClick={() => handleEdit(book)} style={{ marginRight: '5px' }}>
                                    Editar (Bibl)
                                </button>
                                <button onClick={() => handleDelete(book.id, book.titulo)} style={{ cursor: 'pointer' }}>
                                    Excluir (Admin)
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;