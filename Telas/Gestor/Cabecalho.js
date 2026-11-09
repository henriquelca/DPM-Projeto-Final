import React from "react";
import { View, Text } from "react-native";
import estilo from "../../css";
import { useAuth } from "../../AuthContext";

export default function CabecalhoGestor() {
  const { perfil } = useAuth();

  return (
    <View style={[estilo.header, { paddingBottom: 12 }]}>
      <View>
        <Text style={estilo.headerBrand}>Escola Christus</Text>
        <Text style={estilo.headerTitle}>Portal de frequência</Text>
      </View>
      <View style={estilo.headerUser}>
        <Text style={estilo.headerUserName}>{perfil.nome}</Text>
        <Text style={estilo.headerUserRole}>Gestor(a)</Text>
      </View>
    </View>
  );
}
