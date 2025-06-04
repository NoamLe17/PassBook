import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';

export default function SignUpScreen({ onSignUp, onBackToSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSignUp() {
    if (!email || !password) {
      Alert.alert('נא למלא את כל השדות');
      return;
    }
    setLoading(true);
    // כאן תוכל להוסיף לוגיקת הרשמה אמיתית (API/Firebase)
    setTimeout(() => {
      setLoading(false);
      Alert.alert('ההרשמה בוצעה בהצלחה!');
      // מדווחים ל-App שהמשתמש נרשם וכנראה רוצים להיכנס מיד
      onSignUp({ email, method: 'email' });
    }, 1500);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הרשמה חדשה</Text>

      <TextInput
        style={styles.input}
        placeholder="אימייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>הרשמה</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onBackToSignIn}>
        <Text style={styles.backToSignInText}>כבר יש לך חשבון? התחבר כאן</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: '#f2f2f2',
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backToSignInText: {
    marginTop: 20,
    color: Colors.secondary,
    textAlign: 'center',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
