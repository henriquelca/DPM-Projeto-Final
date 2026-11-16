import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importa as telas da mesma pasta (Telas/Aprendiz/)
import TelaAprendizInicio from './Inicio';
import TelaAprendizRegistroPonto from './RegistroPonto';
import TelaAprendizJustificativas from './Justificativas';
import TelaAprendizPerfil from './Perfil';

const Tab = createBottomTabNavigator();

export default function AprendizTabs() {
  // Espaço da barra de gestos/botões do celular
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DCEBE2',
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#23804F',
        tabBarInactiveTintColor: '#5B7A6A',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Registro de Ponto') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Justificativas') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={TelaAprendizInicio} />
      <Tab.Screen name="Registro de Ponto" component={TelaAprendizRegistroPonto} />
      <Tab.Screen name="Justificativas" component={TelaAprendizJustificativas} />
      <Tab.Screen name="Perfil" component={TelaAprendizPerfil} />
    </Tab.Navigator>
  );
}