import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import styles from './css'; // Importa o arquivo css.js

export default function TelaAprendizJustificativas() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Cabeçalho da Página */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={styles.eyebrow}>ÁREA DO APRENDIZ</Text>
            <Text style={styles.pageTitle}>Minhas justificativas</Text>
            <Text style={styles.pageSubtitle}>
              Envie, edite e acompanhe justificativas de faltas ou atrasos.
            </Text>
          </View>
          
          <TouchableOpacity style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>Nova justificativa</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Justificativa */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            {/* Informações da Esquerda */}
            <View>
              <View style={[styles.row, { marginBottom: 4 }]}>
                <Text style={[styles.sectionTitle, { marginRight: 12 }]}>Atraso</Text>
                <View style={styles.badgePendente}>
                  <Text style={styles.textoPendente}>Pendente</Text>
                </View>
              </View>
              <Text style={styles.textMuted}>17/06/2025</Text>
            </View>

            {/* Botões de Ação na Direita */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.buttonOutline, styles.buttonSmall]}>
                <Text style={styles.buttonOutlineText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.buttonDanger, styles.buttonSmall]}>
                <Text style={styles.buttonDangerText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Descrição */}
          <Text style={[styles.text, { marginTop: 8 }]}>
            O ônibus atrasou devido a um acidente na avenida.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
