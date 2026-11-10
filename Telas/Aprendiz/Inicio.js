import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../css'; 
import { auth, db } from '../../firebaseConfig'; 
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

export default function TelaAprendizInicio({ navigation }) {
  const [nome, setNome] = useState("Carregando...");
  const [horaAtual, setHoraAtual] = useState("");
  const [dataAtual, setDataAtual] = useState("");
  const [resumo, setResumo] = useState({ presencas: 0, faltas: 0, atrasos: 0 });
  const [statusHoje, setStatusHoje] = useState("Pendente");
  
  // Novo estado para guardar as justificativas vindas do banco
  const [justificativasRecentes, setJustificativasRecentes] = useState([]);

  useEffect(() => {
    // 1. Atualizar o relógio
    const atualizarRelogio = () => {
      const agora = new Date();
      setHoraAtual(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setDataAtual(agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }));
    };
    atualizarRelogio();
    const timer = setInterval(atualizarRelogio, 60000); 

    if (!auth?.currentUser) return;

    // 2. Buscar o nome do aprendiz
    const buscarPerfil = async () => {
      try {
        const perfilRef = await getDoc(doc(db, "usuarios", auth.currentUser.uid));
        if (perfilRef.exists()) {
          setNome(perfilRef.data().nome);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    buscarPerfil();

    // 3. Buscar pontos e calcular o Resumo do Mês
    const qPontos = query(
      collection(db, "pontos"),
      where("usuarioId", "==", auth.currentUser.uid)
    );

    const unsubPontos = onSnapshot(qPontos, (snap) => {
      const pontos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const pontosPorDia = {};
      pontos.forEach(p => {
        if (!p.dataHora) return;
        const data = p.dataHora.toDate().toLocaleDateString('pt-BR');
        if (!pontosPorDia[data]) pontosPorDia[data] = [];
        pontosPorDia[data].push(p);
      });

      let presencas = 0;
      let atrasos = 0;
      const hojeStr = new Date().toLocaleDateString('pt-BR');

      Object.keys(pontosPorDia).forEach(data => {
        const registrosDoDia = pontosPorDia[data];
        const entrada = registrosDoDia.find(r => r.tipo === "entrada");
        const saídas = registrosDoDia.filter(r => r.tipo === "saida");
        const saida = saídas.length > 0 ? saídas[saídas.length - 1] : null;

        if (entrada && saida) {
          const diffMs = saida.dataHora.toDate() - entrada.dataHora.toDate();
          const horasTrabalhadas = diffMs / (1000 * 60 * 60);

          if (horasTrabalhadas >= 4) {
            presencas++; 
          } else {
            atrasos++; 
          }

          if (data === hojeStr) setStatusHoje("Presente");
        } else if (entrada && !saida) {
          if (data === hojeStr) setStatusHoje("Em andamento");
        }
      });

      setResumo({ presencas, faltas: 0, atrasos }); 
    });

    // 4. Buscar as Justificativas do banco
    const qJustificativas = query(
      collection(db, "justificativas"),
      where("usuarioId", "==", auth.currentUser.uid)
    );

    const unsubJustificativas = onSnapshot(qJustificativas, (snap) => {
      const justs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Ordena da mais recente para a mais antiga pela data de criação
      justs.sort((a, b) => {
        const tempoA = a.criadaEm ? a.criadaEm.toDate().getTime() : 0;
        const tempoB = b.criadaEm ? b.criadaEm.toDate().getTime() : 0;
        return tempoB - tempoA;
      });

      // Pega apenas as 2 últimas para não encher a tela de Início
      setJustificativasRecentes(justs.slice(0, 2));
    });

    return () => {
      clearInterval(timer);
      unsubPontos();
      unsubJustificativas();
    };
  }, []);

  return (
    <ScrollView style={styles.screen}>
      
      <View style={styles.container}>
        <View>
          <Text style={styles.cinza}>ESCOLA CHRISTUS</Text>
          <Text style={styles.negrito}>Portal de Frequência</Text>
        </View>
      </View>

      <Text style={styles.verde}>Área do aprendiz</Text>
      <Text style={styles.preto}>Bom dia, {nome}</Text>
      <Text style={styles.cinza1}>Registre e acompanhe aqui sua jornada</Text>

      {/* CARD 1: REGISTRO DE PONTO */}
      <View style={[styles.card, { marginHorizontal: 20 }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cinza2}>Horário atual</Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#163A2B' }}>{horaAtual}</Text>
            <Text style={{ fontSize: 14, color: '#5B7A6A' }}>{dataAtual}</Text>
          </View>
          {statusHoje === "Presente" && (
            <View style={styles.badgePresente}>
              <Ionicons name="checkmark-circle" size={14} color="#23804F" />
              <Text style={styles.textoBadge}>Presente</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.botaoRegistrar}
          onPress={() => navigation.navigate('Registro de Ponto')}
        >
          <Text style={styles.textoBotao}>Registrar ponto</Text>
        </TouchableOpacity>
      </View>

      {/* CARD 2: RESUMO DO MÊS */}
      <View style={[styles.card, { marginHorizontal: 20 }]}>
        <Text style={styles.cinza2}>Resumo do mês</Text>
        
        <View style={styles.linhaDeCard}>
          <View style={styles.miniCard}>
            <Text style={styles.numeroMiniCard}>{resumo.presencas}</Text>
            <Text style={styles.textoMiniCard}>Presenças</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.numeroMiniCard}>{resumo.faltas}</Text>
            <Text style={styles.textoMiniCard}>Faltas</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.numeroMiniCard}>{resumo.atrasos}</Text>
            <Text style={styles.textoMiniCard}>Atrasos</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.botaoHistorico}
          onPress={() => navigation.navigate('Registro de Ponto')}
        >
          <Text style={styles.textoBotaoHistorico}>Ver histórico completo</Text>
        </TouchableOpacity>
      </View>

      {/* CARD 3: JUSTIFICATIVAS RECENTES */}
      <View style={[styles.card, { marginHorizontal: 20, marginBottom: 30 }]}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#163A2B' }}>Justificativas recentes</Text>
            <Text style={{ fontSize: 12, color: '#5B7A6A', marginTop: 2 }}>Acompanhe o status dos seus envios.</Text>
          </View>
          <TouchableOpacity 
            style={styles.botaoVerTodas}
            onPress={() => navigation.navigate('Justificativas')}
          >
            <Text style={styles.textoVerTodas}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {justificativasRecentes.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#5B7A6A', marginTop: 10 }}>Nenhuma justificativa enviada.</Text>
        ) : (
          justificativasRecentes.map((just) => {
            // Lógica para formatar a data da falta
            const dataFalta = just.data ? just.data.toDate().toLocaleDateString('pt-BR') : "--/--/----";
            
            // Lógica para definir as cores e textos dependendo do status do Firebase
            let estiloBadge = styles.badgePendente;
            let estiloTextoBadge = styles.textoPendente;
            let textoStatus = "Pendente";

            if (just.status === "aprovada") {
              estiloBadge = styles.badgeAprovado || { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#10B981' };
              estiloTextoBadge = styles.textoAprovado || { color: '#047857', fontSize: 12, fontWeight: 'bold' };
              textoStatus = "Aprovada";
            } else if (just.status === "recusada") {
              estiloBadge = { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444' };
              estiloTextoBadge = { color: '#B91C1C', fontSize: 12, fontWeight: 'bold' };
              textoStatus = "Recusada";
            }

            return (
              <View key={just.id} style={[styles.itemJustificativa, { marginBottom: 10 }]}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#163A2B', fontSize: 14 }}>{just.motivo || "Falta/Atraso"}</Text>
                  <Text style={{ fontSize: 12, color: '#5B7A6A', marginTop: 2 }}>Data: {dataFalta}</Text>
                </View>
                <View style={estiloBadge}>
                  <Text style={estiloTextoBadge}>{textoStatus}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

    </ScrollView>
  );
};