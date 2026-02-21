import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignUpForm';
import Home from './Components/Home';
import CartPage from './Components/CartPage';
import OAuthCallback from './Components/OAuthCallback';
import { useAuth, AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import api from './api/axiosConfig';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    setSearchError('');
    try {
      let response;
      if (query) {
        response = await api.get(`/medicines/search?q=${query}`);
        setMedicines(response.data.data);
        if (response.data.data.length === 0 && query) {
          setSearchError(`No medicines found for "${query}".`);
        } else {
          setSearchError('');
        }
      } else {
        response = await api.get('/medicines?limit=1000');
        setMedicines(response.data.data);
      }
    } catch (err) {
      setMedicines([]);
      setSearchError(query ? `Failed to fetch medicines for "${query}".` : 'Failed to load initial medicines.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
      <Route path="/login" element={!user ? <LoginForm onGotoSignup={() => navigate('/signup')} /> : <Navigate to="/home" replace />} />
      <Route path="/signup" element={!user ? <SignupForm onGotoLogin={() => navigate('/login')} /> : <Navigate to="/home" replace />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          user ? (
            <>
              <Header onLogout={handleLogout} />
              <Home
                searchQuery={searchQuery}
                onSearch={handleSearch}
                medicines={medicines}
                isSearching={isSearching}
                searchError={searchError}
              />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/cart"
        element={
          user ? (
            <>
              <Header onLogout={handleLogout} />
              <CartPage />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
