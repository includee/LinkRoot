import axios from "axios";
import { createContext, useState } from "react";

axios.defaults.baseURL = 'http://127.0.0.1:8000/';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [user, setUser] = useState(null); // New state for user data

  const onLogin = async (email, password) => {
    const data = {
      email,
      password,
    };
    setLoading(true);
    try {
      const response = await axios.post('/auth/token/login/', data);
      localStorage.setItem('auth_token', response.data.auth_token);
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);  // Update authentication state
      
      // Fetch user data after successful login
      await fetchUserData(); // Call function to get user data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await axios.get('/auth/users/me/', {
          headers: { Authorization: `Token ${token}` }
        });
        setUser(response.data); // Set user data from response
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const onRegister = async (email, password, re_password) => {
    setLoading(true);
    const data = {
      email,
      password,
      re_password,
    };
    try {
      await axios.post('/auth/users/', data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);  // Reset authentication state
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider
      value={{
        onLogin,
        onRegister,
        onLogout,
        isAuthenticated,
        user, // Expose user data
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
