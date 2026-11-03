import React from "react";
import { View, Text } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@react-native-vector-icons/ionicons";

// Importe sua tela de usuários
import TelaGestorUsuario from "./Usuario";

const Tab = createBottomTabNavigator();

// Telas provisórias para as outras opções
function TelaProvisoria({ route }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{route.name}</Text>
    </View>
  );
}

export default function NavegacaoGestor() {
  return (
    <Tab.Navigator
      initialRouteName="Usuarios"
      screenOptions={({ route }) => {
        const icones = {
          Dashboard: "home-outline",
          RegistrosPonto: "time-outline",
          Justificativas: "document-text-outline",
          Usuarios: "people-outline",
          RelatoriosIA: "bar-chart-outline",
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
      <Tab.Screen name="Dashboard" component={TelaProvisoria} />

      <Tab.Screen
        name="RegistrosPonto"
        component={TelaProvisoria}
        options={{ tabBarLabel: "Ponto" }}
      />

      <Tab.Screen name="Justificativas" component={TelaProvisoria} />

      <Tab.Screen
        name="Usuarios"
        component={TelaGestorUsuario}
        options={{ tabBarLabel: "Usuários" }}
      />

      <Tab.Screen
        name="RelatoriosIA"
        component={TelaProvisoria}
        options={{ tabBarLabel: "Relatórios IA" }}
      />
    </Tab.Navigator>
  );
}
