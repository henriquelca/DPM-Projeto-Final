import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import estilo from "../../css";
export default function TelaGestorUsuario({ route }) {
  const usuarios = [
    {
      nome: "João Silva",
      matricula: "2025001",
      email: "joao.silva@christus.edu.br",
    },
    {
      nome: "Maria Santos",
      matricula: "2025002",
      email: "maria.santos@christus.edu.br",
    },
    {
      nome: "Pedro Lima",
      matricula: "2025003",
      email: "pedro.lima@christus.edu.br",
    },
  ];
  return (
    <View style={estilo.screen}>
      <View style={estilo.header}>
        <View>
          <Text style={estilo.headerBrand}>Escola Christus</Text>
          <Text style={estilo.headerTitle}>Portal de Frequência</Text>
        </View>
        <View style={estilo.row}>
          <View style={estilo.headerUser}>
            <Text style={estilo.headerUserName}>Mariana Souza</Text>
            <Text style={estilo.headerUserRole}>Gestor(a)</Text>
          </View>
          <View>
            <Pressable style={estilo.buttonOutline}>
              <Text style={estilo.buttonOutlineText}>Sair</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={estilo.tabs}>
        {[
          "Dashboard",
          "Registrar Ponto",
          "Justificativas",
          "Usuários",
          "Relatório",
        ].map((aba) => (
          <Pressable
            key={aba}
            style={[estilo.tab, aba === "Usuários" && estilo.tabActive]}
            onPress={() => console.log(aba)}
          >
            <Text
              style={[
                estilo.tabText,
                aba === "Usuários" && estilo.tabTextActive,
              ]}
            >
              {aba}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={estilo.content}>
        <View style={estilo.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={estilo.eyebrow}>Área da Gestão</Text>
            <Text style={estilo.pageTitle}>Cadastro de Usuários</Text>
            <Text style={estilo.pageSubtitle}>
              Crie o acesso dos aprendizes e consulte as contas já cadastradas.
            </Text>
          </View>
          <Pressable
            style={estilo.buttonPrimary}
            onPress={() => console.log("Adicionar Usuário")}
          >
            <Text style={estilo.buttonPrimaryText}>Adicionar Usuário</Text>
          </Pressable>
        </View>
        <View style={[estilo.card, { padding: 0 }]}>
          <View style={[estilo.cardHeader, { padding: 16, marginBottom: 0 }]}>
            <View>
              <Text style={estilo.sectionTitle}>Usuários cadastrados</Text>
              <Text style={estilo.sectionSubtitle}>
                {usuarios.length} contas ativas
              </Text>
            </View>
          </View>
          {usuarios.map((usuario, index) => (
            <View
              key={usuario.matricula}
              style={[
                estilo.listItem,
                { paddingHorizontal: 16 },
                index === usuarios.length - 1 && estilo.listItemLast,
              ]}
            >
              <View style={[estilo.rowBetween, { alignItems: "flex-start" }]}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[estilo.text, { fontWeight: "800" }]}>
                    {usuario.nome}
                  </Text>

                  <Text style={[estilo.textMuted, { marginTop: 4 }]}>
                    Matrícula {usuario.matricula}
                  </Text>

                  <Text style={estilo.textMuted}>{usuario.email}</Text>
                </View>
                <View style={[estilo.badge, estilo.badgeSuccess]}>
                  <Text style={[estilo.badgeText, estilo.badgeSuccessText]}>
                    Ativo
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
