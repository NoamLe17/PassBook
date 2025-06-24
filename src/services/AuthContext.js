import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChange, 
  signOutUser, 
  getUserProfile,
  saveUserProfile 
} from './firebase'; 

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (!mounted) return;
        
        if (firebaseUser) {
          // המשתמש מחובר
          setUser(firebaseUser);
          setIsAuthenticated(true);
          
          // טעינת פרופיל המשתמש מ-Firestore
          try {
            const profileResult = await getUserProfile(firebaseUser.uid);
            if (mounted) {
              if (profileResult.success) {
                setUserProfile(profileResult.data);
              } else {
                // אם אין פרופיל, ניצור אחד בסיסי
                const basicProfile = {
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || firebaseUser.email,
                  photoURL: firebaseUser.photoURL,
                  lastLogin: new Date(),
                  isAnonymous: firebaseUser.isAnonymous,
                };
                
                const saveResult = await saveUserProfile(firebaseUser.uid, basicProfile);
                if (saveResult.success) {
                  setUserProfile(basicProfile);
                } else {
                  console.error('שגיאה בשמירת פרופיל בסיסי:', saveResult.error);
                }
              }
            }
          } catch (error) {
            console.error('שגיאה בטעינת פרופיל המשתמש:', error);
            if (mounted) {
              setError('שגיאה בטעינת פרופיל המשתמש');
            }
          }
        } else {
          // המשתמש לא מחובר
          if (mounted) {
            setUser(null);
            setUserProfile(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('שגיאה בבדיקת מצב האימות:', error);
        if (mounted) {
          setError('שגיאה בבדיקת מצב האימות');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('שגיאה בהתנתקות:', error);
      setError('שגיאה בהתנתקות');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) {
      throw new Error('לא ניתן לעדכן פרופיל - המשתמש לא מחובר');
    }
    
    try {
      const result = await saveUserProfile(user.uid, updates);
      if (result.success) {
        setUserProfile(prev => ({ ...prev, ...updates }));
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('שגיאה בעדכון פרופיל:', error);
      setError('שגיאה בעדכון פרופיל');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    loading,
    error,
    logout,
    updateUserProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};