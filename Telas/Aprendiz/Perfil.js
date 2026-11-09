import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../css';
import { useAuth } from '../../AuthContext';

export default function PerfilAprendizScreen() {
  const { perfil, sair } = useAuth();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Título da Tela */}
        <Text style={styles.eyebrow}>ÁREA DO APRENDIZ</Text>
        <Text style={styles.pageTitle}>Meu Perfil</Text>
        <Text style={styles.pageSubtitle}>Informações da sua conta de aprendiz.</Text>

        {/* Card de Informações do Usuário */}
        <View style={styles.card}>
          <View style={styles.listItem}>
            <Text style={styles.label}>Nome completo</Text>
            <Text style={styles.text}>{perfil.nome}</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.label}>Cargo</Text>
            <Text style={styles.text}>Jovem Aprendiz</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.label}>Matrícula</Text>
            <Text style={styles.text}>{perfil.matricula}</Text>
          </View>

          <View style={[styles.listItem, styles.listItemLast]}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.text}>{perfil.email}</Text>
          </View>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={[styles.buttonDanger, { marginTop: 16 }]} onPress={sair}>
          <Text style={styles.buttonDangerText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
