import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ onLogin, navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '907066650247-b2jpa0hkgkmbjl5g6ugrql4rcplm9ojp.apps.googleusercontent.com', // שים כאן את ה-client ID שלך
    iosClientId: '23224224324-sg7gs2rv3gt3hs89cau33opla264coj9.apps.googleusercontent.com',
    androidClientId: '23224224324-04aac90p1a56h967q0e6sv6l5j34phe5.apps.googleusercontent.com',
    webClientId: '23224224324-0qcqh1ebukl4l4i647vfhjvqfb43rrk8.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // כאן אפשר להשתמש ב-token של גוגל או לשמור אותו
      onLogin({ username: 'משתמש מגוגל', token: authentication.accessToken });
    }
  }, [response]);

  const handleSignIn = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('שגיאה', 'אנא מלא שם משתמש וסיסמה');
      return;
    }
    onLogin({ username });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <Text style={styles.title}>התחבר</Text>

      <TextInput
        style={styles.input}
        placeholder="שם משתמש"
        value={username}
        onChangeText={setUsername}
        textAlign="right"
      />

      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textAlign="right"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>התחבר</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>התחבר עם גוגל</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.registerLink}>משתמש חדש? הרשם כאן</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center',
    color: '#1C3B72',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#003366',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#003366',
  },
  button: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#003366',
  },
  registerLink: {
    color: '#003366',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: 14,
  },
});
