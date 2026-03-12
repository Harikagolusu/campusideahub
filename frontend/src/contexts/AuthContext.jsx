import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isMock = auth.app.options.apiKey === "dummy_api_key";

  async function login(email, password) {
    if (isMock) {
      const mockUser = { uid: 'mock_uid_123', email, name: email.split('@')[0], department: 'CSE', year: '1' };
      setCurrentUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return { user: mockUser };
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password) {
    if (isMock) {
      const mockUser = { uid: 'mock_uid_123', email };
      return { user: mockUser };
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    if (isMock) {
      setCurrentUser(null);
      localStorage.removeItem('mockUser');
      return;
    }
    return signOut(auth);
  }

  useEffect(() => {
    if (isMock) {
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/login`, {
            uid: user.uid,
            email: user.email
          });
          setCurrentUser({ ...user, ...res.data });
        } catch (error) {
          console.error("Auth sync error:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
