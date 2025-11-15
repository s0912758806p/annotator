import { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import Login from './components/Login';
import Annotator from './components/Annotator';
import './App.css';

const STORAGE_KEY = 'isLoggedIn';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isLoggedIn));
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ConfigProvider locale={zhTW}>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Annotator onLogout={handleLogout} />
      )}
    </ConfigProvider>
  );
}

export default App;
