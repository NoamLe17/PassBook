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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function Meeting({ onFinish }) {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [genre, setGenre] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleNext = () => {
    if (step === 0 && city.trim() === '') return Alert.alert('שגיאה', 'יש למלא עיר מגורים');
    if (step === 1 && ageRange === '') return Alert.alert('שגיאה', 'יש לבחור טווח גיל');
    if (step === 2 && genre.trim() === '') return Alert.alert('שגיאה', 'יש לבחור סגנון מועדף');
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

  const handleFinish = async () => {
    if (!profileImage) return Alert.alert('שגיאה', 'יש לבחור תמונה לפרופיל');
    
    const userData = {
      city,
      ageRange,
      genre,
      profileImage,
      completedAt: new Date().toISOString(),
    };

    try {
      // שמירת הנתונים ב-AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      // קריאה לפונקציית הסיום
      onFinish(userData);
    } catch (error) {
      console.error('שגיאה בשמירת נתוני היכרות:', error);
      Alert.alert('שגיאה', 'לא ניתן לשמור את הנתונים, אנא נסה שוב');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const ageOptions = ['עד 18', '18-24', '24-35', '35-50', '50+'];
  const genreOptions = ['רומן', 'פנטזיה', 'מדע בדיוני', 'מתח', 'עיון', 'ביוגרפיה', 'היסטוריה'];

  const getStepTitle = () => {
    switch (step) {
      case 0: return 'מאיפה אתה?';
      case 1: return 'מה הגיל שלך?';
      case 2: return 'מה הסגנון שאתה אוהב?';
      case 3: return 'תמונה לפרופיל';
      default: return '';
    }
  };

  const getProgress = () => {
    return ((step + 1) / 4) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getProgress()}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{step + 1} מתוך 4</Text>
      </View>

      <Text style={styles.title}>{getStepTitle()}</Text>

      {step === 0 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="עיר מגורים"
            value={city}
            onChangeText={setCity}
            textAlign="right"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.hint}>הזן את העיר בה אתה גר</Text>
        </>
      )}

      {step === 1 && (
        <>
          {ageOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                ageRange === option && styles.selectedOption,
              ]}
              onPress={() => setAgeRange(option)}
            >
              <Text style={[
                styles.optionText,
                ageRange === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 2 && (
        <>
          {genreOptions.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.optionButton,
                genre === g && styles.selectedOption,
              ]}
              onPress={() => setGenre(g)}
            >
              <Text style={[
                styles.optionText,
                genre === g && styles.selectedOptionText
              ]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../../assets/adaptive-icon.png')
              }
              style={styles.profileImage}
            />
            {!profileImage && (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>+</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.imageHint}>לחץ על התמונה לבחירת תמונה מהגלריה</Text>
        </>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>חזור</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            step > 0 && styles.nextButtonWithBack
          ]}
          onPress={step === 3 ? handleFinish : handleNext}
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'סיום' : 'הבא'}
          </Text>
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF5C5C',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'right',
    direction: 'ltr',
    color: '#1C3B72',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'right',
    color: '#222',
    backgroundColor: '#F9F9F9',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    direction: 'ltr',
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  selectedOption: {
    backgroundColor: '#FF5C5C',
    borderColor: '#FF5C5C',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'right',
    direction: 'ltr',
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1C3B72',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 92, 92, 0.1)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 40,
    color: '#FF5C5C',
    fontWeight: 'bold',
  },
  imageHint: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
  },
  nextButtonWithBack: {
    flex: 0.7,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 0.3,
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});