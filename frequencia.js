import { colors } from "./css";

export const TOLERANCIA_MINUTOS = 5;
export const LIMITE_HORAS_DIA = 8;

export const NOMES_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const HORARIO_PADRAO = {
  horaEntrada: "08:00",
  horaSaida: "12:00",
  diasSemana: [1, 2, 3, 4, 5],
};

const UMA_HORA = 60 * 60 * 1000;

export function horarioDoAprendiz(aprendiz) {
  return {
    horaEntrada: aprendiz.horaEntrada || HORARIO_PADRAO.horaEntrada,
    horaSaida: aprendiz.horaSaida || HORARIO_PADRAO.horaSaida,
    diasSemana: aprendiz.diasSemana || HORARIO_PADRAO.diasSemana,
  };
}

export function horarioValido(texto) {
  return /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(texto);
}

export function minutosDoHorario(texto) {
  const partes = texto.split(":");
  return Number(partes[0]) * 60 + Number(partes[1]);
}

export function erroNoHorario(horaEntrada, horaSaida, diasSemana) {
  if (!horarioValido(horaEntrada) || !horarioValido(horaSaida)) {
    return "Digite os horários no formato HH:MM, por exemplo 08:00.";
  }
  if (minutosDoHorario(horaSaida) <= minutosDoHorario(horaEntrada)) {
    return "O horário de saída precisa ser depois do horário de entrada.";
  }
  if (diasSemana.length === 0) {
    return "Escolha pelo menos um dia de trabalho.";
  }
  return "";
}

export function descricaoHorario(aprendiz) {
  const horario = horarioDoAprendiz(aprendiz);
  const dias = [];
  for (const dia of horario.diasSemana) {
    dias.push(NOMES_DIAS[dia]);
  }
  return dias.join(", ") + " · " + horario.horaEntrada + " às " + horario.horaSaida;
}

export function trabalhaNoDia(aprendiz, data) {
  return horarioDoAprendiz(aprendiz).diasSemana.includes(data.getDay());
}

export function formatarHora(data) {
  if (data === null) {
    return "—";
  }
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function situacaoEntrada(entrada, aprendiz) {
  if (entrada === null) {
    return "Ausente";
  }
  const minutosDaEntrada = entrada.getHours() * 60 + entrada.getMinutes();
  const minutosLimite = minutosDoHorario(horarioDoAprendiz(aprendiz).horaEntrada) + TOLERANCIA_MINUTOS;
  if (minutosDaEntrada <= minutosLimite) {
    return "Presente";
  }
  return "Atraso";
}

export function situacaoDoDia(entrada, aprendiz, data) {
  if (entrada === null && !trabalhaNoDia(aprendiz, data)) {
    return "Folga";
  }
  return situacaoEntrada(entrada, aprendiz);
}

export function corDaSituacao(situacao) {
  if (situacao === "Presente") {
    return { fundo: colors.primaryLight, borda: colors.border, texto: colors.text };
  }
  if (situacao === "Atraso") {
    return { fundo: colors.warningBg, borda: colors.warningBorder, texto: colors.warning };
  }
  if (situacao === "Folga") {
    return { fundo: colors.surface, borda: colors.divider, texto: colors.textMuted };
  }
  return { fundo: colors.dangerBg, borda: colors.dangerBorder, texto: colors.danger };
}

export function jornadasPorDia(pontos) {
  const dias = {};

  for (const ponto of pontos) {
    if (!ponto.dataHora) {
      continue;
    }
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

export function diasDeFalta(aprendiz, jornadas, inicio) {
  const diasComEntrada = {};
  for (const jornada of jornadas) {
    if (jornada.entrada !== null) {
      diasComEntrada[jornada.dia] = true;
    }
  }

  const dia = new Date(inicio);
  dia.setHours(0, 0, 0, 0);
  if (aprendiz.criadoEm && aprendiz.criadoEm.toDate() > dia) {
    const criado = aprendiz.criadoEm.toDate();
    dia.setFullYear(criado.getFullYear(), criado.getMonth(), criado.getDate());
  }

  const agora = new Date();
  const hojeTexto = agora.toLocaleDateString("pt-BR");
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const minutosSaida = minutosDoHorario(horarioDoAprendiz(aprendiz).horaSaida);

  const faltas = [];
  while (dia <= agora) {
    const chave = dia.toLocaleDateString("pt-BR");
    const diaJaAcabou = chave !== hojeTexto || minutosAgora > minutosSaida;
    if (trabalhaNoDia(aprendiz, dia) && !diasComEntrada[chave] && diaJaAcabou) {
      faltas.push(chave);
    }
    dia.setDate(dia.getDate() + 1);
  }
  return faltas;
}

export function resumoDoMes(aprendiz, pontos) {
  const agora = new Date();
  const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const jornadas = jornadasPorDia(pontos);

  let presencas = 0;
  let atrasos = 0;
  for (const jornada of jornadas) {
    if (jornada.entrada !== null && jornada.data >= inicioDoMes) {
      presencas++;
      if (situacaoEntrada(jornada.entrada, aprendiz) === "Atraso") {
        atrasos++;
      }
    }
  }

  const faltas = diasDeFalta(aprendiz, jornadas, inicioDoMes).length;
  return { presencas, atrasos, faltas };
}
