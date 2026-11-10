import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importações
import { AuthProvider, useAuth } from "./AuthContext";
import TelaLogin from "./Telas/Login";
import AprendizTabs from "./Telas/Aprendiz/AprendizTabs";
import NavegacaoGestor from "./Telas/Gestor/NavegacaoGestor";

const Stack = createStackNavigator();

function Rotas() {
  const { perfil, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#23804F" />
      </View>
    );
  }

  if (perfil === null) {
    return (
      <Stack.Navigator key="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={TelaLogin} />
      </Stack.Navigator>
    );
  }

  if (perfil.tipo === "gestor") {
    return (
      <Stack.Navigator key="gestor" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Gestor" component={NavegacaoGestor} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator key="aprendiz" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AprendizTabs" component={AprendizTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Rotas />
      </NavigationContainer>
    </AuthProvider>
  );
}
