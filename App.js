import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, I18nManager, StyleSheet, Text, Alert } from 'react-native';
import Colors from './src/constants/Colors';
import AppNavigator from './src/navigation/AppNavigator'; 
import { AuthProvider, useAuth } from './src/services/AuthContext';

// רכיב פנימי שמשתמש ב-AuthContext
function AppContent() {
  const { user, loading, error, clearError } = useAuth();

  // הצגת שגיאות אם יש
  useEffect(() => {
    if (error) {
      Alert.alert(
        'שגיאה',
        error,
        [
          {
            text: 'אישור',
            onPress: clearError,
          },
        ]
      );
    }
  }, [error, clearError]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>טוען...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  const [rtlReady, setRtlReady] = useState(false);

  useEffect(() => {
    const setupRTL = async () => {
      try {
        // מאפשר RTL
        I18nManager.allowRTL(true);
        if (!I18nManager.isRTL) {
          I18nManager.forceRTL(true);
          // ב-React Native יש צורך לפעמים לרענן את האפליקציה
          // אחרי שינוי RTL, אבל נעשה זאת רק אם זה באמת נדרש
        }
        setRtlReady(true);
      } catch (error) {
        console.error('שגיאה בהגדרת RTL:', error);
        // גם אם יש שגיאה, נמשיך עם האפליקציה
        setRtlReady(true);
      }
    };

    setupRTL();
  }, []);

  if (!rtlReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>מכין את האפליקציה...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});