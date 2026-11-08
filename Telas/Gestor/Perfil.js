import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import styles from './css';

export default function TelaPerfilGestor() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Título da Tela */}
        <Text style={styles.eyebrow}>ÁREA DA GESTÃO</Text>
        <Text style={styles.pageTitle}>Perfil da Gestão</Text>
        <Text style={styles.pageSubtitle}>Informações da sua conta administrativa.</Text>

        {/* Card de Informações do Usuário */}
        <View style={styles.card}>
          <View style={styles.listItem}>
            <Text style={styles.label}>Nome Completo</Text>
            <Text style={styles.text}>Ana Sousa</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.label}>Nível de Acesso</Text>
            <Text style={styles.text}>Coordenadora / Gestora</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.label}>E-mail Institucional</Text>
            <Text style={styles.text}>ana.sousa@escolachristus.com</Text>
          </View>

          <View style={[styles.listItem, styles.listItemLast]}>
            <Text style={styles.label}>Setor Responsável</Text>
            <Text style={styles.text}>Recursos Humanos / Gestão de Ponto</Text>
          </View>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={[styles.buttonDanger, { marginTop: 16 }]}>
          <Text style={styles.buttonDangerText}>Encerrar Sessão</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}