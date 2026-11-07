import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importações
import TelaLogin from "./Telas/Login";
import AprendizTabs from "./Telas/Aprendiz/AprendizTabs";
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
        initialRouteName="GestorJustificativas"
        screenOptions={{ headerShown: false }}
      >

        {/* Agrupa todas as abas inferiores do aprendiz numa única rota */}
        <Stack.Screen name="AprendizTabs" component={AprendizTabs} />

        {/* Telas do Gestor */}
        <Stack.Screen name="TelaGestorDeshboard" component={NavegacaoGestor} />
        <Stack.Screen
          name="TelaGestorRegistrarPonto"
          component={NavegacaoGestor}
        />
        <Stack.Screen
          name="TelaGestorJustificativas"
          component={NavegacaoGestor}
        />
        <Stack.Screen name="TelaGestorUsuario" component={NavegacaoGestor} />
        <Stack.Screen name="TelaGestorRelatorio" component={NavegacaoGestor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
