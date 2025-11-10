// src/componentes/App.tsx
import React, { useState } from 'react';
import UserList from './componentes/users/UserList';
import BookList from './componentes/books/BookList';
import Layout from './componentes/Layout';

type CurrentScreen = 'users' | 'books';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('users'); 

  const renderScreen = () => {
    switch (currentScreen) {
      case 'users':
        return <UserList />;
      case 'books':
        return <BookList />;
      default:
        return <div>Tela não encontrada</div>;
    }
  };

  return (
    <Layout 
      onNavigate={setCurrentScreen} 
      currentScreen={currentScreen}
    >
      {renderScreen()}
    </Layout>
  );
};

export default App;