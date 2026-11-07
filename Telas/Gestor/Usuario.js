import React, { useState } from "react";

import { View, Text, Pressable, ScrollView, TextInput } from "react-native";

import estilo from "../../css";

export default function TelaGestorUsuario({ navigation }) {
  // Controlar a exibição do formulário
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  // Dados do formulário
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Mensagens
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Lista inicial de usuários
  const [usuarios, setUsuarios] = useState([
    {
      id: "1",
      nome: "João Silva",
      matricula: "2025001",
      email: "joao.silva@christus.edu.br",
      status: "Ativo",
    },
    {
      id: "2",
      nome: "Maria Santos",
      matricula: "2025002",
      email: "maria.santos@christus.edu.br",
      status: "Ativo",
    },
    {
      id: "3",
      nome: "Pedro Lima",
      matricula: "2025003",
      email: "pedro.lima@christus.edu.br",
      status: "Ativo",
    },
  ]);

  // Cadastrar usuário
  const cadastrarUsuario = () => {
    const nomeLimpo = nome.trim();
    const matriculaLimpa = matricula.trim();
    const emailLimpo = email.trim().toLowerCase();

    setMensagem("");
    setSucesso("");

    // Verificar campos vazios
    if (
      !nomeLimpo ||
      !matriculaLimpa ||
      !emailLimpo ||
      !senha ||
      !confirmarSenha
    ) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    // Validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(emailLimpo)) {
      setMensagem("Digite um e-mail válido.");
      return;
    }

    // Verificar tamanho da senha
    if (senha.length < 6) {
      setMensagem("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    // Confirmar senha
    if (senha !== confirmarSenha) {
      setMensagem("As senhas não são iguais.");
      return;
    }

    // Verificar matrícula e e-mail duplicados
    const usuarioExiste = usuarios.some(
      (usuario) =>
        usuario.matricula === matriculaLimpa ||
        usuario.email.toLowerCase() === emailLimpo,
    );

    if (usuarioExiste) {
      setMensagem("Matrícula ou e-mail já cadastrado.");
      return;
    }

    // Criar novo usuário
    const novoUsuario = {
      id: String(Date.now()),
      nome: nomeLimpo,
      matricula: matriculaLimpa,
      email: emailLimpo,
      status: "Ativo",
    };

    // Adicionar usuário à lista
    setUsuarios((usuariosAtuais) => [...usuariosAtuais, novoUsuario]);

    // Limpar os campos
    setNome("");
    setMatricula("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");

    setMensagem("");
    setSucesso("Usuário cadastrado com sucesso!");

    // Fechar formulário
    setMostrarFormulario(false);
  };

  // Sair da conta
  const sair = () => {
    const navegadorPai = navigation.getParent();

    if (navegadorPai) {
      navegadorPai.navigate("Login");
    } else {
      navigation.navigate("Login");
    }
  };

  // Contar usuários ativos
  const contasAtivas = usuarios.filter(
    (usuario) => usuario.status === "Ativo",
  ).length;

  return (
    <View style={estilo.screen}>
      {/* CABEÇALHO */}
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

          <Pressable style={estilo.buttonOutline} onPress={sair}>
            <Text style={estilo.buttonOutlineText}>Sair</Text>
          </Pressable>
        </View>
      </View>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={estilo.content}>
        {/* TÍTULO E BOTÃO */}
        <View style={estilo.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={estilo.eyebrow}>Área da Gestão</Text>

            <Text style={estilo.pageTitle}>Cadastro de usuários</Text>

            <Text style={estilo.pageSubtitle}>
              Crie o acesso dos aprendizes e consulte as contas já cadastradas.
            </Text>
          </View>

          <Pressable
            style={estilo.buttonPrimary}
            onPress={() => {
              setMensagem("");
              setSucesso("");
              setMostrarFormulario(true);
            }}
          >
            <Text style={estilo.buttonPrimaryText}>Adicionar usuário</Text>
          </Pressable>
        </View>

        {/* MENSAGEM DE SUCESSO */}
        {sucesso !== "" && (
          <Text style={{ color: "#23804F", marginBottom: 16 }}>{sucesso}</Text>
        )}

        {/* DOIS PAINÉIS */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          {/* FORMULÁRIO */}
          {mostrarFormulario && (
            <View
              style={[
                estilo.cardElevated,
                {
                  flex: 1.1,
                  minWidth: 320,
                },
              ]}
            >
              <View style={estilo.rowBetween}>
                <Text style={estilo.sectionTitle}>Nova conta de aprendiz</Text>

                <Pressable
                  onPress={() => {
                    setMostrarFormulario(false);
                    setMensagem("");
                  }}
                >
                  <Text style={estilo.link}>Fechar</Text>
                </Pressable>
              </View>

              <Text style={estilo.textMuted}>
                A senha será usada pelo aprendiz no primeiro acesso.
              </Text>

              {/* NOME COMPLETO */}
              <Text style={estilo.label}>Nome completo</Text>

              <TextInput
                style={estilo.input}
                placeholder="Digite o nome do aprendiz"
                value={nome}
                onChangeText={setNome}
              />

              {/* MATRÍCULA E E-MAIL */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={estilo.label}>Matrícula</Text>

                  <TextInput
                    style={estilo.input}
                    placeholder="Ex.: 2025004"
                    keyboardType="numeric"
                    value={matricula}
                    onChangeText={setMatricula}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={estilo.label}>E-mail</Text>

                  <TextInput
                    style={estilo.input}
                    placeholder="nome@christus.edu.br"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* SENHA E CONFIRMAÇÃO */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={estilo.label}>Senha provisória</Text>

                  <TextInput
                    style={estilo.input}
                    placeholder="Mínimo de 6 caracteres"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={estilo.label}>Confirmar senha</Text>

                  <TextInput
                    style={estilo.input}
                    placeholder="Digite novamente"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                  />
                </View>
              </View>

              {/* MENSAGEM DE ERRO */}
              {mensagem !== "" && (
                <Text
                  style={{
                    color: "#B03030",
                    marginBottom: 12,
                  }}
                >
                  {mensagem}
                </Text>
              )}

              {/* BOTÃO CADASTRAR */}
              <Pressable
                style={estilo.buttonPrimary}
                onPress={cadastrarUsuario}
              >
                <Text style={estilo.buttonPrimaryText}>
                  Criar conta do aprendiz
                </Text>
              </Pressable>
            </View>
          )}

          {/* LISTA DE USUÁRIOS */}
          <View
            style={[
              estilo.card,
              {
                flex: mostrarFormulario ? 0.95 : 1,
                minWidth: 320,
                padding: 0,
              },
            ]}
          >
            {/* CABEÇALHO DA LISTA */}
            <View
              style={[
                estilo.cardHeader,
                {
                  padding: 16,
                  marginBottom: 0,
                },
              ]}
            >
              <View>
                <Text style={estilo.sectionTitle}>Usuários cadastrados</Text>

                <Text style={estilo.sectionSubtitle}>
                  {contasAtivas} contas ativas
                </Text>
              </View>
            </View>

            {/* EXIBIR USUÁRIOS */}
            {usuarios.length === 0 ? (
              <Text style={[estilo.textMuted, { padding: 16 }]}>
                Nenhum usuário cadastrado.
              </Text>
            ) : (
              usuarios.map((usuario, index) => (
                <View
                  key={usuario.id}
                  style={[
                    estilo.listItem,
                    { paddingHorizontal: 16 },
                    index === usuarios.length - 1 && estilo.listItemLast,
                  ]}
                >
                  <View
                    style={[estilo.rowBetween, { alignItems: "flex-start" }]}
                  >
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
                        {usuario.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
