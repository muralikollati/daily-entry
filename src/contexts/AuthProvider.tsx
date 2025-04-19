import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { tokenType } from '../types/navigation';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  token: tokenType;
  getToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handleSignUp: (username: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<tokenType>('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken(); // 👈 get the token
        setToken(idToken);
      } else {
        setToken('');
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async (username: string, email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: username });
      await firestore().collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        username,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Toast.show({
        type: 'success',
        text1: 'Account created successfully!',
        text2: 'You can create a new entry now.',
      })

    } catch (error: any) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: error.message,
      });
      // Alert.alert('Signup Error', error.message);
    }
  };

  const registerUser = async (email: string, password: string, username: string) => {
    try {
      // Create user with email & password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;
  
      // Save additional user info in Firestore
      await firestore().collection('users').doc(uid).set({
        email,
        username,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  
      console.log('User registered and data saved!');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  

  const login = async (email: string, password: string) => {
    const res = await auth().signInWithEmailAndPassword(email, password);
    const idToken = await res.user.getIdToken(); // 👈 fetch token again after login
    setToken(idToken);
    setUser(res.user);
  };

  const logout = async () => {
    await auth().signOut();
    setUser(null);
    setToken('');
  };

  const getToken = async () => {
    if (user) {
      const idToken = await user.getIdToken(true); // `true` forces refresh
      setToken(idToken);
      return idToken;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken, token, handleSignUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
