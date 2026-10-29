import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';   //não usado
import styles, { badgeStyle, colors } from '../../css'; 

export default function TelaAprendizInicio({ navigation }) {
  // Cria o estado que guarda a data e hora atual do dispositivo
  const [dataAtual, setDataAtual] = useState(new Date());

  // Cria o temporizador que atualiza a hora a cada 1 segundo
  useEffect(() => {
    const temporizador = setInterval(() => {
      setDataAtual(new Date());
    }, 1000);
    return () => clearInterval(temporizador);
  }, []);

  // Formata apenas as horas e minutos (ex: "19:03")
  const horaFormatada = dataAtual.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Formata o dia da semana e o mês (ex: "quarta-feira, 28 de outubro")
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });
  ///////////////////////////////////
// Cria o estado para controlar se o ponto foi registado (começa como falso)
  const [pontoRegistrado, setPontoRegistrado] = useState(false);

  return (
//cabeçalho
<View style={styles.screen}>
      <View style={styles.container}>
        
        <View>
          <Text style={styles.cinza}>ESCOLA CHRISTUS</Text>
          <Text style={styles.negrito}>Portal Frequencia</Text>
        </View>
      </View>

        {/* parte 2 pre card*/}
            <Text style={styles.verde}>Área do aprendiz</Text>
            <Text style={styles.preto}>Bom dia,[nome]</Text>
            <Text style={styles.cinza1}>Registre e acompanhe aqui sua jornada</Text>

                    {/* parte 3 card*/}
            <View style ={styles.card}>
<View style={styles.rowBetween}>
            <Text style={styles.cinza2}>Horário atual</Text>
            
            {/* O selo SÓ APARECE se pontoRegistrado for true */}
            {pontoRegistrado && (
              <View style={styles.badgePresente}> 
                <Ionicons name="checkmark-circle" size={14} color="#23804F" />
                <Text style={styles.textoBadge}>Presente</Text>
              </View>
            )}
          </View>

            <Text style={{fontSize:30,fontWeight: 'bold', color: '#163A2B'}}>{horaFormatada}</Text>
            <Text style={{ fontSize: 14, color: '#5B7A6A', textTransform: 'capitalize' }}>{dataFormatada}</Text>

                    {/* Botão*/}
<TouchableOpacity 
            style={styles.botaoRegistrar} 
            onPress={() => {
              // Muda o estado para verdadeiro, o que faz o selo aparecer magicamente!
              setPontoRegistrado(true);
              
              // TODO: Futuramente, aqui enviarás os dados para o banco de dados
              alert('Presença registada com sucesso!');
            }}
          >
            <Text style={styles.textoBotao}>Registrar entrada</Text>
          </TouchableOpacity>
             </View>
    </View>
  );
};