import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import estilo, { badgeStyle } from "../../css";

export default function TelaGestorJustificativas() {
  const [usuarios, setUsuarios] = useState({});
  const [justificativasBrutas, setJustificativasBrutas] = useState([]);
  const [listaExibicao, setListaExibicao] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Controle do filtro selecionado (Todas, Pendente, Aprovado, Rejeitado)
  const [filtroAtual, setFiltroAtual] = useState("Todas");

  // 1. Puxar todos os utilizadores e justificativas do banco
  useEffect(() => {
    const unsubUsuarios = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const mapaUsuarios = {};
      snapshot.forEach((doc) => {
        mapaUsuarios[doc.id] = { id: doc.id, ...doc.data() };
      });
      setUsuarios(mapaUsuarios);
    });

    const unsubJustificativas = onSnapshot(
      collection(db, "justificativas"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJustificativasBrutas(lista);
      },
    );

    return () => {
      unsubUsuarios();
      unsubJustificativas();
    };
  }, []);

  // 2. Cruzar dados, formatar datas e aplicar o filtro
  useEffect(() => {
    if (Object.keys(usuarios).length === 0 && justificativasBrutas.length === 0)
      return;

    let listaProcessada = justificativasBrutas.map((just) => {
      const user = usuarios[just.usuarioId];

      // Formatar data (se vier como Timestamp do Firebase ou String)
      let dataFormatada = "Data não informada";
      if (just.data) {
        const dataObj =
          typeof just.data.toDate === "function"
            ? just.data.toDate()
            : new Date(just.data);
        const dia = String(dataObj.getDate()).padStart(2, "0");
        const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
        const ano = dataObj.getFullYear();
        dataFormatada = `${dia}/${mes}/${ano}`;
      }

      return {
        ...just,
        nomeUsuario: user ? user.nome : "Usuário Desconhecido",
        dataFormatada: dataFormatada,
        statusAtual: just.status || "Pendente",
      };
    });

    // Ordenar das mais recentes para as mais antigas (opcional)
    listaProcessada.sort((a, b) => {
      const dataA =
        a.data && typeof a.data.toDate === "function"
          ? a.data.toDate()
          : new Date(a.data || 0);
      const dataB =
        b.data && typeof b.data.toDate === "function"
          ? b.data.toDate()
          : new Date(b.data || 0);
      return dataB - dataA;
    });

    // Aplicar o filtro clicado nos botões do topo
    if (filtroAtual !== "Todas") {
      listaProcessada = listaProcessada.filter(
        (item) => item.statusAtual.toLowerCase() === filtroAtual.toLowerCase(),
      );
    }

    setListaExibicao(listaProcessada);
    setCarregando(false);
  }, [usuarios, justificativasBrutas, filtroAtual]);

  // Função para atualizar o status no Firebase ao clicar em Aprovar ou Rejeitar
  const atualizarStatus = async (idJustificativa, novoStatus) => {
    try {
      const docRef = doc(db, "justificativas", idJustificativa);
      await updateDoc(docRef, {
        status: novoStatus,
      });
      console.log(`Status atualizado para ${novoStatus}`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar a justificativa.");
    }
  };

  // Botões de filtro do topo
  const botoesFiltro = ["Todas", "Pendente", "Aprovado", "Rejeitado"];

  return (
    <SafeAreaView style={estilo.screen}>
      <ScrollView contentContainerStyle={estilo.content}>
        <Text style={estilo.eyebrow}>ÁREA DA GESTÃO</Text>
        <Text style={estilo.pageTitle}>Análise de justificativas</Text>
        <Text style={estilo.pageSubtitle}>
          Analise os motivos enviados e atualize o status de cada solicitação.
        </Text>

        {/* Botões de Filtro */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {botoesFiltro.map((filtro) => {
            const isAtivo = filtroAtual === filtro;
            return (
              <TouchableOpacity
                key={filtro}
                style={[
                  estilo.buttonOutline,
                  estilo.buttonSmall,
                  isAtivo && {
                    backgroundColor: "#2E8B57",
                    borderColor: "#2E8B57",
                  }, // Verde se ativo
                ]}
                onPress={() => setFiltroAtual(filtro)}
              >
                <Text
                  style={[
                    estilo.buttonOutlineText,
                    isAtivo && { color: "#FFF" },
                  ]}
                >
                  {filtro}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#2E8B57"
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={{ gap: 15 }}>
            {listaExibicao.length === 0 && (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={estilo.textMuted}>
                  Nenhuma justificativa encontrada para este filtro.
                </Text>
              </View>
            )}

            {listaExibicao.map((item) => {
              const [bgStyle, textStyle] = badgeStyle(item.statusAtual);

              return (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: "#FFF",
                    padding: 20,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  {/* Cabeçalho do Card: Nome, Badge e Botões */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#1E293B",
                        }}
                      >
                        {item.nomeUsuario}
                      </Text>
                      <View style={[estilo.badge, bgStyle]}>
                        <Text style={[estilo.badgeText, textStyle]}>
                          {item.statusAtual}
                        </Text>
                      </View>
                    </View>

                    {/* Botões de Ação */}
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        style={[
                          estilo.buttonOutline,
                          estilo.buttonSmall,
                          { borderColor: "#2E8B57" },
                        ]}
                        onPress={() => atualizarStatus(item.id, "Aprovado")}
                      >
                        <Text
                          style={[
                            estilo.buttonOutlineText,
                            { color: "#2E8B57" },
                          ]}
                        >
                          Aprovar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          estilo.buttonOutline,
                          estilo.buttonSmall,
                          { borderColor: "#EF4444" },
                        ]}
                        onPress={() => atualizarStatus(item.id, "Rejeitado")}
                      >
                        <Text
                          style={[
                            estilo.buttonOutlineText,
                            { color: "#EF4444" },
                          ]}
                        >
                          Rejeitar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Informações da Justificativa */}
                  <Text
                    style={{ fontSize: 12, color: "#64748B", marginBottom: 15 }}
                  >
                    {item.tipo || "Motivo não especificado"} ·{" "}
                    {item.dataFormatada}
                  </Text>

                  <Text
                    style={{ fontSize: 14, color: "#334155", lineHeight: 20 }}
                  >
                    {item.motivo ||
                      item.descricao ||
                      "Sem descrição adicional."}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
