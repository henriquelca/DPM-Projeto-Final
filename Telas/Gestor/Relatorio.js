import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import estilo, { colors } from "../../css";
import CabecalhoGestor from "./Cabecalho";
import {
  jornadasPorDia,
  situacaoEntrada,
  formatarHora,
  HORA_ENTRADA,
  TOLERANCIA_MINUTOS,
  LIMITE_HORAS_DIA,
} from "./frequencia";

const CHAVE_GEMINI = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODELO_GEMINI = process.env.EXPO_PUBLIC_GEMINI_MODEL || "gemini-flash-lite-latest";

const PERIODOS = [
  { dias: 7, rotulo: "Últimos 7 dias" },
  { dias: 30, rotulo: "Últimos 30 dias" },
  { dias: 90, rotulo: "Últimos 90 dias" },
];

const SUGESTOES = [
  { rotulo: "Analise atrasos recorrentes", texto: "Analise os atrasos recorrentes deste aprendiz." },
  { rotulo: "Resuma faltas e justificativas", texto: "Resuma as faltas e as justificativas enviadas." },
  {
    rotulo: "Avalie a evolução da frequência",
    texto: "Avalie a evolução da frequência no período e se há risco de excesso de carga horária.",
  },
];

async function perguntarAoGemini(pergunta) {
  const endereco =
    "https://generativelanguage.googleapis.com/v1beta/models/" + MODELO_GEMINI + ":generateContent";

  const resposta = await fetch(endereco, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": CHAVE_GEMINI },
    body: JSON.stringify({ contents: [{ parts: [{ text: pergunta }] }] }),
  });
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.error.message);
  }
  return dados.candidates[0].content.parts[0].text;
}

function montarPergunta(aprendiz, periodo, jornadas, justificativas, pedido, diasExcesso) {
  let texto = "";
  texto += "Você é um assistente da gestão da Escola Christus que analisa a frequência de jovens aprendizes.\n";
  texto += "Responda em português do Brasil, em texto simples (sem markdown), em no máximo 3 parágrafos curtos.\n";
  texto += "Regras: entrada esperada às " + HORA_ENTRADA + ":00 com " + TOLERANCIA_MINUTOS + " minutos de tolerância. ";
  texto += "Jornadas acima de " + LIMITE_HORAS_DIA + "h são excesso de carga horária (risco de burnout) e devem ser destacadas como ALERTA.\n";
  texto += "Considere apenas os dados abaixo. Se faltarem dados, diga isso.\n\n";

  texto += "Aprendiz: " + aprendiz.nome + " (matrícula " + aprendiz.matricula + ")\n";
  texto += "Período: " + periodo.rotulo + "\n";
  texto += "Dias com excesso de jornada: " + diasExcesso.length + "\n";

  texto += "Registros de ponto por dia:\n";
  if (jornadas.length === 0) {
    texto += "(nenhum registro no período)\n";
  }
  for (const jornada of jornadas) {
    let horas = "jornada incompleta";
    if (jornada.horas !== null) {
      horas = jornada.horas.toFixed(1) + "h";
    }
    texto += jornada.dia + ": entrada " + formatarHora(jornada.entrada);
    texto += ", saída " + formatarHora(jornada.saida);
    texto += ", " + horas + ", " + situacaoEntrada(jornada.entrada) + "\n";
  }

  texto += "Justificativas:\n";
  if (justificativas.length === 0) {
    texto += "(nenhuma)\n";
  }
  for (const justificativa of justificativas) {
    texto += justificativa.data + ": " + justificativa.motivo + " (" + justificativa.status + ")\n";
  }

  texto += "\nPedido da gestão: " + pedido;
  return texto;
}

