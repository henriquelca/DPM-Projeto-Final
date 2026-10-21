import React from "react";
import { View, Text, TouchableOpacity, TextInput, Button } from "react-native";
import estilo from "./css";
export default function TelaLogin({ navigation }) {
  return (
    <View style={estilo.loginScreen}>
      <View style={estilo.cardElevated}>
        <View>
          <Text style={estilo.pageTitle}>Acesse sua conta</Text>
          <Text style={estilo.pageSubtitle}>
            Entre com os dados fornecidos pela sua organização.
          </Text>
        </View>
        <View>
          <Text style={estilo.sectionTitle}>Entrar como:</Text>
          <TouchableOpacity></TouchableOpacity>
          <View>
            <Text style={estilo.sectionTitle}>Matrícula:</Text>
            <TextInput
              style={estilo.card}
              placeholder="Digite sua matrícula"
              placeholderTextColor="green"
            ></TextInput>
            <Text style={estilo.sectionTitle}>Senha:</Text>
            <TextInput
              style={estilo.card}
              placeholder="Digite sua senha"
              placeholderTextColor="green"
            ></TextInput>
          </View>
        </View>
        <View>
          <Button
            title="Entrar no portal"
            onPress={() => {
              enviarMensagem();
            }}
          />
        </View>
      </View>
    </View>
  );
}
