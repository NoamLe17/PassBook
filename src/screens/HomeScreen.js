import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,Pressable, StyleSheet, Dimensions,Modal, I18nManager, TouchableOpacity, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
I18nManager.forceRTL(true);

const initialBooks = [
  { id: '1', title: 'הארי פוטר ואבן החכמים', author: 'ג׳יי קיי רולינג', coordinate: { latitude: 32.0853, longitude: 34.7818 }, place_name: 'תל אביב' },
  { id: '2', title: 'שמש קופחת', author: 'שרה לוין', coordinate: { latitude: 32.7940, longitude: 34.9896 }, place_name: 'חיפה' },
  { id: '3', title: 'אל תספר לאחיך ', author: ' מאיר שלו', coordinate: { latitude: 31.781737, longitude: 34.690994 }, place_name: 'גן יבנה' },];

export default function HomeScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [books, setBooks] = useState(initialBooks);
  const [maxDistance, setMaxDistance] = useState(50);
  const [showOptions, setShowOptions] = useState(false);
   const [distanceModalVisible, setDistanceModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('אין הרשאה למיקום');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const updatedBooks = initialBooks.map((book) => {
        const distanceKm = getDistanceFromLatLonInKm(
          loc.coords.latitude,
          loc.coords.longitude,
          book.coordinate.latitude,
          book.coordinate.longitude
        );
        return {
          ...book,
          distance: parseFloat(distanceKm.toFixed(1)),
        };
      });
      setBooks(updatedBooks);
    })();
  }, []);

  useEffect(() => {
    if (route.params?.newBook && location) {
      const newBook = route.params.newBook;
      const distanceKm = getDistanceFromLatLonInKm(
        location.latitude,
        location.longitude,
        newBook.coordinate.latitude,
        newBook.coordinate.longitude
      );
      newBook.distance = parseFloat(distanceKm.toFixed(1));
      setBooks((prevBooks) => [newBook, ...prevBooks]);
      navigation.setParams({ newBook: null });
    }
  }, [route.params, location]);

  const filteredBooks = books.filter(book => book.distance <= maxDistance);

  const renderBook = ({ item }) => (
    <View style={styles.bookCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.place}>מיקום: {item.place_name}</Text>
      <Text style={styles.distance}>מרחק: {item.distance} ק"מ</Text>
    </View>
  );

  const DistanceOptions = () => (
    <View style={styles.optionsContainer}>
      {[10, 25, 50, 100, 200].map((val) => (
        <TouchableOpacity key={val} onPress={() => { setMaxDistance(val); setShowOptions(false); }}>
          <Text style={styles.option}>עד {val} ק"מ</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MapView
        style={styles.map}
        region={{
          latitude: location ? location.latitude : 32.0853,
          longitude: location ? location.longitude : 34.7818,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredBooks.map((book) => (
          <Marker
            key={book.id}
            coordinate={book.coordinate}
            title={book.title}
            description={book.author}
          />
        ))}
        {/* כפתור לבחירת טווח מרחק */}
          <TouchableOpacity style={styles.fab} onPress={() => setDistanceModalVisible(true)}>
            <Text style={styles.fabText}>📍</Text>
          </TouchableOpacity>
      </MapView>
      {/* מודאל מרחק */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={distanceModalVisible}
            onRequestClose={() => setDistanceModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>בחר טווח מרחק</Text>
                <Slider
                  minimumValue={1}
                  maximumValue={250}
                  step={1}
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  minimumTrackTintColor="#FF5C5C"
                  maximumTrackTintColor="#999"
                />
                <Text style={{ textAlign: 'center', marginTop: 10,marginBottom: 10, fontSize: 20}}>
                  {maxDistance} ק"מ
                </Text>
                <Pressable
                  style={styles.saveButton}
                  onPress={() => setDistanceModalVisible(false)}
                >
                  <Text style={styles.saveButtonText}>אישור</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

      <View style={styles.listContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>ספרים זמינים למסירה</Text>
        </View>

        {showOptions && <DistanceOptions />}

        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderBook}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const styles = StyleSheet.create({
  map: {
    flex: 0.64,
    width: Dimensions.get('window').width,
  },

  fab: {
  position: 'absolute',
  bottom: 10,
  left: 10,
  backgroundColor: '#FF5C5C',
  width: 40,
  height: 40,
  borderRadius: 22, 
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
  shadowColor: 'black',
  shadowOpacity: 0.3,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 2 },
},
fabText: {
  color: 'white',
  fontSize: 18, 
  lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15, 
    textAlign: 'center',
    color: '#FF5C5C',
  },
  saveButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },

  listContainer: {
    flex: 0.36,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C3B72',
  },
  optionsContainer: {
    marginBottom: 10,
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 10,
  },
  option: {
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'center',
    color: '#1C3B72',
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
    borderColor: '#1C3B728',
    borderWidth: 0.7,
    shadowColor: '#1C3B72',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: '700',
    fontSize: 17,
    color: '#FF5C5C',
    textAlign: 'left',
  },
  author: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF5C5C',
    marginTop: 4,
    textAlign: 'left',
  },
  place: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '700',
    color: '#FF5C5C',
    textAlign: 'left',
  },
  distance: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5C5C',
    textAlign: 'left',
  },
});