export default function TelaGestorRelatorio() {
  const [aprendizes, setAprendizes] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [periodo, setPeriodo] = useState(PERIODOS[1]);
  const [pedido, setPedido] = useState("");
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    async function carregarAprendizes() {
      try {
        const consulta = query(collection(db, "usuarios"), where("tipo", "==", "aprendiz"));
        const resultadoConsulta = await getDocs(consulta);
        const lista = [];
        resultadoConsulta.forEach((documento) => {
          const aprendiz = documento.data();
          aprendiz.id = documento.id;
          lista.push(aprendiz);
        });
        setAprendizes(lista);
        if (lista.length > 0) {
          setSelecionado(lista[0]);
        }
      } catch (e) {
        setErro("Não foi possível carregar os aprendizes.");
      }
    }
    carregarAprendizes();
  }, []);

  async function gerarRelatorio() {
    setErro("");
    setResultado(null);

    if (selecionado === null) {
      setErro("Selecione um aprendiz.");
      return;
    }
    if (pedido.trim() === "") {
      setErro("Escreva o que deseja analisar ou toque numa sugestão.");
      return;
    }
    if (!CHAVE_GEMINI) {
      setErro("Falta EXPO_PUBLIC_GEMINI_API_KEY no arquivo .env.");
      return;
    }

    setGerando(true);
    try {
      const inicioDoPeriodo = new Date();
      inicioDoPeriodo.setDate(inicioDoPeriodo.getDate() - (periodo.dias - 1));
      inicioDoPeriodo.setHours(0, 0, 0, 0);

      const consultaPontos = query(collection(db, "pontos"), where("usuarioId", "==", selecionado.id));
      const resultadoPontos = await getDocs(consultaPontos);
      const pontos = [];
      resultadoPontos.forEach((documento) => {
        const ponto = documento.data();
        if (ponto.dataHora && ponto.dataHora.toDate() >= inicioDoPeriodo) {
          pontos.push(ponto);
        }
      });

      const consultaJustificativas = query(
        collection(db, "justificativas"),
        where("usuarioId", "==", selecionado.id),
      );
      const resultadoJustificativas = await getDocs(consultaJustificativas);
      const justificativas = [];
      resultadoJustificativas.forEach((documento) => {
        justificativas.push(documento.data());
      });

      const jornadas = jornadasPorDia(pontos);
      const diasExcesso = [];
      for (const jornada of jornadas) {
        if (jornada.horas !== null && jornada.horas > LIMITE_HORAS_DIA) {
          diasExcesso.push(jornada.dia);
        }
      }

      const pergunta = montarPergunta(selecionado, periodo, jornadas, justificativas, pedido, diasExcesso);
      const texto = await perguntarAoGemini(pergunta);

      setResultado({
        nome: selecionado.nome,
        periodo: periodo.rotulo,
        texto: texto,
        diasExcesso: diasExcesso,
        totalDias: jornadas.length,
      });
    } catch (e) {
      setErro("Erro ao gerar o relatório: " + e.message);
    }
    setGerando(false);
  }

  return (
    <SafeAreaView style={estilo.screen} edges={["top"]}>
      <CabecalhoGestor />
      <ScrollView contentContainerStyle={estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={estilo.eyebrow}>INTELIGÊNCIA DE FREQUÊNCIA</Text>
        <Text style={estilo.pageTitle}>Relatórios dos aprendizes</Text>
        <Text style={estilo.pageSubtitle}>
          Use a inteligência artificial para consolidar dados de frequência e identificar pontos
          de atenção.
        </Text>

        <View style={estilo.cardElevated}>
          <Text style={estilo.label}>Aprendiz</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={estilo.filters}>
              {aprendizes.length === 0 && (
                <Text style={estilo.textMuted}>Nenhum aprendiz cadastrado.</Text>
              )}
              {aprendizes.map((aprendiz) => {
                const ativo = selecionado !== null && selecionado.id === aprendiz.id;
                return (
                  <Pressable
                    key={aprendiz.id}
                    style={[estilo.filter, ativo && estilo.filterActive]}
                    onPress={() => setSelecionado(aprendiz)}
                  >
                    <Text style={[estilo.filterText, ativo && estilo.filterTextActive]}>
                      {aprendiz.nome} - {aprendiz.matricula}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Text style={estilo.label}>Período analisado</Text>
          <View style={[estilo.filters, { marginBottom: 12 }]}>
            {PERIODOS.map((opcao) => {
              const ativo = periodo.dias === opcao.dias;
              return (
                <Pressable
                  key={opcao.dias}
                  style={[estilo.filter, ativo && estilo.filterActive]}
                  onPress={() => setPeriodo(opcao)}
                >
                  <Text style={[estilo.filterText, ativo && estilo.filterTextActive]}>
                    {opcao.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={estilo.label}>O que você deseja analisar?</Text>
          <TextInput
            style={[estilo.input, estilo.textArea]}
            multiline
            placeholder="Ex.: Gere um relatório sobre atrasos recorrentes, faltas justificadas e evolução de frequência deste aprendiz."
            placeholderTextColor={colors.placeholder}
            value={pedido}
            onChangeText={setPedido}
          />

          <View style={[estilo.row, { flexWrap: "wrap" }]}>
            {SUGESTOES.map((sugestao) => (
              <Pressable
                key={sugestao.rotulo}
                style={estilo.chip}
                onPress={() => setPedido(sugestao.texto)}
              >
                <Text style={estilo.chipText}>{sugestao.rotulo}</Text>
              </Pressable>
            ))}
          </View>

          {erro !== "" && <Text style={{ color: colors.danger, marginVertical: 8 }}>{erro}</Text>}

          <Pressable
            style={[estilo.buttonPrimary, { marginTop: 8 }]}
            onPress={gerarRelatorio}
            disabled={gerando}
          >
            {gerando ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={estilo.buttonPrimaryText}>Gerar relatório com IA</Text>
            )}
          </Pressable>
        </View>

        {resultado !== null && (
          <View style={estilo.card}>
            {resultado.diasExcesso.length > 0 && (
              <View style={[estilo.badge, estilo.badgeDanger, { marginBottom: 12, padding: 8 }]}>
                <Text style={[estilo.badgeText, estilo.badgeDangerText]}>
                  ⚠ Alerta: {resultado.diasExcesso.length} dia(s) com jornada acima de{" "}
                  {LIMITE_HORAS_DIA}h ({resultado.diasExcesso.join(", ")})
                </Text>
              </View>
            )}
            <Text style={estilo.sectionTitle}>
              Relatório de {resultado.nome} ({resultado.periodo})
            </Text>
            <Text style={[estilo.textMuted, { marginBottom: 8 }]}>
              {resultado.totalDias} dia(s) com registro de ponto
            </Text>
            <Text style={estilo.text}>{resultado.texto}</Text>
          </View>
        )}

        <View style={estilo.notice}>
          <Text style={estilo.noticeText}>
            Os dados de ponto e justificativas do aprendiz selecionado são enviados ao Google
            Gemini para gerar o relatório. Revise o texto antes de tomar decisões.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
