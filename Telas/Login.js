import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import estilo from "../css";
export default function TelaLogin({ navigation }) {
  const [tipo, setTipo] = useState("Aprendiz");
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
        </View>
        <View style={estilo.segmented}>
          <Pressable
            style={[
              estilo.segment,
              tipo === "Aprendiz" && estilo.segmentActive,
            ]}
            onPress={() => setTipo("Aprendiz")}
          >
            <Text
              style={[
                estilo.segmentText,
                tipo === "Aprendiz" && estilo.segmentTextActive,
              ]}
            >
              Aprendiz
            </Text>
          </Pressable>
          <Pressable
            style={[estilo.segment, tipo === "Gestor" && estilo.segmentActive]}
            onPress={() => setTipo("Gestor")}
          >
            <Text
              style={[
                estilo.segmentText,
                tipo === "Gestor" && estilo.segmentTextActive,
              ]}
            >
              Gestor
            </Text>
          </Pressable>
        </View>
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
        <View>
          <Pressable
            style={estilo.buttonPrimary}
            onPress={() => navigation.navigate("AprendizInicio")}
          >
            <Text style={estilo.buttonPrimaryText}>Entrar no portal</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
