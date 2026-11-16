import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import estilo from "../css";
import { useAuth, mensagemDeErro } from "../AuthContext";

export default function TelaLogin({ navigation }) {
  const [tipo, setTipo] = useState("Aprendiz");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // Controlar a visualização da senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [aviso, setAviso] = useState("");

  const { entrar, recuperarSenha } = useAuth();

  const entrarNoPortal = async () => {
    setErro("");
    setAviso("");

    try {
      await entrar(email, senha, tipo);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };

  const esqueciSenha = async () => {
    setErro("");
    setAviso("");

    if (email.trim() === "") {
      setErro("Digite seu e-mail para recuperar a senha.");
      return;
    }

    try {
      await recuperarSenha(email);
      setAviso("Se este e-mail estiver cadastrado, você receberá um link para criar uma nova senha.");
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilo.loginScreen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
      <View style={estilo.cardElevated}>
        {/* TÍTULO */}
        <View>
          <Text style={estilo.pageTitle}>Acesse sua conta</Text>

          <Text style={estilo.pageSubtitle}>
            Entre com os dados fornecidos pela sua organização.
          </Text>
        </View>

        {/* SELEÇÃO DO PERFIL */}
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

        {/* E-MAIL */}
        <View>
          <Text style={estilo.sectionTitle}>E-mail:</Text>

          <TextInput
            style={estilo.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#8FA89A"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* SENHA */}
          <Text style={estilo.sectionTitle}>Senha:</Text>

          <View style={estilo.passwordWrapper}>
            <TextInput
              style={estilo.passwordInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#8FA89A"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />

            <Pressable
              style={estilo.passwordToggle}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Text style={estilo.passwordToggleText}>
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* MENSAGEM DE ERRO */}
        {erro !== "" && (
          <Text style={{ color: "red", marginBottom: 12 }}>{erro}</Text>
        )}

        {aviso !== "" && (
          <Text style={{ color: "green", marginBottom: 12 }}>{aviso}</Text>
        )}

        {/* BOTÃO ENTRAR */}
        <View>
          <Pressable style={estilo.buttonPrimary} onPress={entrarNoPortal}>
            <Text style={estilo.buttonPrimaryText}>Entrar</Text>
          </Pressable>

          <Pressable style={{ marginTop: 12, alignItems: "center" }} onPress={esqueciSenha}>
            <Text style={estilo.passwordToggleText}>Esqueci minha senha</Text>
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
