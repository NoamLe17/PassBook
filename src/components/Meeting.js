import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Meeting({ onFinish }) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [genre, setGenre] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleNext = () => {
    if (step === 0 && city.trim() === '') return Alert.alert('יש למלא עיר');
    if (step === 2 && genre.trim() === '') return Alert.alert('בחר סגנון מועדף');
    setStep(step + 1);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('אין הרשאה', 'אנא אפשר לאפליקציה גישה לגלריה.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleFinish = () => {
    if (!profileImage) return Alert.alert('יש לבחור תמונה');
    onFinish({ city, ageRange, genre, profileImage });
  };

  const ageOptions = ['עד 18', '18-24', '24-35', '35-50', '50+'];
  const genreOptions = ['רומן', 'פנטזיה', 'מדע בדיוני', 'מתח', 'עיון'];

  return (
    <View style={styles.container}>
      {step === 0 && (
        <>
          <Text style={styles.title}>מאיפה אתה?</Text>
          <TextInput
            style={styles.input}
            placeholder="עיר מגורים"
            value={city}
            onChangeText={setCity}
            textAlign="right"
          />
        </>
      )}

      {step === 1 && (
        <>
          <Text style={styles.title}>מה הגיל שלך?</Text>
          {ageOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                ageRange === option && styles.selectedOption,
              ]}
              onPress={() => setAgeRange(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>מה הסגנון שאתה אוהב?</Text>
          {genreOptions.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.optionButton,
                genre === g && styles.selectedOption,
              ]}
              onPress={() => setGenre(g)}
            >
              <Text style={styles.optionText}>{g}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>תמונה לפרופיל</Text>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../../assets/adaptive-icon.png')
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.imageHint}>לחץ על התמונה לבחירת תמונה</Text>
        </>
      )}

      <TouchableOpacity
        style={styles.nextButton}
        onPress={step === 3 ? handleFinish : handleNext}
      >
        <Text style={styles.nextButtonText}>
          {step === 3 ? 'סיום' : 'הבא'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right',
    color: '#1C3B72',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'right',
    color: '#222',
  },
  optionButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#FF5C5C22',
    borderColor: '#FF5C5C',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'right',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#1C3B72',
  },
  imageHint: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 30,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});