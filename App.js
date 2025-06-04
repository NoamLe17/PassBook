import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, I18nManager, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './src/constants/Colors';
import AppNavigator from './src/navigation/AppNavigator'; // ניווט על פי התחברות

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // מאפשר RTL – תוכל לשנות לפי הצורך
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log('Error reading user from storage:', e);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.log('Error saving user to storage:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (e) {
      console.log('Error removing user from storage:', e);
    }
  };

  if (showSplash) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashText}>PassBook</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF5C5C" />
      </View>
    );
  }

  return (
    <AppNavigator user={user} onLogin={handleLogin} onLogout={handleLogout} />
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  splashText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
