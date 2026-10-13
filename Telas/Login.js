import React from 'react';
import { View, Text } from 'react-native';
import estilo from '../css';
export default function TelaLogin({ navigation }) {
  return (
    <View style={estilo.loginScreen}>
      <Text style={estilo.pageTitle}>Login</Text>
      <Text style={estilo.pageSubtitle}>Tela em construção</Text>
    </View>
  );
}
