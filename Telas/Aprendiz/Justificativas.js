import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  TextInput
} from 'react-native';
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import styles from '../../css'; 
import { useAuth } from "../../AuthContext"; 

export default function TelaAprendizJustificativas() {
  const [justificativas, setJustificativas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do Formulário (Modal)
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoAtual, setTipoAtual] = useState('Falta');
  const [motivoAtual, setMotivoAtual] = useState('');
  const [justificativaEditandoId, setJustificativaEditandoId] = useState(null);

  const { perfil } = useAuth();
  const idUsuarioLogado = auth.currentUser?.uid;

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

  // Abre o modal para CRIAR uma nova
  const abrirModalNova = () => {
    setTipoAtual('Falta');
    setMotivoAtual('');
    setJustificativaEditandoId(null);
    setModalVisivel(true);
  };

  // Abre o modal para EDITAR uma existente
  const abrirModalEditar = (item) => {
    setTipoAtual(item.tipo || 'Falta');
    setMotivoAtual(item.motivo || item.descricao || '');
    setJustificativaEditandoId(item.id);
    setModalVisivel(true);
  };

  // Salva no banco de dados (Adiciona ou Atualiza)
  const salvarJustificativa = async () => {
    if (!motivoAtual.trim()) {
      Alert.alert("Atenção", "Por favor, escreva o motivo da justificativa.");
      return;
    }

    try {
      if (justificativaEditandoId) {
        // Fluxo de Edição
        const ref = doc(db, "justificativas", justificativaEditandoId);
        await updateDoc(ref, {
          tipo: tipoAtual,
          motivo: motivoAtual,
        });
      } else {
        // Fluxo de Criação
        await addDoc(collection(db, "justificativas"), {
          usuarioId: idUsuarioLogado, 
          data: new Date(),
          tipo: tipoAtual,
          motivo: motivoAtual,
          status: "Pendente"
        });
      }
      setModalVisivel(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao salvar a justificativa.");
    }
  };

  // Função que realmente vai no banco e apaga
  const confirmarExclusao = async (id) => {
    try {
      await deleteDoc(doc(db, "justificativas", id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir a justificativa. Verifique as regras do Firestore.");
    }
  };

  // Função chamada ao apertar o botão
  const excluirJustificativa = (id) => {
    if (Platform.OS === 'web') {
      // Usa o confirm nativo do navegador para quem testa no PC (Expo Web)
      const desejaExcluir = window.confirm("Tem certeza que deseja excluir esta justificativa?");
      if (desejaExcluir) {
        confirmarExclusao(id);
      }
    } else {
      // Usa o Alert do React Native para Android e iOS
      Alert.alert("Excluir", "Tem certeza que deseja excluir esta justificativa?", [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => confirmarExclusao(id)
        }
      ]);
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
    <SafeAreaView style={styles.screen || { flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView contentContainerStyle={styles.content || { padding: 16 }}>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={styles.eyebrow || { fontSize: 12, color: '#64748B', fontWeight: 'bold' }}>ÁREA DO APRENDIZ</Text>
            <Text style={styles.pageTitle || { fontSize: 24, fontWeight: 'bold', color: '#0F172A' }}>Minhas justificativas</Text>
            <Text style={styles.pageSubtitle || { fontSize: 14, color: '#475569', marginTop: 4 }}>
              Olá, {perfil?.nome || 'Aprendiz'}! Envie, edite e acompanhe justificativas de faltas ou atrasos.
            </Text>
          </View>
          
          <TouchableOpacity style={styles.buttonPrimary || { backgroundColor: '#2E8B57', padding: 10, borderRadius: 8 }} onPress={abrirModalNova}>
            <Text style={styles.buttonPrimaryText || { color: '#FFF', fontWeight: 'bold' }}>Nova</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 40 }} />
        ) : justificativas.length === 0 ? (
           <View style={{ padding: 20, alignItems: "center" }}>
             <Text style={styles.textMuted || { color: '#64748B' }}>Você ainda não enviou nenhuma justificativa.</Text>
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
                        <Text style={[styles.sectionTitle, { fontWeight: 'bold', fontSize: 16 }]}>{item.tipo || "Geral"}</Text>
                        
                        <View style={[styles.badgePendente || { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }, { backgroundColor: colors.bg }]}>
                          <Text style={[styles.textoPendente || { fontSize: 12, fontWeight: 'bold' }, { color: colors.text }]}>
                            {item.statusAtual}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.textMuted || { color: "#64748B", fontSize: 12 }}>{item.dataFormatada}</Text>
                    </View>

                    {/* Botões de Editar e Excluir só aparecem se estiver Pendente */}
                    {item.statusAtual.toLowerCase() === 'pendente' && (
                      <View style={styles.buttonGroup || { flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity 
                          style={[styles.buttonOutline, styles.buttonSmall || { padding: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6 }]}
                          onPress={() => abrirModalEditar(item)}
                        >
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

      {/* Modal de Nova/Editar Justificativa */}
      <Modal
        visible={modalVisivel}
        transparent={true}
        animationType="fade"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#FFF', padding: 24, borderRadius: 12, elevation: 5 }}>
            
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 }}>
              {justificativaEditandoId ? 'Editar Justificativa' : 'Nova Justificativa'}
            </Text>

            <Text style={{ fontSize: 14, color: '#475569', marginBottom: 8, fontWeight: '500' }}>Tipo de ocorrência:</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              <TouchableOpacity 
                onPress={() => setTipoAtual('Falta')} 
                style={{ flex: 1, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: tipoAtual === 'Falta' ? '#2E8B57' : '#E2E8F0', borderRadius: 8, backgroundColor: tipoAtual === 'Falta' ? '#F0FDF4' : '#FFF' }}
              >
                <Text style={{ fontWeight: tipoAtual === 'Falta' ? 'bold' : 'normal', color: tipoAtual === 'Falta' ? '#2E8B57' : '#64748B' }}>Falta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setTipoAtual('Atraso')} 
                style={{ flex: 1, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: tipoAtual === 'Atraso' ? '#2E8B57' : '#E2E8F0', borderRadius: 8, backgroundColor: tipoAtual === 'Atraso' ? '#F0FDF4' : '#FFF' }}
              >
                <Text style={{ fontWeight: tipoAtual === 'Atraso' ? 'bold' : 'normal', color: tipoAtual === 'Atraso' ? '#2E8B57' : '#64748B' }}>Atraso</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, color: '#475569', marginBottom: 8, fontWeight: '500' }}>Motivo:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 16, color: '#334155', minHeight: 100, textAlignVertical: 'top', backgroundColor: '#F8FAFC' }}
              multiline
              placeholder="Explique detalhadamente o que aconteceu..."
              value={motivoAtual}
              onChangeText={setMotivoAtual}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24, gap: 12 }}>
              <TouchableOpacity 
                onPress={() => setModalVisivel(false)} 
                style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 }}
              >
                <Text style={{ color: '#64748B', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={salvarJustificativa} 
                style={{ backgroundColor: '#2E8B57', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Enviar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}