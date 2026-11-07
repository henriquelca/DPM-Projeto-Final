import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import estilo from "../../css";
export default function TelaGestorUsuario({ route, navigation }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const cadastrarUsuario = () => {
    if (
      !nome.trim() ||
      !matricula.trim() ||
      !email.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      setMensagem("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não são iguais.");
      return;
    }

    setUsuarios([
      ...usuarios,
      {
        nome,
        matricula,
        email,
      },
    ]);

    setNome("");
    setMatricula("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setMensagem("");
    setMostrarFormulario(false);
  };
  return (
    <View style={estilo.screen}>
      <View style={estilo.header}>
        <View>
          <Text style={estilo.headerBrand}>Escola Christus</Text>
          <Text style={estilo.headerTitle}>Portal de Frequência</Text>
        </View>
        <View style={estilo.row}>
          <View style={estilo.headerUser}>
            <Text style={estilo.headerUserName}>Mariana Souza</Text>
            <Text style={estilo.headerUserRole}>Gestor(a)</Text>
          </View>
          <View>
            <TouchableOpacity
              style={estilo.buttonOutline}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={estilo.buttonOutlineText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={estilo.content}>
        <View style={estilo.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={estilo.eyebrow}>Área da Gestão</Text>
            <Text style={estilo.pageTitle}>Cadastro de Usuários</Text>
            <Text style={estilo.pageSubtitle}>
              Crie o acesso dos aprendizes e consulte as contas já cadastradas.
            </Text>
          </View>
          <TouchableOpacity
            style={estilo.buttonPrimary}
            onPress={() => navigation.navigate("AdicionarUsuario")}
          >
            <Text style={estilo.buttonPrimaryText}>Adicionar Usuário</Text>
          </TouchableOpacity>
        </View>
        <View style={[estilo.card, { padding: 0 }]}>
          <View style={[estilo.cardHeader, { padding: 16, marginBottom: 0 }]}>
            <View>
              <Text style={estilo.sectionTitle}>Usuários cadastrados</Text>
              <Text style={estilo.sectionSubtitle}>
                {usuarios.length} contas ativas
              </Text>
            </View>
          </View>
          {usuarios.map((usuario, index) => (
            <View
              key={usuario.matricula}
              style={[
                estilo.listItem,
                { paddingHorizontal: 16 },
                index === usuarios.length - 1 && estilo.listItemLast,
              ]}
            >
              <View style={[estilo.rowBetween, { alignItems: "flex-start" }]}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[estilo.text, { fontWeight: "800" }]}>
                    {usuario.nome}
                  </Text>

                  <Text style={[estilo.textMuted, { marginTop: 4 }]}>
                    Matrícula {usuario.matricula}
                  </Text>

                  <Text style={estilo.textMuted}>{usuario.email}</Text>
                </View>
                <View style={[estilo.badge, estilo.badgeSuccess]}>
                  <Text style={[estilo.badgeText, estilo.badgeSuccessText]}>
                    Ativo
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
