import { type Book, type BookFilters, type BookStatus } from '../types/Book'; 
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos


let mockBooks: Book[] = [
    {
        id: 'b1', codigoIdentificador: '978-8571830605', titulo: 'Dom Casmurro', autor: 'Machado de Assis',
        genero: 'Romance', anoPublicacao: 1899, status: 'Disponível',
        dataCadastro: new Date().toISOString().split('T')[0]
    },
    {
        id: 'b2', codigoIdentificador: '978-8580572886', titulo: '1984', autor: 'George Orwell',
        genero: 'Ficção Científica', anoPublicacao: 1949, status: 'Emprestado',
        dataCadastro: new Date().toISOString().split('T')[0]
    },
    {
        id: 'b3', codigoIdentificador: '978-0743273565', titulo: 'O Grande Gatsby', autor: 'F. Scott Fitzgerald',
        genero: 'Romance', anoPublicacao: 1925, status: 'Reservado',
        dataCadastro: '2025-10-01'
    },
];
const validateUniqueCode = (codigo: string, currentId?: string) => {
    if (mockBooks.some(b => b.codigoIdentificador === codigo && b.id !== currentId)) {
        throw new Error(`RNF10: Código Identificador '${codigo}' já está em uso.`);
    }
};

export const createBook = async (newBookData: Omit<Book, 'id' | 'dataCadastro'>): Promise<Book> => {
    validateUniqueCode(newBookData.codigoIdentificador);

    const newBook: Book = {
        ...newBookData,
        id: uuidv4(),
        dataCadastro: new Date().toISOString().split('T')[0],
    };

    mockBooks.push(newBook);
    return newBook;
};

export const updateBook = async (id: string, updatedData: Omit<Book, 'id' | 'dataCadastro'>): Promise<Book> => {
    const bookIndex = mockBooks.findIndex(b => b.id === id);
    if (bookIndex === -1) {
        throw new Error("Livro não encontrado.");
    }

    validateUniqueCode(updatedData.codigoIdentificador, id);
    const existingBook = mockBooks[bookIndex];

    const updatedBook: Book = {
        ...existingBook,
        ...updatedData,
        id: existingBook.id,
        dataCadastro: existingBook.dataCadastro,
    };

    mockBooks[bookIndex] = updatedBook;
    return updatedBook;
};

export const deleteBook = async (id: string): Promise<void> => {
    const initialLength = mockBooks.length;
    mockBooks = mockBooks.filter(b => b.id !== id);
    if (mockBooks.length === initialLength) {
        throw new Error("Livro não encontrado para exclusão.");
    }
};

export const getBooks = async (filters: BookFilters): Promise<Book[]> => {
    return mockBooks.filter(book => {
      
        const matchesTitle = filters.titulo
            ? book.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
            : true;
        
    
        const matchesAuthor = filters.autor
            ? book.autor.toLowerCase().includes(filters.autor.toLowerCase())
            : true;
        
          let matchesPeriod = true;
        if (filters.periodoInicial) {
            matchesPeriod = matchesPeriod && book.dataCadastro >= filters.periodoInicial;
        }
        if (filters.periodoFinal) {
            matchesPeriod = matchesPeriod && book.dataCadastro <= filters.periodoFinal;
        }

        return matchesTitle && matchesAuthor && matchesPeriod;
    }).sort((a, b) => a.titulo.localeCompare(b.titulo)); 
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
    return mockBooks.find(b => b.id === id);
};