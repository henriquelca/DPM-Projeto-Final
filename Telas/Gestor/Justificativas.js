import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";
import estilo, { badgeStyle } from "../../css";
import { Feather } from "@expo/vector-icons";

export default function TelaGestorJustificativas() {
  const [usuarios, setUsuarios] = useState({});
  const [justificativasBrutas, setJustificativasBrutas] = useState([]);
  const [listaExibicao, setListaExibicao] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Controle do filtro selecionado (Todas, Pendente, Aprovado, Rejeitado)
  const [filtroAtual, setFiltroAtual] = useState("Todas");
  
  // Estado para armazenar os IDs das justificativas selecionadas
  const [selecionados, setSelecionados] = useState([]);

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

    // Ordenar das mais recentes para as mais antigas
    listaProcessada.sort((a, b) => {
      const dataA = a.data && typeof a.data.toDate === "function" ? a.data.toDate() : new Date(a.data || 0);
      const dataB = b.data && typeof b.data.toDate === "function" ? b.data.toDate() : new Date(b.data || 0);
      return dataB - dataA;
    });

    if (filtroAtual !== "Todas") {
      listaProcessada = listaProcessada.filter(
        (item) => item.statusAtual.toLowerCase() === filtroAtual.toLowerCase(),
      );
    }

    setListaExibicao(listaProcessada);
    setCarregando(false);
  }, [usuarios, justificativasBrutas, filtroAtual]);

  // Função para marcar/desmarcar um item
  const toggleSelecao = (id) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((itemId) => itemId !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  // Função para atualizar status individual
  const atualizarStatus = async (idJustificativa, novoStatus) => {
    try {
      const docRef = doc(db, "justificativas", idJustificativa);
      await updateDoc(docRef, { status: novoStatus });
      setSelecionados(selecionados.filter(id => id !== idJustificativa));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Erro ao atualizar a justificativa.");
    }
  };

  // Função para atualizar VÁRIOS status de uma vez usando batch
  const atualizarStatusEmMassa = async (novoStatus) => {
    if (selecionados.length === 0) return;
    try {
      const batch = writeBatch(db);
      
      selecionados.forEach((id) => {
        const docRef = doc(db, "justificativas", id);
        batch.update(docRef, { status: novoStatus });
      });

      await batch.commit();
      setSelecionados([]); 
      Alert.alert("Sucesso", `Foram marcadas como ${novoStatus} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar em massa:", error);
      Alert.alert("Erro", "Não foi possível atualizar as justificativas selecionadas.");
    }
  };

  const mudarFiltro = (filtro) => {
    setFiltroAtual(filtro);
    setSelecionados([]);
  };

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
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {botoesFiltro.map((filtro) => {
            const isAtivo = filtroAtual === filtro;
            return (
              <TouchableOpacity
                key={filtro}
                style={[
                  estilo.buttonOutline,
                  estilo.buttonSmall,
                  isAtivo && { backgroundColor: "#2E8B57", borderColor: "#2E8B57" },
                ]}
                onPress={() => mudarFiltro(filtro)}
              >
                <Text style={[estilo.buttonOutlineText, isAtivo && { color: "#FFF" }]}>
                  {filtro}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Painel de Ações em Massa (Aparece apenas quando há itens selecionados) */}
        {selecionados.length > 0 && (
          <View style={{
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            backgroundColor: '#F8FAFC', 
            padding: 15, 
            borderRadius: 8, 
            borderWidth: 1,
            borderColor: '#CBD5E1',
            marginBottom: 20
          }}>
            <Text style={{ fontWeight: 'bold', color: '#334155', fontSize: 16 }}>
              {selecionados.length} selecionado{selecionados.length > 1 ? 's' : ''}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                onPress={() => atualizarStatusEmMassa("Aprovado")} 
                style={{ backgroundColor: '#2E8B57', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6 }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => atualizarStatusEmMassa("Rejeitado")} 
                style={{ backgroundColor: '#EF4444', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 6 }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {carregando ? (
          <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 40 }} />
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
              const isSelecionado = selecionados.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => toggleSelecao(item.id)} 
                  style={{
                    backgroundColor: isSelecionado ? "#F0FDF4" : "#FFF", 
                    padding: 20,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isSelecionado ? "#2E8B57" : "#E2E8F0",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      
                      {/* Checkbox Customizado */}
                      <View style={{
                        width: 24,
                        height: 24,
                        borderWidth: 2,
                        borderColor: isSelecionado ? "#2E8B57" : "#CBD5E1",
                        backgroundColor: isSelecionado ? "#2E8B57" : "transparent",
                        borderRadius: 4,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelecionado && <Feather name="check" size={16} color="#FFF" />}
                      </View>

                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1E293B" }}>
                        {item.nomeUsuario}
                      </Text>
                      <View style={[estilo.badge, bgStyle]}>
                        <Text style={[estilo.badgeText, textStyle]}>
                          {item.statusAtual}
                        </Text>
                      </View>
                    </View>

                    {/* Botões de Ação com Ícones (Ocultos se tiver seleção múltipla ativada) */}
                    {selecionados.length === 0 && (
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          style={[estilo.buttonOutline, estilo.buttonSmall, { borderColor: "#2E8B57", paddingHorizontal: 10, paddingVertical: 8, alignItems: "center", justifyContent: "center" }]}
                          onPress={(e) => {
                            e.stopPropagation(); 
                            atualizarStatus(item.id, "Aprovado");
                          }}
                        >
                          <Feather name="check" size={20} color="#2E8B57" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[estilo.buttonOutline, estilo.buttonSmall, { borderColor: "#EF4444", paddingHorizontal: 10, paddingVertical: 8, alignItems: "center", justifyContent: "center" }]}
                          onPress={(e) => {
                            e.stopPropagation(); 
                            atualizarStatus(item.id, "Rejeitado");
                          }}
                        >
                          <Feather name="x" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <Text style={{ fontSize: 12, color: "#64748B", marginBottom: 15, paddingLeft: 34 }}>
                    {item.tipo || "Motivo não especificado"} · {item.dataFormatada}
                  </Text>

                  <Text style={{ fontSize: 14, color: "#334155", lineHeight: 20, paddingLeft: 34 }}>
                    {item.motivo || item.descricao || "Sem descrição adicional."}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}