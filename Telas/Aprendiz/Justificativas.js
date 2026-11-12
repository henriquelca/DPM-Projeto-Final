import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { auth, db } from "../../firebaseConfig"; // <-- auth adicionado aqui
import { collection, query, where, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import styles from '../../css'; 
import { useAuth } from "../../AuthContext"; 

export default function TelaAprendizJustificativas() {
  const [justificativas, setJustificativas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const { perfil } = useAuth(); // Puxa os dados (nome, matrícula, etc)
  const idUsuarioLogado = auth.currentUser?.uid; // Puxa o ID real da autenticação

  useEffect(() => {
    if (!idUsuarioLogado) {
      setCarregando(false);
      return;
    }

    const q = query(
      collection(db, "justificativas"),
      where("usuarioId", "==", idUsuarioLogado)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        let dataFormatada = "Data não informada";
        if (data.data) {
          const dataObj = typeof data.data.toDate === "function" 
            ? data.data.toDate() 
            : new Date(data.data);
          const dia = String(dataObj.getDate()).padStart(2, "0");
          const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
          const ano = dataObj.getFullYear();
          dataFormatada = `${dia}/${mes}/${ano}`;
        }

        return {
          id: doc.id,
          ...data,
          dataFormatada,
          statusAtual: data.status || "Pendente"
        };
      });

      lista.sort((a, b) => {
        const dataA = a.data && typeof a.data.toDate === "function" ? a.data.toDate() : new Date(a.data || 0);
        const dataB = b.data && typeof b.data.toDate === "function" ? b.data.toDate() : new Date(b.data || 0);
        return dataB - dataA;
      });

      setJustificativas(lista);
      setCarregando(false);
    }, (erro) => {
      console.error("Erro no Firestore:", erro);
      setCarregando(false);
    });

    return () => unsub();
  }, [idUsuarioLogado]);

  const excluirJustificativa = (id) => {
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta justificativa?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "justificativas", id));
          } catch (error) {
            console.error("Erro ao excluir:", error);
            Alert.alert("Erro", "Não foi possível excluir a justificativa.");
          }
        }
      }
    ]);
  };

  const simularNovaJustificativa = async () => {
    if (!idUsuarioLogado) return;
    
    try {
      await addDoc(collection(db, "justificativas"), {
        usuarioId: idUsuarioLogado, 
        data: new Date(),
        tipo: "Atraso",
        motivo: "O ônibus quebrou no caminho (Teste).",
        status: "Pendente"
      });
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      Alert.alert("Erro", "Falha ao criar justificativa.");
    }
  };

  const getBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'aprovado': return { bg: '#DEF7EC', text: '#03543F' };
      case 'rejeitado': return { bg: '#FDE8E8', text: '#9B1C1C' };
      default: return { bg: '#FEF4C5', text: '#8A6D3B' }; 
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={styles.eyebrow}>ÁREA DO APRENDIZ</Text>
            {/* Usa o nome do perfil, se existir */}
            <Text style={styles.pageTitle}>Minhas justificativas</Text>
            <Text style={styles.pageSubtitle}>
              Olá, {perfil?.nome || 'Aprendiz'}! Envie, edite e acompanhe justificativas de faltas ou atrasos.
            </Text>
          </View>
          
          <TouchableOpacity style={styles.buttonPrimary} onPress={simularNovaJustificativa}>
            <Text style={styles.buttonPrimaryText}>Nova</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 40 }} />
        ) : justificativas.length === 0 ? (
           <View style={{ padding: 20, alignItems: "center" }}>
             <Text style={styles.textMuted}>Você ainda não enviou nenhuma justificativa.</Text>
           </View>
        ) : (
          <View style={{ gap: 15 }}>
            {justificativas.map((item) => {
              const colors = getBadgeStyle(item.statusAtual);

              return (
                <View key={item.id} style={styles.card || {
                  backgroundColor: "#FFF", padding: 20, borderRadius: 8, 
                  borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 10
                }}>
                  <View style={styles.cardHeaderRow || { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    
                    <View>
                      <View style={[styles.row || { flexDirection: 'row', alignItems: 'center' }, { marginBottom: 4, gap: 10 }]}>
                        <Text style={[styles.sectionTitle, { fontWeight: 'bold' }]}>{item.tipo || "Geral"}</Text>
                        
                        <View style={[styles.badgePendente || { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }, { backgroundColor: colors.bg }]}>
                          <Text style={[styles.textoPendente || { fontSize: 12, fontWeight: 'bold' }, { color: colors.text }]}>
                            {item.statusAtual}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.textMuted || { color: "#64748B", fontSize: 12 }}>{item.dataFormatada}</Text>
                    </View>

                    {item.statusAtual.toLowerCase() === 'pendente' && (
                      <View style={styles.buttonGroup || { flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity style={[styles.buttonOutline, styles.buttonSmall || { padding: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6 }]}>
                          <Text style={styles.buttonOutlineText || { color: '#334155' }}>Editar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.buttonDanger, styles.buttonSmall || { padding: 8, borderWidth: 1, borderColor: '#EF4444', borderRadius: 6 }]}
                          onPress={() => excluirJustificativa(item.id)}
                        >
                          <Text style={styles.buttonDangerText || { color: '#EF4444' }}>Excluir</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.text || { color: "#334155" }, { marginTop: 8 }]}>
                    {item.motivo || item.descricao || "Sem descrição."}
                  </Text>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}