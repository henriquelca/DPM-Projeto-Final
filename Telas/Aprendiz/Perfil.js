import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import styles from './css';

export default function PerfilAprendizScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Título da Tela */}
        <Text style={styles.eyebrow}>ÁREA DO APRENDIZ</Text>
        <Text style={styles.pageTitle}>Meu Perfil</Text>
        <Text style={styles.pageSubtitle}>Informações da sua conta de aprendiz.</Text>

        {/* Card de Informações do Usuário */}
        <View style={styles.card}>
          <View style={styles.listItem}>
            <Text style={styles.label}>Nome Completo</Text>
            <Text style={styles.text}>João Silva</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.label}>Cargo</Text>
            <Text style={styles.text}>Jovem Aprendiz</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.label}>Matrícula</Text>
            <Text style={styles.text}>202500123</Text>
          </View>

          <View style={[styles.listItem, styles.listItemLast]}>
            <Text style={styles.label}>Turma</Text>
            <Text style={styles.text}>Turma A - Matutino</Text>
          </View>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={[styles.buttonDanger, { marginTop: 16 }]}>
          <Text style={styles.buttonDangerText}>Sair do Aplicativo</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}