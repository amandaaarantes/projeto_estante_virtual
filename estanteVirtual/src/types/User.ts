
export type UserProfile = 'Administrador' | 'Bibliotecário' | 'Usuário';

export interface User {
    id: string; 
    nome: string;
    nickname: string; 
    telefone: string;
    endereco: string;
    email: string;
    senha: string;
    perfil: UserProfile;
    dataCadastro: string;
}

export interface UserFilters {
    nome?: string;
    nickname?: string;
}