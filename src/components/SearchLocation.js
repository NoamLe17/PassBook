import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SearchLocation = ({ onLocationSelected, userLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);

  // פונקציה לחישוב מרחק בין שתי נקודות (הברסיין פורמולה)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // רדיוס כדור הארץ בקילומטרים
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // פונקציה לעיצוב המרחק
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} מ'`;
    } else if (distance < 10) {
      return `${distance.toFixed(1)} ק"מ`;
    } else {
      return `${Math.round(distance)} ק"מ`;
    }
  };

  // חיפוש מיקומים באמצעות Nominatim API
  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=8&` +
        `countrycodes=il&` +
        `accept-language=he,en`
      );
      
      const data = await response.json();
      
      const processedSuggestions = data.map(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        
        // חישוב מרחק מהמיקום הנוכחי של המשתמש
        let distance = null;
        if (userLocation) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            lat,
            lon
          );
        }

        // יצירת שם המיקום
        let displayName = item.display_name;
        if (item.address) {
          const parts = [];
          if (item.address.house_number && item.address.road) {
            parts.push(`${item.address.road} ${item.address.house_number}`);
          } else if (item.address.road) {
            parts.push(item.address.road);
          }
          if (item.address.city || item.address.town || item.address.village) {
            parts.push(item.address.city || item.address.town || item.address.village);
          }
          if (parts.length > 0) {
            displayName = parts.join(', ');
          }
        }

        return {
          id: item.place_id,
          name: displayName,
          latitude: lat,
          longitude: lon,
          distance: distance,
          type: item.type,
          importance: item.importance
        };
      });

      // מיון לפי מרחק (אם יש מיקום משתמש) או לפי חשיבות
      processedSuggestions.sort((a, b) => {
        if (userLocation && a.distance !== null && b.distance !== null) {
          return a.distance - b.distance;
        }
        return (b.importance || 0) - (a.importance || 0);
      });

      setSuggestions(processedSuggestions);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // טיפול בשינוי טקסט החיפוש
  const handleSearchChange = (text) => {
    setQuery(text);
    setIsVisible(text.length > 0);

    // ביטול חיפוש קודם
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // חיפוש חדש עם עיכוב
    searchTimeout.current = setTimeout(() => {
      searchLocations(text);
    }, 300);
  };

  // טיפול בבחירת מיקום
  const handleLocationSelect = (location) => {
    setQuery(location.name);
    setIsVisible(false);
    setSuggestions([]);
    
    if (onLocationSelected) {
      onLocationSelected(
        { 
          latitude: location.latitude, 
          longitude: location.longitude 
        },
        location.name
      );
    }
  };

  // רנדור פריט חיפוש
  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleLocationSelect(item)}
    >
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.distance !== null && (
          <Text style={styles.suggestionDistance}>
            {formatDistance(item.distance)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="חפש מיקום..."
        value={query}
        onChangeText={handleSearchChange}
        onFocus={() => setIsVisible(query.length > 0)}
        textAlign="right"
        placeholderTextColor="#999"
      />
      
      {isVisible && (
        <View style={styles.suggestionsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>מחפש...</Text>
            </View>
          ) : suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.suggestionsList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : query.length > 1 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>לא נמצאו תוצאות</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    marginTop: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  suggestionDistance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default SearchLocation;