import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import estilo from "../../css";
import { useAuth } from "../../AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
} from "firebase/auth";
import { db, cadastroAuth } from "../../firebaseConfig";
import {
  HORARIO_PADRAO,
  NOMES_DIAS,
  erroNoHorario,
  horarioDoAprendiz,
  descricaoHorario,
} from "../../frequencia";

// MARCAR OU DESMARCAR UM DIA DE TRABALHO
function alternarDia(dias, dia) {
  if (dias.includes(dia)) {
    return dias.filter((item) => item !== dia);
  }
  return [...dias, dia].sort();
}

// BOTÕES DE DOM A SÁB PARA ESCOLHER OS DIAS DE TRABALHO
function SeletorDias({ dias, aoMudar }) {
  return (
    <View style={[estilo.segmented, { marginBottom: 16 }]}>
      {NOMES_DIAS.map((nomeDia, dia) => (
        <Pressable
          key={dia}
          style={[estilo.segment, dias.includes(dia) && estilo.segmentActive]}
          onPress={() => aoMudar(alternarDia(dias, dia))}
        >
          <Text
            style={[
              estilo.segmentText,
              dias.includes(dia) && estilo.segmentTextActive,
            ]}
          >
            {nomeDia}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function TelaGestorUsuario({ navigation }) {
  const { perfil, sair: sairSessao } = useAuth();

  // Controle do formulário
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [horaEntrada, setHoraEntrada] = useState(HORARIO_PADRAO.horaEntrada);
  const [horaSaida, setHoraSaida] = useState(HORARIO_PADRAO.horaSaida);
  const [diasSemana, setDiasSemana] = useState(HORARIO_PADRAO.diasSemana);
  const [tipoNovo, setTipoNovo] = useState("aprendiz");

  // Dados e estados da lista
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  // Mensagens
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Controle da confirmação em duas etapas
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [etapaExclusao, setEtapaExclusao] = useState(0);

  // Controle da edição de horário
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [editEntrada, setEditEntrada] = useState("");
  const [editSaida, setEditSaida] = useState("");
  const [editDias, setEditDias] = useState([]);
  const [erroEdicao, setErroEdicao] = useState("");
  const [salvandoHorario, setSalvandoHorario] = useState(false);

  // BUSCAR APRENDIZES NO FIRESTORE EM TEMPO REAL
  useEffect(() => {
    const consultaAprendizes = query(
      collection(db, "usuarios"),
      where("tipo", "==", "aprendiz"),
    );

    const cancelarInscricao = onSnapshot(
      consultaAprendizes,
      (resultado) => {
        const lista = resultado.docs
          .map((documento) => {
            const dados = documento.data();
            return {
              id: documento.id,
              nome: dados.nome || "Nome não informado",
              matricula: dados.matricula || "Não informada",
              email: dados.email || "E-mail não informado",
              status: dados.status || "Ativo",
              horaEntrada: dados.horaEntrada,
              horaSaida: dados.horaSaida,
              diasSemana: dados.diasSemana,
            };
          })
          // Contas inativas não aparecem na lista de ativos.
          .filter((usuario) => usuario.status !== "Inativo")
          .sort((a, b) => a.nome.localeCompare(b.nome));

        setUsuarios(lista);
        setErroLista("");
        setCarregando(false);
      },
      (erro) => {
        console.log("Erro ao buscar aprendizes no Firestore:", erro);
        setErroLista(
          "Não foi possível carregar os usuários. Verifique sua conexão e as permissões do Firestore.",
        );
        setCarregando(false);
      },
    );

    return cancelarInscricao;
  }, []);

  // CADASTRAR APRENDIZ NO FIREBASE AUTHENTICATION E NO FIRESTORE
  const cadastrarUsuario = async () => {
    const nomeLimpo = nome.trim();
    const matriculaLimpa = matricula.trim();
    const emailLimpo = email.trim().toLowerCase();

    setMensagem("");
    setSucesso("");

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

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(emailLimpo)) {
      setMensagem("Digite um e-mail válido.");
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

    // O horário de trabalho só existe para aprendiz.
    if (tipoNovo === "aprendiz") {
      const erroHorario = erroNoHorario(horaEntrada, horaSaida, diasSemana);
      if (erroHorario !== "") {
        setMensagem(erroHorario);
        return;
      }
    }

    let usuarioAuthCriado = null;

    try {
      setSalvando(true);

      // Evita matrículas repetidas no Firestore.
      const consultaMatricula = query(
        collection(db, "usuarios"),
        where("matricula", "==", matriculaLimpa),
      );
      const resultadoMatricula = await getDocs(consultaMatricula);

      if (!resultadoMatricula.empty) {
        throw new Error("Essa matrícula já está cadastrada.");
      }

      // Cria a conta em uma instância secundária para não desconectar o gestor.
      const credencial = await createUserWithEmailAndPassword(
        cadastroAuth,
        emailLimpo,
        senha,
      );
      usuarioAuthCriado = credencial.user;

      // O perfil é salvo usando o Firestore da sessão principal do gestor.
      const novoPerfil = {
        nome: nomeLimpo,
        matricula: matriculaLimpa,
        email: emailLimpo,
        tipo: tipoNovo,
        status: "Ativo",
        criadoEm: serverTimestamp(),
      };
      if (tipoNovo === "aprendiz") {
        novoPerfil.horaEntrada = horaEntrada;
        novoPerfil.horaSaida = horaSaida;
        novoPerfil.diasSemana = diasSemana;
      }
      await setDoc(doc(db, "usuarios", credencial.user.uid), novoPerfil);

      setNome("");
      setMatricula("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setHoraEntrada(HORARIO_PADRAO.horaEntrada);
      setHoraSaida(HORARIO_PADRAO.horaSaida);
      setDiasSemana(HORARIO_PADRAO.diasSemana);
      setMostrarFormulario(false);
      setSucesso(
        tipoNovo === "aprendiz"
          ? "Aprendiz cadastrado com sucesso."
          : "Gestor cadastrado com sucesso.",
      );
      setTipoNovo("aprendiz");
    } catch (erro) {
      console.log("Erro ao cadastrar aprendiz:", erro);

      // Se Auth criou a conta, mas o perfil falhou, tenta remover a conta órfã.
      if (usuarioAuthCriado) {
        await deleteUser(usuarioAuthCriado).catch((erroExclusao) => {
          console.log("Não foi possível reverter a conta Auth:", erroExclusao);
        });
      }

      const mensagens = {
        "auth/email-already-in-use": "Esse e-mail já está cadastrado.",
        "auth/invalid-email": "Digite um e-mail válido.",
        "auth/weak-password": "A senha é muito fraca.",
        "auth/operation-not-allowed":
          "Ative o login por e-mail e senha no Firebase Authentication.",
        "permission-denied":
          "O Firestore negou a gravação. Verifique as regras de segurança.",
      };

      setMensagem(
        mensagens[erro.code] ||
          erro.message ||
          "Não foi possível cadastrar o usuário.",
      );
    } finally {
      // Encerra somente a sessão secundária; a sessão do gestor permanece ativa.
      await signOut(cadastroAuth).catch(() => {});
      setSalvando(false);
    }
  };

  // ABRIR A EDIÇÃO DE HORÁRIO
  const abrirEdicaoHorario = (usuario) => {
    const horario = horarioDoAprendiz(usuario);
    setSucesso("");
    setErroEdicao("");
    setEditEntrada(horario.horaEntrada);
    setEditSaida(horario.horaSaida);
    setEditDias(horario.diasSemana);
    setUsuarioEditando(usuario);
  };

  const fecharEdicaoHorario = () => {
    if (salvandoHorario) return;
    setUsuarioEditando(null);
  };

  // SALVAR O NOVO HORÁRIO NO FIRESTORE
  const salvarHorario = async () => {
    const erroHorario = erroNoHorario(editEntrada, editSaida, editDias);
    if (erroHorario !== "") {
      setErroEdicao(erroHorario);
      return;
    }

    try {
      setSalvandoHorario(true);
      await updateDoc(doc(db, "usuarios", usuarioEditando.id), {
        horaEntrada: editEntrada,
        horaSaida: editSaida,
        diasSemana: editDias,
        atualizadoEm: serverTimestamp(),
      });
      setSucesso(`Horário de ${usuarioEditando.nome} atualizado.`);
      setUsuarioEditando(null);
    } catch (erro) {
      console.log("Erro ao salvar horário:", erro);
      setErroEdicao("Não foi possível salvar o horário.");
    } finally {
      setSalvandoHorario(false);
    }
  };

  // ABRIR A PRIMEIRA CONFIRMAÇÃO
  const confirmarExclusao = (usuario) => {
    setSucesso("");
    setUsuarioSelecionado(usuario);
    setEtapaExclusao(1);
  };

  const cancelarExclusao = () => {
    if (excluindo) return;
    setEtapaExclusao(0);
    setUsuarioSelecionado(null);
  };

  const continuarExclusao = () => setEtapaExclusao(2);

  // DESATIVAR O PERFIL NO FIRESTORE
  // O AuthContext já impede o login quando status === "Inativo".
  const excluirUsuario = async () => {
    if (!usuarioSelecionado || excluindo) return;

    try {
      setExcluindo(true);
      await updateDoc(doc(db, "usuarios", usuarioSelecionado.id), {
        status: "Inativo",
        atualizadoEm: serverTimestamp(),
      });

      setSucesso(
        `${usuarioSelecionado.nome} foi desativado. A conta não poderá mais entrar no portal.`,
      );
      setEtapaExclusao(0);
      setUsuarioSelecionado(null);
      // O onSnapshot atualiza a lista automaticamente.
    } catch (erro) {
      console.log("Erro ao desativar usuário:", erro);
      setMensagem(
        "Não foi possível excluir/desativar. Verifique as regras do Firestore.",
      );
      setEtapaExclusao(0);
      setUsuarioSelecionado(null);
    } finally {
      setExcluindo(false);
    }
  };

  const sair = () => {
    // Usa a função do AuthContext para limpar o perfil e encerrar a sessão principal.
    sairSessao();
  };

  const contasAtivas = usuarios.filter(
    (usuario) => usuario.status === "Ativo",
  ).length;

  return (
    <SafeAreaView style={estilo.screen} edges={["top"]}>
      {/* CABEÇALHO */}
      <View style={estilo.header}>
        <View>
          <Text style={estilo.headerBrand}>Escola Christus</Text>
          <Text style={estilo.headerTitle}>Portal de Frequência</Text>
        </View>

        <View style={estilo.row}>
          <View style={estilo.headerUser}>
            <Text style={estilo.headerUserName}>{perfil?.nome}</Text>
            <Text style={estilo.headerUserRole}>Gestor(a)</Text>
          </View>
        </View>
      </View>

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

        {sucesso !== "" && (
          <Text style={{ color: "#23804F", marginBottom: 16 }}>{sucesso}</Text>
        )}
        {mensagem !== "" && !mostrarFormulario && (
          <Text style={{ color: "#B03030", marginBottom: 16 }}>{mensagem}</Text>
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
            <View style={[estilo.cardElevated, { flex: 1.1, minWidth: 320 }]}>
              <View style={estilo.rowBetween}>
                <Text style={estilo.sectionTitle}>Nova conta</Text>
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
                A senha será usada pelo usuário no primeiro acesso.
              </Text>

              <Text style={estilo.label}>Perfil</Text>
              <View style={estilo.segmented}>
                <Pressable
                  style={[
                    estilo.segment,
                    tipoNovo === "aprendiz" && estilo.segmentActive,
                  ]}
                  onPress={() => setTipoNovo("aprendiz")}
                >
                  <Text
                    style={[
                      estilo.segmentText,
                      tipoNovo === "aprendiz" && estilo.segmentTextActive,
                    ]}
                  >
                    Aprendiz
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    estilo.segment,
                    tipoNovo === "gestor" && estilo.segmentActive,
                  ]}
                  onPress={() => setTipoNovo("gestor")}
                >
                  <Text
                    style={[
                      estilo.segmentText,
                      tipoNovo === "gestor" && estilo.segmentTextActive,
                    ]}
                  >
                    Gestor
                  </Text>
                </Pressable>
              </View>

              <Text style={estilo.label}>Nome completo</Text>
              <TextInput
                style={estilo.input}
                placeholder="Digite o nome do aprendiz"
                value={nome}
                onChangeText={setNome}
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
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

              <View style={{ flexDirection: "row", gap: 12 }}>
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

              {tipoNovo === "aprendiz" && (
                <View>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={estilo.label}>Horário de entrada</Text>
                      <TextInput
                        style={estilo.input}
                        placeholder="08:00"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        value={horaEntrada}
                        onChangeText={setHoraEntrada}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={estilo.label}>Horário de saída</Text>
                      <TextInput
                        style={estilo.input}
                        placeholder="12:00"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        value={horaSaida}
                        onChangeText={setHoraSaida}
                      />
                    </View>
                  </View>

                  <Text style={estilo.label}>Dias de trabalho</Text>
                  <SeletorDias dias={diasSemana} aoMudar={setDiasSemana} />
                </View>
              )}

              {mensagem !== "" && (
                <Text style={{ color: "#B03030", marginBottom: 12 }}>
                  {mensagem}
                </Text>
              )}

              <Pressable
                style={[estilo.buttonPrimary, salvando && { opacity: 0.6 }]}
                onPress={cadastrarUsuario}
                disabled={salvando}
              >
                <Text style={estilo.buttonPrimaryText}>
                  {salvando
                    ? "Cadastrando..."
                    : tipoNovo === "aprendiz"
                      ? "Criar conta do aprendiz"
                      : "Criar conta do gestor"}
                </Text>
              </Pressable>
            </View>
          )}

          {/* LISTA VINDO DO FIRESTORE */}
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
            <View style={[estilo.cardHeader, { padding: 16, marginBottom: 0 }]}>
              <View>
                <Text style={estilo.sectionTitle}>Usuários cadastrados</Text>
                <Text style={estilo.sectionSubtitle}>
                  {contasAtivas} contas ativas
                </Text>
              </View>
            </View>

            {carregando ? (
              <ActivityIndicator
                size="large"
                color="#23804F"
                style={{ padding: 25 }}
              />
            ) : erroLista !== "" ? (
              <Text style={[estilo.textMuted, { padding: 16 }]}>
                {erroLista}
              </Text>
            ) : usuarios.length === 0 ? (
              <Text style={[estilo.textMuted, { padding: 16 }]}>
                Nenhum aprendiz ativo encontrado no banco de dados.
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
                      <Text style={estilo.textMuted}>
                        {descricaoHorario(usuario)}
                      </Text>
                    </View>

                    <View style={{ alignItems: "flex-end", gap: 8 }}>
                      <View style={[estilo.badge, estilo.badgeSuccess]}>
                        <Text
                          style={[estilo.badgeText, estilo.badgeSuccessText]}
                        >
                          {usuario.status}
                        </Text>
                      </View>

                      <Pressable
                        style={[estilo.buttonOutline, estilo.buttonSmall]}
                        onPress={() => abrirEdicaoHorario(usuario)}
                      >
                        <Text style={estilo.buttonOutlineText}>
                          Editar horário
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[estilo.buttonDanger, estilo.buttonSmall]}
                        onPress={() => confirmarExclusao(usuario)}
                      >
                        <Text style={estilo.buttonDangerText}>Desativar</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE EDIÇÃO DE HORÁRIO */}
      <Modal
        transparent
        visible={usuarioEditando !== null}
        animationType="fade"
        onRequestClose={fecharEdicaoHorario}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#2E8B57",
              padding: 24,
            }}
          >
            <Text style={estilo.sectionTitle}>Editar horário</Text>
            <Text style={[estilo.textMuted, { marginBottom: 8 }]}>
              {usuarioEditando?.nome}
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={estilo.label}>Entrada</Text>
                <TextInput
                  style={estilo.input}
                  placeholder="08:00"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  value={editEntrada}
                  onChangeText={setEditEntrada}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={estilo.label}>Saída</Text>
                <TextInput
                  style={estilo.input}
                  placeholder="12:00"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  value={editSaida}
                  onChangeText={setEditSaida}
                />
              </View>
            </View>

            <Text style={estilo.label}>Dias de trabalho</Text>
            <SeletorDias dias={editDias} aoMudar={setEditDias} />

            {erroEdicao !== "" && (
              <Text style={{ color: "#B03030", marginBottom: 12 }}>
                {erroEdicao}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Pressable
                style={estilo.buttonOutline}
                onPress={fecharEdicaoHorario}
                disabled={salvandoHorario}
              >
                <Text style={estilo.buttonOutlineText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={estilo.buttonPrimary}
                onPress={salvarHorario}
                disabled={salvandoHorario}
              >
                <Text style={estilo.buttonPrimaryText}>
                  {salvandoHorario ? "Salvando..." : "Salvar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO EM DUAS ETAPAS */}
      <Modal
        transparent
        visible={etapaExclusao > 0}
        animationType="fade"
        onRequestClose={cancelarExclusao}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#2E8B57",
              padding: 24,
            }}
          >
            <Text style={estilo.sectionTitle}>
              {etapaExclusao === 1 ? "Desativar usuário?" : "Confirmação final"}
            </Text>

            <Text style={[estilo.text, { marginTop: 12, marginBottom: 20 }]}>
              {etapaExclusao === 1
                ? `Deseja desativar o usuário ${usuarioSelecionado?.nome}?`
                : `Tem certeza que deseja desativar ${usuarioSelecionado?.nome}? O acesso dessa conta ao portal será bloqueado.`}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Pressable
                style={estilo.buttonOutline}
                onPress={cancelarExclusao}
                disabled={excluindo}
              >
                <Text style={estilo.buttonOutlineText}>
                  {etapaExclusao === 1 ? "Cancelar" : "Não excluir"}
                </Text>
              </Pressable>

              <Pressable
                style={estilo.buttonDanger}
                onPress={
                  etapaExclusao === 1 ? continuarExclusao : excluirUsuario
                }
                disabled={excluindo}
              >
                <Text style={estilo.buttonDangerText}>
                  {excluindo
                    ? "Processando..."
                    : etapaExclusao === 1
                      ? "Continuar"
                      : "Sim, desativar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
