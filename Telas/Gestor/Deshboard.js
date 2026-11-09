import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import estilo, { colors } from "../../css";
import CabecalhoGestor from "./Cabecalho";
import { formatarHora, situacaoEntrada, corDaSituacao } from "./frequencia";

export default function TelaGestorDeshboard({ navigation }) {
  const [aprendizes, setAprendizes] = useState(null);
  const [pontosHoje, setPontosHoje] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const consultaAprendizes = query(collection(db, "usuarios"), where("tipo", "==", "aprendiz"));
    const pararAprendizes = onSnapshot(
      consultaAprendizes,
      (resultado) => {
        const lista = [];
        resultado.forEach((documento) => {
          const aprendiz = documento.data();
          aprendiz.id = documento.id;
          if (aprendiz.status !== "Inativo") {
            lista.push(aprendiz);
          }
        });
        setAprendizes(lista);
      },
      () => setErro("Não foi possível carregar os aprendizes."),
    );

    const meiaNoite = new Date();
    meiaNoite.setHours(0, 0, 0, 0);
    const consultaPontos = query(
      collection(db, "pontos"),
      where("dataHora", ">=", Timestamp.fromDate(meiaNoite)),
    );
    const pararPontos = onSnapshot(
      consultaPontos,
      (resultado) => {
        const lista = [];
        resultado.forEach((documento) => {
          lista.push(documento.data());
        });
        setPontosHoje(lista);
      },
      () => setErro("Não foi possível carregar os pontos de hoje."),
    );

    return () => {
      pararAprendizes();
      pararPontos();
    };
  }, []);

  const carregando = aprendizes === null || pontosHoje === null;

  const movimentacao = [];
  let presentes = 0;
  let atrasos = 0;
  let ausentes = 0;

  if (!carregando) {
    for (const aprendiz of aprendizes) {
      let entrada = null;
      for (const ponto of pontosHoje) {
        if (ponto.usuarioId === aprendiz.id && ponto.tipo === "entrada" && ponto.dataHora) {
          const hora = ponto.dataHora.toDate();
          if (entrada === null || hora < entrada) {
            entrada = hora;
          }
        }
      }

      const situacao = situacaoEntrada(entrada);
      if (situacao === "Presente") presentes++;
      if (situacao === "Atraso") atrasos++;
      if (situacao === "Ausente") ausentes++;

      movimentacao.push({ id: aprendiz.id, nome: aprendiz.nome, entrada: entrada, situacao: situacao });
    }
  }

  const total = movimentacao.length;

  function porcentagem(quantidade) {
    if (total === 0) {
      return "—";
    }
    return Math.round((quantidade * 100) / total) + "% da turma";
  }

  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  return (
    <SafeAreaView style={estilo.screen} edges={["top"]}>
      <CabecalhoGestor />
      <ScrollView contentContainerStyle={estilo.content}>
        <View style={estilo.rowBetween}>
          <Text style={estilo.eyebrow}>VISÃO DA GESTÃO</Text>
          <View style={[estilo.row, estilo.badge, estilo.badgeSuccess]}>
            <View style={estilo.statusDot} />
            <Text style={[estilo.badgeText, estilo.badgeSuccessText]}>Atualizado agora</Text>
          </View>
        </View>
        <Text style={estilo.pageTitle}>Dashboard de presença</Text>
        <Text style={estilo.pageSubtitle}>
          Acompanhe a frequência dos jovens aprendizes em tempo real.
        </Text>

        {erro !== "" && <Text style={{ color: colors.danger, marginBottom: 12 }}>{erro}</Text>}

        {carregando && <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />}

        {!carregando && (
          <View>
            <View style={[estilo.statsRow, { flexWrap: "wrap" }]}>
              <View style={[estilo.metricCard, { minWidth: "45%" }]}>
                <Text style={estilo.metricLabel}>Aprendizes</Text>
                <Text style={estilo.metricValue}>{total}</Text>
                <Text style={estilo.metricCaption}>Total esperado</Text>
              </View>

              <View style={[estilo.metricCard, estilo.metricCardHighlight, { minWidth: "45%" }]}>
                <Text style={[estilo.metricLabel, estilo.metricTextHighlight]}>Presentes</Text>
                <Text style={[estilo.metricValue, estilo.metricTextHighlight]}>{presentes}</Text>
                <Text style={[estilo.metricCaption, estilo.metricTextHighlight]}>
                  {porcentagem(presentes)}
                </Text>
              </View>

              <View style={[estilo.metricCard, { minWidth: "45%" }]}>
                <Text style={estilo.metricLabel}>Atrasos</Text>
                <Text style={estilo.metricValue}>{atrasos}</Text>
                <Text style={estilo.metricCaption}>{porcentagem(atrasos)}</Text>
              </View>

              <View style={[estilo.metricCard, { minWidth: "45%" }]}>
                <Text style={estilo.metricLabel}>Ausências</Text>
                <Text style={estilo.metricValue}>{ausentes}</Text>
                <Text style={estilo.metricCaption}>{porcentagem(ausentes)}</Text>
              </View>
            </View>

            <View style={estilo.card}>
              <View style={estilo.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={estilo.sectionTitle}>Movimentação de hoje</Text>
                  <Text style={estilo.textMuted}>Entradas registradas pelos aprendizes</Text>
                </View>
                <Pressable
                  style={[estilo.buttonOutline, estilo.buttonSmall]}
                  onPress={() => navigation.navigate("RegistrosPonto")}
                >
                  <Text style={estilo.buttonOutlineText}>Gerenciar registros</Text>
                </Pressable>
              </View>

              {total === 0 && (
                <Text style={[estilo.textMuted, { paddingVertical: 12 }]}>
                  Nenhum aprendiz cadastrado.
                </Text>
              )}

              {movimentacao.map((item) => {
                const cor = corDaSituacao(item.situacao);
                return (
                  <View key={item.id} style={[estilo.listItem, estilo.rowBetween]}>
                    <View style={{ flex: 1 }}>
                      <Text style={estilo.text}>{item.nome}</Text>
                      <Text style={estilo.metricCaption}>Hoje, {hoje}</Text>
                    </View>
                    <Text style={[estilo.text, { flex: 1, textAlign: "center" }]}>
                      Entrada: {formatarHora(item.entrada)}
                    </Text>
                    <View style={[estilo.badge, { backgroundColor: cor.fundo, borderColor: cor.borda }]}>
                      <Text style={[estilo.badgeText, { color: cor.texto }]}>{item.situacao}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
