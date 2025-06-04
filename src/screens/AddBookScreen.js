import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  I18nManager,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoibm9hbS1sZTE3IiwiYSI6ImNtYmR1NWlmNDFubXMybHF1ODQ1bnZyMnEifQ.NJhcqpK_3J-Tg-EGNV7C0A';

export default function AddBookScreen({ navigation }) {
  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [contactInfo, setContactInfo] = useState('');
  const [images, setImages] = useState([]);

  const fetchLocationSuggestions = async (query) => {
    if (!query) {
      setLocationSuggestions([]);
      setSelectedLocation(null);
      return;
    }
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=il&limit=5`
      );
      const data = await response.json();
      setLocationSuggestions(data.features || []);
    } catch (error) {
      console.log('Error fetching location suggestions:', error);
    }
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('מגבלת תמונות', 'ניתן להוסיף עד 3 תמונות בלבד.');
      return;
    }
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('אין הרשאה', 'אנא אפשר גישה לגלריה.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const handleSubmit = () => {
    if (!title || !author || !selectedLocation || !contactInfo) {
      Alert.alert('שדות חסרים', 'אנא מלא את כל השדות וודא שהמיקום תקין');
      return;
    }

    // בונים את הספר החדש (כולל מיקום עם קואורדינטות)
    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      coordinate: {
        latitude: selectedLocation.center[1],
        longitude: selectedLocation.center[0],
      },
      distance: null, // נעדכן ב-home לפי מיקום המשתמש
      place_name: selectedLocation.place_name,
      contactInfo,
      images,
    };

    Alert.alert('הספר פורסם בהצלחה!', 'הספר נוסף למערכת', [
      {
        text: 'אישור',
        onPress: () => {
          // שולחים בחזרה ל-home עם הספר החדש
          navigation.navigate('Home', { newBook });
          // מאפסים שדות
          setTitle('');
          setAuthor('');
          setLocation('');
          setContactInfo('');
          setImages([]);
          setSelectedLocation(null);
          setLocationSuggestions([]);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📚 פרסום ספר למסירה 📚</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>שם הספר:</Text>
          <TextInput
            style={styles.input}
            placeholder="הכנס את שם הספר"
            value={title}
            onChangeText={setTitle}
            textAlign="right"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>שם הסופר:</Text>
          <TextInput
            style={styles.input}
            placeholder="הכנס את שם הסופר"
            value={author}
            onChangeText={setAuthor}
            textAlign="right"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>מיקום (בחר מהרשימה):</Text>
          <TextInput
            style={styles.input}
            placeholder="הקלד כתובת"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              fetchLocationSuggestions(text);
            }}
            textAlign="right"
          />
          {locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {locationSuggestions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setLocation(item.place_name);
                    setSelectedLocation(item);
                    setLocationSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionText}>{item.place_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>יצירת קשר:</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="איך אפשר ליצור קשר?"
            value={contactInfo}
            onChangeText={setContactInfo}
            multiline
            textAlign="right"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>תמונות (עד 3):</Text>
          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
            {images.length < 3 && (
              <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                <Text style={{ color: '#FF5C5C', fontWeight: 'bold', fontSize: 28 }}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Button title=" פרסם 📌" color="#FF5C5C" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 65,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#1C3B72',
    textAlign: 'center',
  },
  fieldContainer: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    color: '#1C3B72',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#1C3B72',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF5C5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionItem: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginTop: 3,
  },
  suggestionText: {
    textAlign: 'right',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1C3B72',
    borderRadius: 8,
    maxHeight: 140,
  },
});
