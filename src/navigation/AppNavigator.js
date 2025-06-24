import React, { useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddBookScreen from '../screens/AddBookScreen';
import ChatScreen from '../screens/ChatScreen';
import Footer from '../components/Footer';
import { useAuth } from '../services/AuthContext';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('Home');

  const onTabPress = (tabName, navigation) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="SignIn" component={SignInScreen} />
          <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <AppStack.Screen name="Home">
          {(props) => (
            <View style={{ flex: 1 }}>
              <HomeScreen {...props} />
              <Footer
                activeTab={activeTab}
                onTabPress={(tabName) => onTabPress(tabName, props.navigation)}
              />
            </View>
          )}
        </AppStack.Screen>

        <AppStack.Screen name="Profile">
          {(props) => (
            <View style={{ flex: 1 }}>
              <ProfileScreen {...props} />
              <Footer
                activeTab={activeTab}
                onTabPress={(tabName) => onTabPress(tabName, props.navigation)}
              />
            </View>
          )}
        </AppStack.Screen>

        <AppStack.Screen name="AddBook">
          {(props) => (
            <View style={{ flex: 1 }}>
              <AddBookScreen {...props} />
              <Footer
                activeTab={activeTab}
                onTabPress={(tabName) => onTabPress(tabName, props.navigation)}
              />
            </View>
          )}
        </AppStack.Screen>     

        <AppStack.Screen name="Chat">
          {(props) => (
            <View style={{ flex: 1 }}>
              <ChatScreen {...props} />
              <Footer
                activeTab={activeTab}
                onTabPress={(tabName) => onTabPress(tabName, props.navigation)}
              />
            </View>
          )}
        </AppStack.Screen>  
      </AppStack.Navigator>
    </NavigationContainer>
  );
}