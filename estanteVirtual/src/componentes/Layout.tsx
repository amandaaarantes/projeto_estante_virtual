// src/componentes/Layout.tsx
import React from 'react';

interface LayoutProps {
  // O conteúdo principal da tela (UserList ou BookList)
  children: React.ReactNode; 
  // Função para mudar a tela atual (navigation)
  onNavigate: (screen: 'users' | 'books') => void; 
  // O nome da tela atual para destacar o botão
  currentScreen: 'users' | 'books'; 
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentScreen }) => {
  return (
    <div className="app-container">
      {/* CABEÇALHO */}
      <header style={{ 
        backgroundColor: '#007bff', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1>📚 Estante Virtual</h1>
        <nav>
          {/* Botão de navegação para a tela de Usuários */}
          <button 
            onClick={() => onNavigate('users')} 
            style={{ 
              marginRight: '15px', 
              fontWeight: currentScreen === 'users' ? 'bold' : 'normal',
              backgroundColor: currentScreen === 'users' ? '#0056b3' : 'transparent',
              color: 'white',
              border: '1px solid white'
            }}
          >
            Gerenciar Usuários
          </button>
          {/* Botão de navegação para a tela de Livros */}
          <button 
            onClick={() => onNavigate('books')}
            style={{ 
              fontWeight: currentScreen === 'books' ? 'bold' : 'normal',
              backgroundColor: currentScreen === 'books' ? '#0056b3' : 'transparent',
              color: 'white',
              border: '1px solid white'
            }}
          >
            Gerenciar Livros
          </button>
        </nav>
      </header>
      
      {/* CONTEÚDO PRINCIPAL (UserList ou BookList) */}
      <main style={{ padding: '20px' }}>
        {children}
      </main>
      
      {/* RODAPÉ */}
      <footer style={{ 
        padding: '10px', 
        backgroundColor: '#f4f4f4', 
        textAlign: 'center', 
        marginTop: 'auto' 
      }}>
        &copy; 2025 Projeto Estante Virtual - Desenvolvido pela SWFactory
      </footer>
    </div>
  );
};

export default Layout;