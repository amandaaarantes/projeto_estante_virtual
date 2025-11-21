import React, { useState, useEffect } from 'react';
import { type User, type UserFilters } from '../../types/User'; 
import { getUsers, deleteUser } from '../../services/userService'; 
import UserForm from './UserForm'; 
// OBS: Você deve garantir que o CSS contendo as classes abaixo está carregado globalmente.

const UserList: React.FC = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<UserFilters>({});
    const [error, setError] = useState<string | null>(null);
    
    // NOVO: Controle de estado para o formulário e edição
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined); 

    // MOCK: Perfil para controle de acesso (Apenas Admin pode excluir)
    const currentUserProfile = 'Administrador' as const; // MOCKADO como Admin para testar exclusão

    // Implementação de Consultar Usuário [RF2]
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // [RF2] Consultar Usuário: Usa os filtros da Tabela 2
            const data = await getUsers(filters); 
            setUserList(data);
        } catch (err) {
            setError("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    // Função para abrir o formulário em modo de Cadastro [RF1]
    const handleAdd = () => {
        setUserToEdit(undefined); // Garante que é um novo cadastro
        setIsFormOpen(true);
    }
    
    // Função para abrir o formulário em modo de Edição [RF3]
    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setIsFormOpen(true);
    }

    // Implementação de Excluir Usuário [RF4] - Apenas Administrador
    const handleDelete = async (id: string, nickname: string) => {
        // Atores: Administrador pode excluir [RF4]
        if (currentUserProfile !== 'Administrador') { 
            alert("Apenas Administradores podem excluir usuários.");
            return;
        }
        if (window.confirm(`Confirma a exclusão do usuário "${nickname}"?`)) { 
            try {
                await deleteUser(id);
                fetchUsers(); // Recarrega a lista
                alert("Usuário excluído com sucesso.");
            } catch (err: any) {
                alert(`Erro ao excluir: ${err.message}`);
            }
        }
    };
    
    // Recarrega a lista quando o componente monta ou quando os filtros mudam
    useEffect(() => {
        fetchUsers();
    }, [filters.nome, filters.nickname]); 

    return (
        <div className="user-list">
            <h3>Gerenciamento de Usuários</h3>

            {/* Renderização Condicional do Formulário (Inserir/Editar) */}
            {isFormOpen && (
                <UserForm
                    userToEdit={userToEdit}
                    onCancel={() => setIsFormOpen(false)} // Fecha o formulário
                    onUserSaved={() => {
                        setIsFormOpen(false); // Fecha o formulário após salvar
                        fetchUsers(); // Recarrega a lista para ver a mudança
                    }}
                />
            )}
            
            {/* --- ÁREA DE FILTROS CORRIGIDA (Ocupando uma linha) --- 
                
                Usamos o mesmo estilo de grid do BookList para alinhar os campos 
                e o botão na mesma linha.
            */}
            <div style={{ 
                marginBottom: '20px', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // O mesmo grid do BookList
                gap: '10px',
                alignItems: 'end'
            }}>
                <input 
                    placeholder="Buscar por Nome do Usuário" 
                    onChange={(e) => setFilters({...filters, nome: e.target.value})} 
                    style={{ width: '100%', padding: '8px' }} // Estilo do BookList
                />
                
                <input 
                    placeholder="Buscar por Apelido" 
                    onChange={(e) => setFilters({...filters, nickname: e.target.value})} 
                    style={{ width: '100%', padding: '8px' }} // Estilo do BookList
                />
                
                {/* Divs vazios para empurrar o botão para a direita, 
                    replicando o comportamento de 4 campos + 1 botão do BookList 
                */}
                <div></div>
                <div></div>

                <button 
                    onClick={handleAdd} // Abre o formulário de Cadastro [RF1]
                    style={{ 
                        padding: '8px 15px', 
                        cursor: 'pointer', 
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        height: '35px'
                    }} // Estilo do BookList
                >
                    + Novo Usuário
                </button>
            </div>
            
            {loading && <p>Carregando dados...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            
            {/* Tabela com os ESTILOS INLINE do BookList.tsx */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }} border={1}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Cód.</th> 
                            <th style={{ padding: '10px' }}>Nome</th>
                            <th style={{ padding: '10px' }}>Apelido</th>
                            <th style={{ padding: '10px' }}>Telefone</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Perfil</th>
                            <th style={{ padding: '10px', width: '150px' }}>Ações</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{user.id.substring(0, 4)}</td> 
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{user.nome}</td> 
                                <td style={{ padding: '10px' }}>{user.nickname}</td>
                                <td style={{ padding: '10px' }}>{user.telefone}</td>
                                <td style={{ padding: '10px' }}>{user.email}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85em',
                                        // Estilos de status copiados do BookList, adaptados para Perfil
                                        backgroundColor: user.perfil === 'Administrador' ? '#d4edda' : '#fff3cd',
                                        color: user.perfil === 'Administrador' ? '#155724' : '#856404'
                                    }}>
                                        {user.perfil}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {/* Ajustando os botões para o estilo do BookList */}
                                    <button 
                                        onClick={() => handleEdit(user)} 
                                        style={{ marginRight: '5px', cursor: 'pointer' }}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id, user.nickname)} 
                                        style={{ cursor: 'pointer', color: 'white' }}
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