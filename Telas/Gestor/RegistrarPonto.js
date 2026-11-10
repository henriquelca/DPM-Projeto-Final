import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import estilo, { badgeStyle } from "../../css";

export default function TelaGestorRegistrarPonto() {
  const [usuarios, setUsuarios] = useState({});
  const [pontosBrutos, setPontosBrutos] = useState([]);
  const [registrosTabela, setRegistrosTabela] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados para o Modal de Correção
  const [modalVisivel, setModalVisivel] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [novaEntrada, setNovaEntrada] = useState("");
  const [novaSaida, setNovaSaida] = useState("");

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const colAprendiz = isMobile ? { width: 120 } : { flex: 2 };
  const colData = isMobile ? { width: 100 } : { flex: 1.5 };
  const colHora = isMobile ? { width: 80 } : { flex: 1 };
  const colStatus = isMobile ? { width: 100 } : { flex: 1.2 };
  const colAcoes = isMobile
    ? { width: 140 }
    : { flex: 1.5, justifyContent: "flex-start" };

  useEffect(() => {
    const unsubUsuarios = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const mapaUsuarios = {};
      snapshot.forEach((doc) => {
        mapaUsuarios[doc.id] = { id: doc.id, ...doc.data() };
      });
      setUsuarios(mapaUsuarios);
    });

    const unsubPontos = onSnapshot(collection(db, "pontos"), (snapshot) => {
      const listaPontos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPontosBrutos(listaPontos);
    });

    return () => {
      unsubUsuarios();
      unsubPontos();
    };
  }, []);

  useEffect(() => {
    if (Object.keys(usuarios).length === 0) return;

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mesNumerico = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    const dataFiltroHoje = `${dia}/${mesNumerico}/${ano}`;

    const mesesAbrev = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];
    const dataExibicao = `Hoje, ${dia} ${mesesAbrev[hoje.getMonth()]}`;

    const listaFinal = [];

    Object.values(usuarios).forEach((user) => {
      const statusUsuario = user.status ? user.status.toLowerCase() : "";
      if (user.tipo !== "aprendiz" || statusUsuario === "inativo") return;

      let entrada = "—";
      let saida = "—";
      let situacao = "Ausente";
      let docIdEntrada = null;
      let docIdSaida = null;

      pontosBrutos.forEach((ponto) => {
        if (ponto.usuarioId === user.id && ponto.dataHora) {
          let pData =
            typeof ponto.dataHora.toDate === "function"
              ? ponto.dataHora.toDate()
              : new Date(ponto.dataHora);
          const pDia = String(pData.getDate()).padStart(2, "0");
          const pMes = String(pData.getMonth() + 1).padStart(2, "0");
          const pAno = pData.getFullYear();
          const pDataStr = `${pDia}/${pMes}/${pAno}`;

          if (pDataStr === dataFiltroHoje) {
            const horaFormatada = pData.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            if (ponto.tipo === "entrada") {
              entrada = horaFormatada;
              docIdEntrada = ponto.id;
              situacao = "Presente";
            } else if (ponto.tipo === "saida") {
              saida = horaFormatada;
              docIdSaida = ponto.id;
            }
          }
        }
      });

      listaFinal.push({
        chave: user.id,
        nome: user.nome || "Sem Nome",
        dataExibicao: dataExibicao,
        entrada,
        saida,
        situacao,
        docIdEntrada,
        docIdSaida,
      });
    });

    listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));
    setRegistrosTabela(listaFinal);
    setCarregando(false);
  }, [usuarios, pontosBrutos]);

  // FUNÇÃO DE EXCLUIR (Com suporte a Mobile e Web)
  const excluirRegistro = (item) => {
    if (!item.docIdEntrada && !item.docIdSaida) {
      if (Platform.OS === "web")
        window.alert("Este aprendiz não possui registos hoje.");
      else Alert.alert("Aviso", "Este aprendiz não possui registos hoje.");
      return;
    }

    const confirmarExclusao = async () => {
      try {
        if (item.docIdEntrada)
          await deleteDoc(doc(db, "pontos", item.docIdEntrada));
        if (item.docIdSaida)
          await deleteDoc(doc(db, "pontos", item.docIdSaida));
      } catch (err) {
        console.error("Erro ao excluir:", err);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Excluir os registros de ${item.nome}?`))
        confirmarExclusao();
    } else {
      Alert.alert(
        "Confirmar Exclusão",
        `Deseja excluir os registros de ${item.nome}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: confirmarExclusao },
        ],
      );
    }
  };

  // FUNÇÕES DE CORRIGIR
  const abrirModalCorrigir = (item) => {
    setRegistroEditando(item);
    setNovaEntrada(item.entrada !== "—" ? item.entrada : "");
    setNovaSaida(item.saida !== "—" ? item.saida : "");
    setModalVisivel(true);
  };

  const salvarCorrecao = async () => {
    if (!registroEditando) return;
    const baseDate = new Date(); // Assume a data de hoje

    try {
      // Tratar correção da Entrada
      if (novaEntrada && novaEntrada.includes(":")) {
        const [h, m] = novaEntrada.split(":");
        const dataEnt = new Date(baseDate);
        dataEnt.setHours(parseInt(h), parseInt(m), 0);

        if (registroEditando.docIdEntrada) {
          // Atualiza se já existir
          await updateDoc(doc(db, "pontos", registroEditando.docIdEntrada), {
            dataHora: dataEnt,
          });
        } else {
          // Cria novo se ele tinha esquecido de bater a entrada
          await addDoc(collection(db, "pontos"), {
            usuarioId: registroEditando.chave,
            tipo: "entrada",
            dataHora: dataEnt,
          });
        }
      }

      // Tratar correção da Saída
      if (novaSaida && novaSaida.includes(":")) {
        const [h, m] = novaSaida.split(":");
        const dataSai = new Date(baseDate);
        dataSai.setHours(parseInt(h), parseInt(m), 0);

        if (registroEditando.docIdSaida) {
          await updateDoc(doc(db, "pontos", registroEditando.docIdSaida), {
            dataHora: dataSai,
          });
        } else {
          await addDoc(collection(db, "pontos"), {
            usuarioId: registroEditando.chave,
            tipo: "saida",
            dataHora: dataSai,
          });
        }
      }

      setModalVisivel(false);
      if (Platform.OS !== "web") Alert.alert("Sucesso", "Correção salva!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      if (Platform.OS !== "web")
        Alert.alert("Erro", "Falha ao salvar correção.");
      else window.alert("Falha ao salvar correção.");
    }
  };

  const conteudoTabela = (
    <View style={[estilo.table, isMobile && { minWidth: 700 }]}>
      <View style={estilo.tableHeader}>
        <Text style={[estilo.tableHeaderText, colAprendiz]}>Aprendiz</Text>
        <Text style={[estilo.tableHeaderText, colData]}>Data</Text>
        <Text style={[estilo.tableHeaderText, colHora]}>Entrada</Text>
        <Text style={[estilo.tableHeaderText, colHora]}>Saída</Text>
        <Text style={[estilo.tableHeaderText, colStatus]}>Situação</Text>
        <Text style={[estilo.tableHeaderText, colAcoes]}>Ações</Text>
      </View>

      {registrosTabela.length === 0 && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={estilo.textMuted}>
            Nenhum aprendiz ativo encontrado.
          </Text>
        </View>
      )}

      {registrosTabela.map((item) => {
        const [bgStyle, textStyle] = badgeStyle(item.situacao);

        return (
          <View key={item.chave} style={estilo.tableRow}>
            <Text
              style={[estilo.tableCell, estilo.tableCellBold, colAprendiz]}
              numberOfLines={1}
            >
              {item.nome}
            </Text>
            <Text style={[estilo.tableCell, colData]} numberOfLines={1}>
              {item.dataExibicao}
            </Text>
            <Text style={[estilo.tableCell, colHora]}>{item.entrada}</Text>
            <Text style={[estilo.tableCell, colHora]}>{item.saida}</Text>

            <View style={[estilo.tableCell, colStatus]}>
              <View style={[estilo.badge, bgStyle]}>
                <Text style={[estilo.badgeText, textStyle]}>
                  {item.situacao}
                </Text>
              </View>
            </View>

            <View style={[estilo.tableCell, estilo.buttonGroup, colAcoes]}>
              <TouchableOpacity
                style={[estilo.buttonOutline, estilo.buttonSmall]}
                onPress={() => abrirModalCorrigir(item)}
              >
                <Text style={estilo.buttonOutlineText}>Corrigir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  estilo.buttonDanger,
                  estilo.buttonSmall,
                  !item.docIdEntrada && !item.docIdSaida && { opacity: 0.5 },
                ]}
                onPress={() => excluirRegistro(item)}
              >
                <Text style={estilo.buttonDangerText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={estilo.screen}>
      <ScrollView contentContainerStyle={estilo.content}>
        <Text style={estilo.eyebrow}>ÁREA DA GESTÃO</Text>
        <Text style={estilo.pageTitle}>Registros de ponto</Text>
        <Text style={estilo.pageSubtitle}>
          Consulte, corrija ou exclua registros em caso de erro justificado.
        </Text>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#2E8B57"
            style={{ marginTop: 40 }}
          />
        ) : isMobile ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            style={{ marginTop: 10 }}
          >
            {conteudoTabela}
          </ScrollView>
        ) : (
          <View style={{ marginTop: 10, width: "100%" }}>{conteudoTabela}</View>
        )}
      </ScrollView>

      {/* MODAL DE CORREÇÃO DE PONTO */}
      <Modal visible={modalVisivel} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              padding: 24,
              borderRadius: 12,
              shadowColor: "#000",
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#163A2B",
                marginBottom: 15,
              }}
            >
              Corrigir Ponto: {registroEditando?.nome}
            </Text>

            <Text style={{ fontSize: 14, color: "#334155", marginBottom: 5 }}>
              Hora de Entrada (HH:MM)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#CBD5E1",
                padding: 12,
                borderRadius: 6,
                marginBottom: 15,
                fontSize: 16,
              }}
              value={novaEntrada}
              onChangeText={setNovaEntrada}
              placeholder="Ex: 08:00"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />

            <Text style={{ fontSize: 14, color: "#334155", marginBottom: 5 }}>
              Hora de Saída (HH:MM)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#CBD5E1",
                padding: 12,
                borderRadius: 6,
                marginBottom: 24,
                fontSize: 16,
              }}
              value={novaSaida}
              onChangeText={setNovaSaida}
              placeholder="Ex: 12:00"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisivel(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  backgroundColor: "#F1F5F9",
                }}
              >
                <Text style={{ color: "#475569", fontWeight: "bold" }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={salvarCorrecao}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  backgroundColor: "#2E8B57",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Salvar Alterações
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
