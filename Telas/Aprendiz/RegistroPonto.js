import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import styles from '../../css';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

export default function TelaAprendizRegistroPonto({ navigation }) {
  const [historicoAgrupado, setHistoricoAgrupado] = useState([]);

  useEffect(() => {
    if (!auth?.currentUser) return;

    const q = query(
      collection(db, "pontos"),
      where("usuarioId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const pontos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      const agrupados = {};
      pontos.forEach(p => {
        if (!p.dataHora) return;
        const dataObj = p.dataHora.toDate();
        const dataKey = dataObj.toLocaleDateString('pt-BR'); 

        if (!agrupados[dataKey]) {
          agrupados[dataKey] = { 
            dataOriginal: dataObj, 
            entrada: null, 
            saida: null 
          };
        }

        if (p.tipo === "entrada" && !agrupados[dataKey].entrada) {
          agrupados[dataKey].entrada = dataObj;
        }
        if (p.tipo === "saida" && !agrupados[dataKey].saida) {
          agrupados[dataKey].saida = dataObj;
        }
      });

      const historicoArray = Object.keys(agrupados).map(key => agrupados[key]);
      historicoArray.sort((a, b) => b.dataOriginal - a.dataOriginal);
      
      setHistoricoAgrupado(historicoArray);
    });

    return () => unsubscribe();
  }, []);

  const registrarPonto = async () => {
    try {
      const hoje = new Date().toLocaleDateString('pt-BR');
      const registroHoje = historicoAgrupado.find(r => r.dataOriginal.toLocaleDateString('pt-BR') === hoje);
      
      let tipoParaRegistrar = "entrada";
      
      if (registroHoje?.entrada && !registroHoje?.saida) {
        tipoParaRegistrar = "saida";
      } else if (registroHoje?.entrada && registroHoje?.saida) {
        Alert.alert("Aviso", "Você já registrou a entrada e a saída de hoje.");
        return;
      }

      await addDoc(collection(db, "pontos"), {
        usuarioId: auth.currentUser.uid,
        tipo: tipoParaRegistrar,
        dataHora: serverTimestamp(),
      });
      
    } catch (error) {
      Alert.alert("Erro", "Não foi possível registrar o ponto.");
      console.error(error);
    }
  };

  const formatarHora = (data) => data ? data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "—";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}>
      
      <View style={styles.container}>
        <View>
          <Text style={styles.cinza}>ESCOLA CHRISTUS</Text>
          <Text style={styles.negrito}>Portal de Frequência</Text>
        </View>
      </View>

      <Text style={styles.verde}>ÁREA DO APRENDIZ</Text>
      <Text style={styles.preto}>Histórico de ponto</Text>
      <Text style={styles.cinza1}>Consulte todas as entradas e saídas registradas na sua jornada.</Text>

      <TouchableOpacity style={styles.botaoRegistrar} onPress={registrarPonto}>
        <Text style={styles.textoBotao}>Registrar ponto</Text>
      </TouchableOpacity>

      <View style={styles.tabelaContainer}>
        <View style={styles.tabelaHeader}>
          <Text style={[styles.tabelaHeaderTexto, { textAlign: 'left' }]}>Data</Text>
          <Text style={styles.tabelaHeaderTexto}>Entrada</Text>
          <Text style={styles.tabelaHeaderTexto}>Saída</Text>
          <Text style={styles.tabelaHeaderTexto}>Total</Text>
          <Text style={styles.tabelaHeaderTexto}>Situação</Text>
        </View>

        {historicoAgrupado.map((dia, index) => {
          const hoje = new Date().toLocaleDateString('pt-BR');
          const diaString = dia.dataOriginal.toLocaleDateString('pt-BR');
          
          let dataFormatada = dia.dataOriginal.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
          if (diaString === hoje) {
             dataFormatada = "Hoje, " + dia.dataOriginal.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
          }

          let totalTexto = "—";
          let situacao = "Pendente";
          let badgeAtual = [styles.badgeWarning, styles.badgeWarningText]; 

          if (dia.entrada && dia.saida) {
            const diffMs = dia.saida - dia.entrada;
            const horas = Math.floor(diffMs / (1000 * 60 * 60));
            const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            totalTexto = `${String(horas).padStart(2, '0')}h ${String(minutos).padStart(2, '0')}min`;
            
            if (horas >= 4) {
              situacao = "Presente";
              badgeAtual = [styles.badgeSuccess, styles.badgeSuccessText];
            } else {
              situacao = "Atraso";
              badgeAtual = [styles.badgeWarning, styles.badgeWarningText];
            }
          } else if (dia.entrada && !dia.saida) {
            totalTexto = "Em andamento";
            situacao = "Presente";
            badgeAtual = [styles.badgeSuccess, styles.badgeSuccessText];
          }

          return (
            <View key={index} style={styles.tabelaLinha}>
              <Text style={[styles.tabelaColuna, { textAlign: 'left', fontWeight: 'bold', color: '#163A2B' }]}>{dataFormatada}</Text>
              <Text style={styles.tabelaColuna}>{formatarHora(dia.entrada)}</Text>
              <Text style={styles.tabelaColuna}>{formatarHora(dia.saida)}</Text>
              <Text style={styles.tabelaColuna}>{totalTexto}</Text>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={badgeAtual[0]}>
                  <Text style={badgeAtual[1]}>{situacao}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};