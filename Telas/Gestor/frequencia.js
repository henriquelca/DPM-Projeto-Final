import { colors } from "../../css";

export const HORA_ENTRADA = 8;
export const TOLERANCIA_MINUTOS = 10;
export const LIMITE_HORAS_DIA = 8;

const UMA_HORA = 60 * 60 * 1000;

export function formatarHora(data) {
  if (data === null) {
    return "—";
  }
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function situacaoEntrada(entrada) {
  if (entrada === null) {
    return "Ausente";
  }
  const minutosDaEntrada = entrada.getHours() * 60 + entrada.getMinutes();
  const minutosLimite = HORA_ENTRADA * 60 + TOLERANCIA_MINUTOS;
  if (minutosDaEntrada <= minutosLimite) {
    return "Presente";
  }
  return "Atraso";
}

export function corDaSituacao(situacao) {
  if (situacao === "Presente") {
    return { fundo: colors.primaryLight, borda: colors.border, texto: colors.text };
  }
  if (situacao === "Atraso") {
    return { fundo: colors.warningBg, borda: colors.warningBorder, texto: colors.warning };
  }
  return { fundo: colors.dangerBg, borda: colors.dangerBorder, texto: colors.danger };
}

export function jornadasPorDia(pontos) {
  const dias = {};

  for (const ponto of pontos) {
    const quando = ponto.dataHora.toDate();
    const chave = quando.toLocaleDateString("pt-BR");

    if (dias[chave] === undefined) {
      dias[chave] = { dia: chave, data: quando, entrada: null, saida: null, horas: null };
    }
    const dia = dias[chave];

    if (ponto.tipo === "entrada") {
      if (dia.entrada === null || quando < dia.entrada) {
        dia.entrada = quando;
      }
    }
    if (ponto.tipo === "saida") {
      if (dia.saida === null || quando > dia.saida) {
        dia.saida = quando;
      }
    }
  }

  const lista = Object.values(dias);
  for (const dia of lista) {
    if (dia.entrada !== null && dia.saida !== null) {
      dia.horas = (dia.saida - dia.entrada) / UMA_HORA;
    }
  }
  lista.sort((a, b) => a.data - b.data);
  return lista;
}
