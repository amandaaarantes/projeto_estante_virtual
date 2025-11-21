import React, { useState } from 'react';
import { type User, type UserProfile } from '../../types/User';
import { createUser, updateUser } from '../../services/userService';

interface UserFormProps {
    userToEdit?: User; 
    onUserSaved: () => void; 
    onCancel: () => void; 
}

const initialUserState: Omit<User, 'id' | 'dataCadastro'> = {
    nome: '',
    nickname: '',
    telefone: '',
    endereco: '',
    email: '',
    senha: '',
    perfil: 'Usuário' as UserProfile, 
};

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onUserSaved, onCancel }) => {
    const [userData, setUserData] = useState<Omit<User, 'id' | 'dataCadastro'>>(
        userToEdit ? {
            nome: userToEdit.nome,
            nickname: userToEdit.nickname,
            telefone: userToEdit.telefone,
            endereco: userToEdit.endereco,
            email: userToEdit.email,
            senha: '', 
            perfil: userToEdit.perfil,
        } : initialUserState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!userToEdit;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'perfil' ? value as UserProfile : value;
        
        setUserData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditing && userToEdit) {
                await updateUser(userToEdit.id, userData); 
                alert(`Usuário ${userData.nickname} editado com sucesso!`);
            } else {
                await createUser(userData, userData.perfil); 
                alert('Usuário cadastrado com sucesso!');
            }
            onUserSaved(); 
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar o usuário.');
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
                {isEditing ? `Editar Usuário: ${userToEdit?.nickname}` : 'Cadastro de Novo Usuário'}
            </h3>
            <form onSubmit={handleSubmit}>
                
                {/* Linha 1: Nome, Apelido, Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Nome do Usuário</label>
                        <input 
                            name="nome" 
                            value={userData.nome} 
                            onChange={handleChange} 
                            placeholder="Nome do Usuário" 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    
                    <div>
                        <label style={labelStyle}>Apelido/Nickname (Único)</label>
                        <input 
                            name="nickname" 
                            value={userData.nickname} 
                            onChange={handleChange} 
                            placeholder="Apelido/Nickname (Único)" 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email</label>
                        <input 
                            name="email" 
                            value={userData.email} 
                            onChange={handleChange} 
                            type="email" 
                            placeholder="Email" 
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Linha 2: Telefone, Endereço */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={labelStyle}>Telefone</label>
                        <input 
                            name="telefone" 
                            value={userData.telefone} 
                            onChange={handleChange} 
                            placeholder="Telefone (XX)XXXXX-XXXX" 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Endereço</label>
                        <input 
                            name="endereco" 
                            value={userData.endereco} 
                            onChange={handleChange} 
                            placeholder="Endereço" 
                            required 
                            style={inputStyle}
                        />
                    </div>
                </div>
                
                {/* Linha 3: Senha e Perfil */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div>
                        <label style={labelStyle}>Senha Forte</label>
                        <div style={{fontSize: '0.8em', color: '#6c757d', marginBottom: '5px'}}>
                            * Senha deve ter 8+ caracteres, com maiúscula, minúscula, número e especial.
                        </div>
                        <input 
                            name="senha" 
                            value={userData.senha} 
                            onChange={handleChange} 
                            type="password" 
                            placeholder={isEditing ? "Nova Senha (vazio = manter)" : "Senha Forte"}
                            required={!isEditing}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Perfil</label>
                        <select 
                            name="perfil" 
                            value={userData.perfil} 
                            onChange={handleChange} 
                            required
                            style={{...inputStyle, height: '41px'}} // Ajuste fino de altura
                        >
                            <option value="Usuário">Usuário</option>
                            <option value="Bibliotecário">Bibliotecário</option>
                            <option value="Administrador">Administrador</option>
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

export default UserForm;