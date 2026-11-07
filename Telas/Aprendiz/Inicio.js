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

  useEffect(() => {
    // 1. Atualizar o relógio em tempo real
    const atualizarRelogio = () => {
      const agora = new Date();
      setHoraAtual(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setDataAtual(agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }));
    };
    atualizarRelogio();
    const timer = setInterval(atualizarRelogio, 60000); 

    if (!auth?.currentUser) return;

    // 2. Buscar o nome do aprendiz no banco
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

    // 3. Buscar os pontos para calcular Presenças e Atrasos
    const q = query(
      collection(db, "pontos"),
      where("usuarioId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
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

      Object.keys(pontosPorDia).forEach(data => {
        const registrosDoDia = pontosPorDia[data];
        const entrada = registrosDoDia.find(r => r.tipo === "entrada");
        const saida = registrosDoDia.find(r => r.tipo === "saida");

        if (entrada && saida) {
          const horaEntrada = entrada.dataHora.toDate().getTime();
          const horaSaida = saida.dataHora.toDate().getTime();
          const horasTrabalhadas = (horaSaida - horaEntrada) / (1000 * 60 * 60);

          if (horasTrabalhadas >= 4) {
            presencas++; 
          } else {
            atrasos++; 
          }
        }
      });

      setResumo({ presencas, faltas: 0, atrasos }); 
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  return (
    <ScrollView style={styles.screen}>
      
      {/* CABEÇALHO */}
      <View style={styles.container}>
        <View>
          <Text style={styles.cinza}>ESCOLA CHRISTUS</Text>
          <Text style={styles.negrito}>Portal de Frequência</Text>
        </View>
      </View>

      {/* BOAS VINDAS */}
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
          <View style={styles.badgePresente}>
            <Ionicons name="checkmark-circle" size={14} color="#23804F" />
            <Text style={styles.textoBadge}>Presente</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.botaoRegistrar}
          onPress={() => navigation.navigate('Registro de Ponto')}
        >
          <Text style={styles.textoBotao}>Registrar entrada</Text>
        </TouchableOpacity>
      </View>

      {/* CARD 2: RESUMO DO MÊS */}
      <View style={[styles.card, { marginHorizontal: 20 }]}>
        <Text style={styles.cinza2}>Resumo do mês</Text>
        
        {/* Usando as tuas classes para os Mini Cards */}
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
            <Text style={styles.textoMiniCard}>atrasos</Text>
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

        <View style={styles.itemJustificativa}>
          <View>
            <Text style={{ fontWeight: 'bold', color: '#163A2B', fontSize: 14 }}>Atraso</Text>
            <Text style={{ fontSize: 12, color: '#5B7A6A', marginTop: 2 }}>17/06/2025</Text>
          </View>
          <View style={styles.badgePendente}>
            <Text style={styles.textoPendente}>Pendente</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};