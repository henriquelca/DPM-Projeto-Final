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
import { useAuth, mensagemDeErro } from "../AuthContext";
export default function TelaLogin({ navigation }) {
  const [tipo, setTipo] = useState("Aprendiz");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { entrar } = useAuth();
  const entrarNoPortal = async () => {
    setErro("");
    try {
      await entrar(email, senha, tipo);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };
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
          <Text style={estilo.sectionTitle}>E-mail:</Text>
          <TextInput
            style={estilo.card}
            placeholder="Digite seu e-mail"
            placeholderTextColor="green"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          ></TextInput>
          <Text style={estilo.sectionTitle}>Senha:</Text>
          <TextInput
            style={estilo.card}
            placeholder="Digite sua senha"
            placeholderTextColor="green"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          ></TextInput>
        </View>
        <Text style={{ color: "red" }}>{erro}</Text>
        <View>
          <Pressable style={estilo.buttonPrimary} onPress={entrarNoPortal}>
            <Text style={estilo.buttonPrimaryText}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
