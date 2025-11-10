import { type User, type UserFilters, type UserProfile } from '../types/User'; 
import { v4 as uuidv4 } from 'uuid'; 
let mockUsers: User[] = [
    {
        id: 'u1', nome: 'Admin Master', nickname: 'admin', telefone: '11999998888',
        endereco: 'Rua Principal, 100', email: 'admin@library.com', senha: '123',
        perfil: 'Administrador', dataCadastro: new Date().toISOString().split('T')[0]
    },
    {
        id: 'u2', nome: 'Bibliotecário Chefe', nickname: 'biblio', telefone: '21988887777',
        endereco: 'Av. Secundária, 200', email: 'biblio@library.com', senha: '123',
        perfil: 'Bibliotecário', dataCadastro: new Date().toISOString().split('T')[0]
    },
    {
        id: 'u3', nome: 'Usuário Padrão', nickname: 'user1', telefone: '31977776666',
        endereco: 'Travessa da Paz, 300', email: 'user@library.com', senha: '123',
        perfil: 'Usuário', dataCadastro: new Date().toISOString().split('T')[0]
    },
];
const validatePassword = (senha: string) => {
    if (senha.length < 8) {
        throw new Error("RNF07: A senha deve ter no mínimo 8 caracteres.");
    }
    
};

export const createUser = async (newUserData: Omit<User, 'id' | 'dataCadastro' | 'perfil'>, perfil: UserProfile): Promise<User> => {
    if (mockUsers.some(u => u.nickname === newUserData.nickname)) {
        throw new Error(`Nickname '${newUserData.nickname}' já está em uso.`);
    }
    validatePassword(newUserData.senha);

    const newUser: User = {
        ...newUserData,
        id: uuidv4(),
        perfil: perfil, 
        dataCadastro: new Date().toISOString().split('T')[0],
    };

    mockUsers.push(newUser);
    return newUser;
};

export const updateUser = async (id: string, updatedData: Omit<User, 'id' | 'dataCadastro'>): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
        throw new Error("Usuário não encontrado.");
    }

    if (updatedData.senha && updatedData.senha.length > 0) {
        validatePassword(updatedData.senha);
    } else {
        updatedData.senha = mockUsers[userIndex].senha;
    }
    
    const existingUser = mockUsers[userIndex];

    const updatedUser: User = {
        ...existingUser,
        ...updatedData,
        id: existingUser.id, 
        nickname: existingUser.nickname,
        dataCadastro: existingUser.dataCadastro,
    };

    mockUsers[userIndex] = updatedUser;
    return updatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
    const initialLength = mockUsers.length;
    mockUsers = mockUsers.filter(u => u.id !== id);
    if (mockUsers.length === initialLength) {
        throw new Error("Usuário não encontrado para exclusão.");
    }
};

export const getUsers = async (filters: UserFilters): Promise<User[]> => {
    return mockUsers.filter(user => {
        const matchesName = filters.nome
            ? user.nome.toLowerCase().includes(filters.nome.toLowerCase())
            : true;
        
        const matchesNickname = filters.nickname
            ? user.nickname.toLowerCase().includes(filters.nickname.toLowerCase())
            : true;

        return matchesName && matchesNickname;
    });
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    return mockUsers.find(u => u.id === id);
};