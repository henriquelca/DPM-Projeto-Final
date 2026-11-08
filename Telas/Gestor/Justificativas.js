import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import styles from './css'; // Importa o ficheiro de estilos

export default function AnaliseJustificativasScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Cabeçalho da Página */}
        <Text style={styles.eyebrow}>ÁREA DA GESTÃO</Text>
        <Text style={styles.pageTitle}>Análise de justificativas</Text>
        <Text style={styles.pageSubtitle}>
          Analise os motivos enviados e atualize o status de cada solicitação.
        </Text>

        {/* Filtros */}
        <View style={styles.filters}>
          <TouchableOpacity style={[styles.filter, styles.filterActive]}>
            <Text style={[styles.filterText, styles.filterTextActive]}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Pendente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Aprovado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Rejeitado</Text>
          </TouchableOpacity>
        </View>

        {/* Card 1: João Silva (Pendente) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            {/* Informações da Esquerda */}
            <View>
              <View style={[styles.row, { marginBottom: 4 }]}>
                <Text style={[styles.sectionTitle, { marginRight: 8 }]}>João Silva</Text>
                {/* Utilizando o badge específico de Pendente que criou */}
                <View style={styles.badgePendente}>
                  <Text style={styles.textoPendente}>Pendente</Text>
                </View>
              </View>
              <Text style={styles.textMuted}>Atraso · 17/06/2025</Text>
            </View>

            {/* Botões de Ação na Direita */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.buttonOutline, styles.buttonSmall]}>
                <Text style={styles.buttonOutlineText}>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonDanger, styles.buttonSmall]}>
                <Text style={styles.buttonDangerText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Descrição */}
          <Text style={[styles.text, { marginTop: 8 }]}>
            O ônibus atrasou devido a um acidente na avenida.
          </Text>
        </View>

        {/* Card 2: Maria Santos (Aprovado) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            {/* Informações da Esquerda */}
            <View>
              <View style={[styles.row, { marginBottom: 4 }]}>
                <Text style={[styles.sectionTitle, { marginRight: 8 }]}>Maria Santos</Text>
                {/* Utilizando as classes de badge padrão para Aprovado */}
                <View style={[styles.badge, styles.badgeSuccess, { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }]}>
                  <Text style={[styles.badgeText, styles.badgeSuccessText]}>Aprovado</Text>
                </View>
              </View>
              <Text style={styles.textMuted}>Falta · 12/06/2025</Text>
            </View>

            {/* Botões de Ação na Direita */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.buttonOutline, styles.buttonSmall]}>
                <Text style={styles.buttonOutlineText}>Aprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonDanger, styles.buttonSmall]}>
                <Text style={styles.buttonDangerText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Descrição */}
          <Text style={[styles.text, { marginTop: 8 }]}>
            Consulta médica agendada.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}