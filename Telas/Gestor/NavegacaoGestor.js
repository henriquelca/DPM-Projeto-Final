import React from "react";
import { View, Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@react-native-vector-icons/ionicons";

// Importe sua tela de usuários
import TelaGestorUsuario from "./Usuario";
import TelaGestorRegistrarPonto from "./RegistrarPonto";
import TelaGestorDeshboard from "./Deshboard";
import TelaGestorJustificativas from "./Justificativas";
import TelaGestorRelatorio from "./Relatorio";
import TelaGestorPerfil from "./Perfil";

const Tab = createBottomTabNavigator();

export default function NavegacaoGestor() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => {
        const icones = {
          Dashboard: "home-outline",
          RegistrosPonto: "time-outline",
          Justificativas: "document-text-outline",
          Usuarios: "people-outline",
          RelatoriosIA: "bar-chart-outline",
          Perfil: "person-circle-outline",
        };

        return {
          headerShown: false,

          tabBarActiveTintColor: "#23804F",
          tabBarInactiveTintColor: "#5B7A6A",

          tabBarLabelPosition: "below-icon",

          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#DCEBE2",
            height: 65,
            paddingTop: 6,
            paddingBottom: 6,
          },

          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icones[route.name]} size={size} color={color} />
          ),
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={TelaGestorDeshboard} />

      <Tab.Screen
        name="RegistrosPonto"
        component={TelaGestorRegistrarPonto}
        options={{ tabBarLabel: "Ponto" }}
      />

      <Tab.Screen name="Justificativas" component={TelaGestorJustificativas} />

      <Tab.Screen
        name="Usuarios"
        component={TelaGestorUsuario}
        options={{ tabBarLabel: "Usuários" }}
      />

      <Tab.Screen
        name="RelatoriosIA"
        component={TelaGestorRelatorio}
        options={{ tabBarLabel: "Relatórios IA" }}
      />

      <Tab.Screen name="Perfil" component={TelaGestorPerfil} />
    </Tab.Navigator>
  );
}
