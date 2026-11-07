import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import estilo, { badgeStyle } from "../../css";

export default function TelaGestorJustificativas() {
  // O useState é fundamental para que o React saiba que o texto deve mudar na tela
  const [filtroAtual, setFiltroAtual] = useState("Todas");
  const [menuAberto, setMenuAberto] = useState(false);
  
  const botoesFiltro = ["Todas", "Pendente", "Aprovado", "Rejeitado"];

  const justificativas = [
    {
      id: 1,
      nome: "João Silva",
      status: "Pendente",
      tipo: "Atraso",
      data: "17/06/2025",
      motivo: "O ônibus ficou paralisado devido a um acidente na avenida.",
    },
    {
      id: 2,
      nome: "Maria Santos",
      status: "Rejeitado",
      tipo: "Falta",
      data: "12/06/2025",
      motivo: "Consulta médica agendada.",
    },
  ];

  const justificativasFiltradas = justificativas.filter((item) => {
    if (filtroAtual === "Todas") return true;
    return item.status === filtroAtual;
  });

  return (
    <SafeAreaView style={estilo.screen}>
      <ScrollView contentContainerStyle={estilo.content}>
        <Text style={estilo.eyebrow}>ÁREA DA GESTÃO</Text>
        <Text style={estilo.pageTitle}>Análise de justificativas</Text>
        <Text style={estilo.pageSubtitle}>
          Analisar os motivos enviados e atualizar o status de cada solicitação
        </Text>

        {/* Menu Dropdown */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#2E8B57',
              backgroundColor: '#FFFFFF',
              padding: 14,
              borderRadius: menuAberto ? 0 : 8,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => setMenuAberto(!menuAberto)}
          >
            <Text style={{ color: '#23804F', fontWeight: 'bold', fontSize: 14 }}>
              Filtro Atual: {filtroAtual}
            </Text>
            <Text style={{ color: '#23804F', fontWeight: 'bold', fontSize: 12 }}>
              {menuAberto ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {menuAberto && (
            <View style={{
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: '#2E8B57',
              backgroundColor: '#FFFFFF',
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}>
              {botoesFiltro.map((nomeFiltro, index) => (
                <TouchableOpacity
                  key={nomeFiltro}
                  style={{
                    padding: 14,
                    borderBottomWidth: index === botoesFiltro.length - 1 ? 0 : 1, 
                    borderBottomColor: '#DCEBE2',
                    backgroundColor: filtroAtual === nomeFiltro ? '#DCEFE3' : '#FFFFFF'
                  }}
                  onPress={() => {
                    setFiltroAtual(nomeFiltro); // Atualiza o estado
                    setMenuAberto(false);       // Fecha o menu
                  }}
                >
                  <Text style={{
                    color: filtroAtual === nomeFiltro ? '#1A6B41' : '#163A2B',
                    fontWeight: filtroAtual === nomeFiltro ? 'bold' : 'normal'
                  }}>
                    {nomeFiltro}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Lista de Justificativas */}
        {justificativasFiltradas.map((item) => {
          const [bgStyle, textStyle] = badgeStyle(item.status);

          return (
            <View key={item.id} style={estilo.card}>
              <View style={estilo.cardHeaderRow}>
                <View style={estilo.row}>
                  <Text style={[estilo.text, { fontWeight: "bold", fontSize: 16, marginRight: 8 }]}>
                    {item.nome}
                  </Text>
                  <View style={[estilo.badge, bgStyle]}>
                    <Text style={[estilo.badgeText, textStyle]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={estilo.buttonGroup}>
                  <TouchableOpacity style={[estilo.buttonOutline, estilo.buttonSmall]}>
                    <Text style={estilo.buttonOutlineText}>Aprovar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[estilo.buttonDanger, estilo.buttonSmall]}>
                    <Text style={estilo.buttonDangerText}>Rejeitar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[estilo.textMuted, { marginBottom: 8 }]}>
                {item.tipo} - {item.data}
              </Text>
              <Text style={estilo.text}>{item.motivo}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}