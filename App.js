import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importação das telas
import TelaLogin from './Telas/1.Login';
import TelaAprendizInicio from './Telas/Aprendiz/2.Inicio';
import TelaAprendizRegistroPonto from './Telas/Aprendiz/4.RegistroPonto';
import TelaAprendizJustificativas from './Telas/Aprendiz/3.Justificativas';
import TelaGestorDeshboard from './Telas/Gestor/5.Deshboard';
import TelaGestorRegistrarPonto from './Telas/Gestor/6.RegistrarPonto';
import TelaGestorJustificativas from './Telas/Gestor/7.Justificativas';
import TelaGestorUsuario from './Telas/Gestor/8.Usuario';
import TelaGestorRelatorio from './Telas/Gestor/9.Relatorio';
// Criação do Stack Navigator
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={TelaLogin} />
        <Stack.Screen name="AprendizInicio" component={TelaAprendizInicio} />
        <Stack.Screen name="AprendizRegistroPonto" component={TelaAprendizRegistroPonto} />
        <Stack.Screen name="AprendizJustificativas" component={TelaAprendizJustificativas} />
        <Stack.Screen name="GestorDeshboard" component={TelaGestorDeshboard} />
        <Stack.Screen name="GestorRegistrarPonto" component={TelaGestorRegistrarPonto} />
        <Stack.Screen name="GestorJustificativas" component={TelaGestorJustificativas} />
        <Stack.Screen name="GestorUsuario" component={TelaGestorUsuario} />
        <Stack.Screen name="GestorRelatorio" component={TelaGestorRelatorio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}