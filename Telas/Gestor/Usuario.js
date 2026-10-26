import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import estilo from "../../css";
export default function TelaGestorUsuario({ route }) {
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
      </ScrollView>
    </View>
  );
}
