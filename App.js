import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importações
import TelaLogin from "./Telas/Login";
import AprendizTabs from "./AprendizTabs";
import TelaGestorDeshboard from "./Telas/Gestor/Deshboard";
import TelaGestorRegistrarPonto from "./Telas/Gestor/RegistrarPonto";
import TelaGestorJustificativas from "./Telas/Gestor/Justificativas";
import TelaGestorUsuario from "./Telas/Gestor/Usuario";
import TelaGestorRelatorio from "./Telas/Gestor/Relatorio";
import NavegacaoGestor from "./Telas/Gestor/NavegacaoGestor";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AprendizTabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={TelaLogin} />

        {/* Agrupa todas as abas inferiores do aprendiz numa única rota */}
        <Stack.Screen name="AprendizTabs" component={AprendizTabs} />

        {/* Telas do Gestor */}
        <Stack.Screen name="GestorDeshboard" component={NavegacaoGestor} />
        <Stack.Screen name="GestorRegistrarPonto" component={NavegacaoGestor} />
        <Stack.Screen name="GestorJustificativas" component={NavegacaoGestor} />
        <Stack.Screen name="GestorUsuario" component={NavegacaoGestor} />
        <Stack.Screen name="GestorRelatorio" component={NavegacaoGestor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
