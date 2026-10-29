import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../css'; // Importa os estilos que já criaste

export default function TelaRegistroPonto({ navigation }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}>
      
      {/* 1. Cabeçalho Superior Fixo */}
      <View style={styles.container}>
        <View>
          <Text style={styles.cinza}>ESCOLA CHRISTUS</Text>
          <Text style={styles.negrito}>Portal de Frequência</Text>
        </View>
      </View>

      {/* 2. Títulos da Página */}
      <Text style={styles.verde}>ÁREA DO APRENDIZ</Text>
      <Text style={styles.preto}>Histórico de ponto</Text>
      <Text style={styles.cinza1}>Consulte todas as entradas e saídas registradas na sua jornada.</Text>

      {/* 3. Tabela de Registos */}
      <View style={styles.tabelaContainer}>
        
        {/* Cabeçalho da Tabela */}
        <View style={styles.tabelaHeader}>
          <Text style={[styles.tabelaHeaderTexto, { textAlign: 'left' }]}>Data</Text>
          <Text style={styles.tabelaHeaderTexto}>Entrada</Text>
          <Text style={styles.tabelaHeaderTexto}>Saída</Text>
          <Text style={styles.tabelaHeaderTexto}>Total</Text>
          <Text style={styles.tabelaHeaderTexto}>Situação</Text>
        </View>

        {/* Linha 1: Hoje (Exemplo de ponto registado) */}
        <View style={styles.tabelaLinha}>
          <Text style={[styles.tabelaColuna, { textAlign: 'left', fontWeight: 'bold', color: '#163A2B' }]}>Hoje, 18 jun</Text>
          <Text style={styles.tabelaColuna}>07:54</Text>
          <Text style={styles.tabelaColuna}>—</Text>
          <Text style={styles.tabelaColuna}>Em andamento</Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.badgePresente}>
              <Text style={styles.textoBadge}>Presente</Text>
            </View>
          </View>
        </View>

        {/* Linha 2: Dia Anterior (Com Atraso) */}
        <View style={styles.tabelaLinha}>
          <Text style={[styles.tabelaColuna, { textAlign: 'left' }]}>17 jun 2025</Text>
          <Text style={styles.tabelaColuna}>08:12</Text>
          <Text style={styles.tabelaColuna}>14:08</Text>
          <Text style={styles.tabelaColuna}>06h 05min</Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.badgeAtraso}>
              <Text style={styles.textoAtraso}>Atraso</Text>
            </View>
          </View>
        </View>

        {/* Linha 3: Outro dia (Presente) */}
        <View style={styles.tabelaLinha}>
          <Text style={[styles.tabelaColuna, { textAlign: 'left' }]}>16 jun 2025</Text>
          <Text style={styles.tabelaColuna}>07:55</Text>
          <Text style={styles.tabelaColuna}>14:02</Text>
          <Text style={styles.tabelaColuna}>06h 05min</Text>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.badgePresente}>
              <Text style={styles.textoBadge}>Presente</Text>
            </View>
          </View>
        </View>

      </View>

    </ScrollView>
  );
};