import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { SeatProvider } from './context/SeatContext';
import S1_SplashLogin from './screens/S1_SplashLogin';
import S2_Home from './screens/S2_Home';
import S3_FloorMap from './screens/S3_FloorMap';
import S4_SeatDetails from './screens/S4_SeatDetails';
import S5_Navigation from './screens/S5_Navigation';
import S6_HoldConfirm from './screens/S6_HoldConfirm';
import S7_AlertsHistory from './screens/S7_AlertsHistory';
import S8_AlertSetup from './screens/S8_AlertSetup';
import S9_FilterSettings from './screens/S9_FilterSettings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#64748B',
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            'Floor Map': focused ? 'map' : 'map-outline',
            Alerts: focused ? 'notifications' : 'notifications-outline',
            Settings: focused ? 'options' : 'options-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={S2_Home} options={{ title: 'SeatSpot Hub' }} />
      <Tab.Screen name="Floor Map" component={S3_FloorMap} />
      <Tab.Screen name="Alerts" component={S7_AlertsHistory} options={{ title: 'My Hold & Alerts' }} />
      <Tab.Screen name="Settings" component={S9_FilterSettings} options={{ title: 'Filters & Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SeatProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashLogin">
          <Stack.Screen
            name="SplashLogin"
            component={S1_SplashLogin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SeatDetails"
            component={S4_SeatDetails}
            options={{ title: 'Seat Details' }}
          />
          <Stack.Screen
            name="Navigation"
            component={S5_Navigation}
            options={{ title: 'Indoor Wayfinding' }}
          />
          <Stack.Screen
            name="HoldConfirm"
            component={S6_HoldConfirm}
            options={{ title: 'Active Seat Hold' }}
          />
          <Stack.Screen
            name="AlertSetup"
            component={S8_AlertSetup}
            options={{ title: 'Set Free-Seat Alert' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SeatProvider>
  );
}