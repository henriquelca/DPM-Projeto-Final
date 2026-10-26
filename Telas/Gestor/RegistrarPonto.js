import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import estilo, { badgeStyle } from '../../css';

export default function TelaGestorRegistrarPonto({ route, navigation }) {
  
  // 1. A LISTA FICA AQUI, ANTES DO RETURN
  const registros = [
    { id: 1, nome: 'João Silva', data: 'Hoje, 18 jun', entrada: '07:54', saida: '—', status: 'Presente' },
    { id: 2, nome: 'Maria Santos', data: 'Hoje, 18 jun', entrada: '08:17', saida: '—', status: 'Atraso' },
    { id: 3, nome: 'Pedro Lima', data: 'Hoje, 18 jun', entrada: '—', saida: '—', status: 'Ausente' },
    { id: 4, nome: 'Ana Costa', data: 'Hoje, 18 jun', entrada: '07:48', saida: '—', status: 'Presente' },
    { id: 5, nome: 'Lucas Alves', data: 'Hoje, 18 jun', entrada: '08:04', saida: '—', status: 'Presente' }
  ];

  return (
    <SafeAreaView style={estilo.screen}>
      
      {/* Cabeçalho */}
      <View style={estilo.header}>
        <View>
          <Text style={estilo.headerBrand}>ESCOLA CHRISTUS</Text>
          <Text style={estilo.headerTitle}>Portal de frequência</Text>
        </View>
        <View style={estilo.row}>
          <View style={estilo.headerUser}>
            <Text style={estilo.headerUserName}>Mariana Souza</Text>
            <Text style={estilo.headerUserRole}>Gestora</Text>
          </View>
          <TouchableOpacity style={estilo.buttonOutline} onPress={() => navigation.navigate('Login')}>
            <Text style={estilo.buttonOutlineText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Abas de Navegação */}
      <View style={estilo.tabs}>
        <TouchableOpacity style={estilo.tab} onPress={() => navigation.navigate('GestorDeshboard')}>
          <Text style={estilo.tabText}>Dashboard</Text>
        </TouchableOpacity>
        
        <View style={[estilo.tab, estilo.tabActive]}>
          <Text style={estilo.tabTextActive}>Registros de ponto</Text>
        </View>
        
        <TouchableOpacity style={estilo.tab} onPress={() => navigation.navigate('GestorJustificativas')}>
          <Text style={estilo.tabText}>Justificativas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilo.tab} onPress={() => navigation.navigate('GestorUsuario')}>
          <Text style={estilo.tabText}>Usuários</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={estilo.content}>
        <Text style={estilo.eyebrow}>ÁREA DA GESTÃO</Text>
        <Text style={estilo.pageTitle}>Registros de ponto</Text>
        <Text style={estilo.pageSubtitle}>Consulte, corrija ou exclua registros em caso de erro justificado.</Text>

        {/* Caixa principal da Tabela */}
        <View style={estilo.table}>
          
          {/* Cabeçalho da Tabela */}
          <View style={estilo.tableHeader}>
            <Text style={estilo.tableHeaderText}>Aprendiz</Text>
            <Text style={estilo.tableHeaderText}>Data</Text>
            <Text style={estilo.tableHeaderText}>Entrada</Text>
            <Text style={estilo.tableHeaderText}>Saída</Text>
            <Text style={estilo.tableHeaderText}>Situação</Text>
            <Text style={estilo.tableHeaderText}>Ações</Text>
          </View>

          {/* 2. O MAP FICA AQUI, DENTRO DA TABELA, REPETINDO AS LINHAS */}
          {registros.map((item) => {
            const [bgStyle, textStyle] = badgeStyle(item.status);
            
            return (
              <View key={item.id} style={estilo.tableRow}>
                <Text style={[estilo.tableCell, estilo.tableCellBold]}>{item.nome}</Text>
                <Text style={estilo.tableCell}>{item.data}</Text>
                <Text style={estilo.tableCell}>{item.entrada}</Text>
                <Text style={estilo.tableCell}>{item.saida}</Text>
                
                <View style={estilo.tableCell}>
                  <View style={[estilo.badge, bgStyle]}>
                    <Text style={[estilo.badgeText, textStyle]}>{item.status}</Text>
                  </View>
                </View>
                
                <View style={[estilo.tableCell, estilo.buttonGroup]}>
                  <TouchableOpacity style={[estilo.buttonOutline, estilo.buttonSmall]}>
                    <Text style={estilo.buttonOutlineText}>Corrigir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[estilo.buttonDanger, estilo.buttonSmall]}>
                    <Text style={estilo.buttonDangerText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}