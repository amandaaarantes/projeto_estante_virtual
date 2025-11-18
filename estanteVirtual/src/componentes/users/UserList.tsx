import React, { useState, useEffect } from 'react';
import { type User, type UserFilters } from '../../types/User'; 
import { getUsers, deleteUser } from '../../services/userService'; 
import UserForm from './UserForm'; 

const UserList: React.FC = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<UserFilters>({});
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined); 
    const currentUserProfile = 'Administrador' as const;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers(filters); 
            setUserList(data);
        } catch (err) { setError("Erro ao carregar usuários."); } finally { setLoading(false); }
    };

    const handleAdd = () => { setUserToEdit(undefined); setIsFormOpen(true); }
    const handleEdit = (user: User) => { setUserToEdit(user); setIsFormOpen(true); }
    const handleDelete = async (id: string, nickname: string) => {
        if (currentUserProfile !== 'Administrador') { alert("Apenas Administradores."); return; }
        if (window.confirm(`Excluir usuário "${nickname}"?`)) { 
            try { await deleteUser(id); fetchUsers(); } catch (err: any) { alert(err.message); }
        }
    };
    useEffect(() => { fetchUsers(); }, [filters.nome, filters.nickname]); 

    // Estilo base para os botões da tabela
    const actionBtnStyle = {
        padding: '6px 12px',
        marginRight: '5px',
        fontSize: '0.85em',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '500'
    };

    return (
        <div className="user-list">
            <h3>Gerenciamento de Usuários</h3>

            {isFormOpen && (
                <UserForm userToEdit={userToEdit} onCancel={() => setIsFormOpen(false)} onUserSaved={() => { setIsFormOpen(false); fetchUsers(); }} />
            )}
            
            {/* --- FILTROS --- */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'flex-end',
                flexWrap: 'wrap' 
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px'}}></label>
                    <input placeholder="Buscar por Nome" onChange={(e) => setFilters({...filters, nome: e.target.value})} />
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px'}}></label>
                    <input placeholder="Buscar por Apelido" onChange={(e) => setFilters({...filters, nickname: e.target.value})} />
                </div>

                <button onClick={handleAdd} style={{ height: '37px', whiteSpace: 'nowrap', backgroundColor: '#007bff' }}>
                    + Novo Usuário
                </button>
            </div>
            
            {loading && <p>Carregando...</p>}
            
            {/* --- TABELA --- */}
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th><th>Apelido</th><th>Telefone</th><th>Email</th><th>Perfil</th><th style={{ width: '160px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id}>
                                <td>{user.nome}</td>
                                <td>{user.nickname}</td>
                                <td>{user.telefone}</td>
                                <td>{user.email}</td>
                                <td><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.85em', backgroundColor: '#e9ecef', color: '#495057', fontWeight: 'bold' }}>{user.perfil}</span></td>
                                <td>
                                    {/* Botão Editar: AGORA AZUL (#007bff) */}
                                    <button 
                                        onClick={() => handleEdit(user)} 
                                        style={{...actionBtnStyle, backgroundColor: '#007bff'}}
                                    >
                                        Editar
                                    </button>
                                    
                                    {/* Botão Excluir: VERMELHO (#dc3545) */}
                                    <button 
                                        onClick={() => handleDelete(user.id, user.nickname)} 
                                        style={{...actionBtnStyle, backgroundColor: '#007bff'}}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default UserList;