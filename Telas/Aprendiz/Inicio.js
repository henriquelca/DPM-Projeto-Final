import React from 'react';
import { View, Text } from 'react-native';
import estilo from '../../css';
export default function TelaAprendizInicio({ route }) {
  return (
    <View style={estilo.loginScreen}>
      <Text style={estilo.pageTitle}>Aprendiz - Inicio</Text>
      <Text style={estilo.pageSubtitle}>Tela em construção</Text>
      {route.params?.userEmail && (
        <Text style={estilo.text}>Logado como: {route.params.userEmail}</Text>
      )}
    </View>
  );
}
