import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Meeting from '../components/Meeting'; 

export default function ProfileScreen({ navigation, onLogout }) {
  const [profileImage, setProfileImage] = useState(null);
  const [favoriteGenres, setFavoriteGenres] = useState('');
  const [city, setCity] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [hasCompletedMeeting, setHasCompletedMeeting] = useState(false);

  const [booksGiven, setBooksGiven] = useState([
    { id: '1', title: 'הארי פוטר ואבן החכמים' },
    { id: '2', title: 'שמש קופחת' },
  ]);
  const [booksReceived, setBooksReceived] = useState([
    { id: '3', title: 'הנסיך הקטן' },
    { id: '4', title: 'הסיפור שאינו נגמר' },
  ]);
  const [userBooks, setUserBooks] = useState([
    { id: '1', title: 'הארי פוטר ואבן החכמים' },
    { id: '2', title: 'שמש קופחת' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBooks, setModalBooks] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // בדיקה אם המשתמש כבר השלים היכרות (בדרך כלל זה יהיה שמור ב-AsyncStorage או בשרת)
  useEffect(() => {
    // כאן תוכל לבדוק ב-AsyncStorage או במקום אחר אם המשתמש כבר השלים היכרות
    // לדוגמה:
    // checkIfMeetingCompleted();
  }, []);

  const handleMeetingComplete = (data) => {
    setCity(data.city);
    setAgeRange(data.ageRange);
    setFavoriteGenres(data.genre);
    setProfileImage(data.profileImage);
    setHasCompletedMeeting(true);
    
    // כאן תוכל לשמור ב-AsyncStorage שהמשתמש השלים היכרות
    // AsyncStorage.setItem('hasCompletedMeeting', 'true');
    // וגם לשמור את פרטי המשתמש
  };

  const pickProfileImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('אין הרשאה', 'אנא אפשר לאפליקציה גישה לגלריה.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setImageModalVisible(false);
    }
  };

  const openBooksModal = (books, title) => {
    setModalBooks(books);
    setModalTitle(title);
    setModalVisible(true);
  };

  const handleLogout = () => {
    onLogout();
  };

  // אם המשתמש לא השלים היכרות, הצג את רכיב ההיכרות
  if (!hasCompletedMeeting) {
    return <Meeting onFinish={handleMeetingComplete} />;
  }

  // אחרת, הצג את מסך הפרופיל
  return (
    <View style={styles.container}>
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF5C5C" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>הפרופיל שלי</Text>

      <TouchableOpacity onPress={() => setImageModalVisible(true)}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../assets/adaptive-icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.editPhotoText}>ערוך תמונה</Text>
      </TouchableOpacity>

      <Modal visible={imageModalVisible} transparent animationType="fade">
        <View style={styles.imageModalBackground}>
          <Pressable style={{ flex: 1 }} onPress={() => setImageModalVisible(false)}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../../assets/adaptive-icon.png')}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={pickProfileImage}
          >
            <Text style={styles.editPhotoButtonText}>בחר תמונה חדשה</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text style={styles.label}>עיר מגורים</Text>
      <Text style={styles.infoText}>{city}</Text>

      <Text style={styles.label}>טווח גיל</Text>
      <Text style={styles.infoText}>{ageRange}</Text>

      <Text style={styles.label}>סוגי ספרים אהובים</Text>
      <TextInput
        style={styles.input}
        placeholder="לדוגמה: רומן, פנטזיה, מדע בדיוני"
        value={favoriteGenres}
        onChangeText={setFavoriteGenres}
        textAlign="right"
        writingDirection="rtl"
        placeholderTextColor="#aaa"
      />

      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => openBooksModal(booksGiven, 'ספרים שנתתי')}
        >
          <Text style={styles.statNumber}>{booksGiven.length}</Text>
          <Text style={styles.statLabel}>ספרים שנתתי</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statBox}
          onPress={() => openBooksModal(booksReceived, 'ספרים שקיבלתי')}
        >
          <Text style={styles.statNumber}>{booksReceived.length}</Text>
          <Text style={styles.statLabel}>ספרים שקיבלתי</Text>
        </TouchableOpacity>
      </View>


      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={modalBooks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text style={styles.modalBookTitle}>{item.title}</Text>
              )}
              contentContainerStyle={{ paddingVertical: 10 }}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  logoutButtonContainer: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  logoutButton: {
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C3B72',
    marginBottom: 15,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#1C3B72',
  },
  editPhotoText: {
    color: '#1C3B72',
    textAlign: 'center',
    marginBottom: 15,
    textDecorationLine: 'underline',
    writingDirection: 'rtl',
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    color: '#444',
    textAlign: 'left',
    writingDirection: 'rtl',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
    textAlign: 'right',
    direction: 'ltr',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F6FB',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#222',
  },
  statsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F3F6FB',
    minWidth: 100,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5C5C',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bookItem: {
    padding: 14,
    backgroundColor: '#FF5C5C',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  bookTitle: {
    fontSize: 16,
    color: '#1C3B72',
    textAlign: 'left',
    writingDirection: 'rtl',
    fontWeight: '500',
    flex: 1,
  },
  myBooks: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C3B72',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  modalBookTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
    writingDirection: 'rtl',
  },
  closeModalButton: {
    marginTop: 15,
    backgroundColor: '#FF5C5C',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    writingDirection: 'rtl',
  },
  // Full image modal
  imageModalBackground: {
    flex: 1,
    paddingTop: 250,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  editPhotoButtonText: {
    color: '#fff',
    fontSize: 18,
    textDecorationLine: 'underline',
    backgroundColor: 'rgba(28,59,114,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
});