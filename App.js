import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// Importação das telas
import TelaLogin from "./Telas/Login";
import TelaAprendizInicio from "./Telas/Aprendiz/Inicio";
import TelaAprendizRegistroPonto from "./Telas/Aprendiz/RegistroPonto";
import TelaAprendizJustificativas from "./Telas/Aprendiz/Justificativas";
import TelaGestorDeshboard from "./Telas/Gestor/Deshboard";
import TelaGestorRegistrarPonto from "./Telas/Gestor/RegistrarPonto";
import TelaGestorJustificativas from "./Telas/Gestor/Justificativas";
import TelaGestorUsuario from "./Telas/Gestor/Usuario";
import TelaGestorRelatorio from "./Telas/Gestor/Relatorio";
// Criação do Stack Navigator
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="AprendizInicio" component={TelaAprendizInicio} />
        <Stack.Screen
          name="AprendizRegistroPonto"
          component={TelaAprendizRegistroPonto}
        />
        <Stack.Screen
          name="AprendizJustificativas"
          component={TelaAprendizJustificativas}
        />
        <Stack.Screen name="GestorDeshboard" component={TelaGestorDeshboard} />
        <Stack.Screen
          name="GestorRegistrarPonto"
          component={TelaGestorRegistrarPonto}
        />
        <Stack.Screen
          name="GestorJustificativas"
          component={TelaGestorJustificativas}
        />
        <Stack.Screen name="GestorUsuario" component={TelaGestorUsuario} />
        <Stack.Screen name="GestorRelatorio" component={TelaGestorRelatorio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
