import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Footer({ activeTab, onTabPress }) {
  const tabs = [
    { key: 'Profile', label: 'פרופיל', icon: 'user' },
    { key: 'Home', label: 'בית', icon: 'home' },
    { key: 'AddBook', label: 'הוסף ספר', icon: 'plus-square' },
    
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          style={[
            styles.tabButton,
            activeTab === tab.key && styles.activeTab,
          ]}
        >
          <Icon
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? '#1C3B72' : '#fff'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FF5C5C', // צבע אדום של הפוטר
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  activeTab:{
    borderBottomWidth:2,
    borderBottomColor: '#1C3B72',
  },
  tabText: {
    fontSize: 14,
    color: '#fff', // ברירת מחדל לבן
  },
  activeText: {
    color: '#1C3B72', // כחול לאקטיבי
    fontWeight: 'bold',
  },
});
