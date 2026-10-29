import { StyleSheet } from 'react-native';

// Paleta do protótipo NoPonto (Escola Christus)
export const colors = {
  primary: '#23804F',
  primaryDark: '#1A6B41',
  primaryLight: '#DCEFE3',
  background: '#EEF6F1',
  surface: '#FFFFFF',
  border: '#2E8B57',
  divider: '#DCEBE2',

  text: '#163A2B',
  textMuted: '#5B7A6A',
  placeholder: '#8FA89A',

  warning: '#B7791F',
  warningBg: '#FFF4D6',
  warningBorder: '#E0A526',

  danger: '#B03030',
  dangerBg: '#FDE4E4',
  dangerBorder: '#D64545',

  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

const styles = StyleSheet.create({
  // ---------- Layout ----------
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },

  // ---------- Cabeçalho (Portal de frequência) ----------
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBrand: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  headerUser: {
    alignItems: 'flex-end',
    marginRight: spacing.sm,
  },
  headerUserName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  headerUserRole: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // ---------- Abas de navegação ----------
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // ---------- Tipografia ----------
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: 13,
    color: colors.text,
  },
  textMuted: {
    fontSize: 11,
    color: colors.textMuted,
  },
  link: {
    fontSize: 13,
    color: colors.text,
    textDecorationLine: 'underline',
  },

  // ---------- Cards ----------
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  // Card com "sombra" sólida deslocada (estilo do login e do card de horário)
  cardElevated: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderRightColor: colors.primary,
    borderBottomColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  listItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },

  // ---------- Relógio (tela inicial do aprendiz) ----------
  clock: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.text,
  },
  clockDate: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // ---------- Métricas / resumo ----------
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  // Cards de métrica do dashboard do gestor
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  metricCardHighlight: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginVertical: spacing.xs,
  },
  metricCaption: {
    fontSize: 9,
    color: colors.textMuted,
  },
  metricTextHighlight: {
    color: colors.white,
  },

  // ---------- Botões ----------
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    color: colors.primary,
    fontSize: 13,
  },
  buttonDanger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDangerText: {
    color: colors.danger,
    fontSize: 13,
  },
  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  // Sugestões rápidas (Relatórios com IA)
  chip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipText: {
    color: colors.primary,
    fontSize: 12,
  },

  // ---------- Seletor de perfil (Aprendiz / Gestor) e filtros ----------
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.primary,
    fontSize: 14,
  },
  segmentTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filter: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  filterActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.primary,
    fontSize: 13,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  // ---------- Formulários ----------
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  passwordWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.text,
  },
  passwordToggle: {
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  passwordToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textDecorationLine: 'underline',
  },
  // Aviso com barra lateral (ex.: "Recurso demonstrativo")
  notice: {
    backgroundColor: colors.background,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.md,
  },
  noticeText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // ---------- Badges de situação ----------
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeSuccess: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.border,
  },
  badgeSuccessText: {
    color: colors.text,
  },
  badgeWarning: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
  },
  badgeWarningText: {
    color: colors.warning,
  },
  badgeDanger: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },
  badgeDangerText: {
    color: colors.danger,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6,
  },

  // ---------- Tabelas (histórico / registros de ponto) ----------
  table: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
  },
  tableCellBold: {
    fontWeight: '700',
  },

  // ---------- Login ----------
  loginScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loginCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderRightColor: colors.primary,
    borderBottomColor: colors.primary,
    padding: spacing.xl,
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginTop: spacing.sm,
  },
  loginSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: spacing.md,
  },
  loginFooter: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  /////////////vitor///////////////////////////
  container: {
backgroundColor: '#FFFFFF', // Pinta só o cabeçalho de branco
    width: '100%', // Faz o bloco branco ir de uma ponta a outra da tela
    paddingTop: 10, // Afasta do relógio do celular
    paddingBottom: 8, // Dá um espaço embaixo do texto
    paddingLeft: 10, // Afasta da borda esquerda
    
    // A linha divisória:
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBE2',
 },
  negrito: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cinza: {
    color: 'gray',
    fontSize: 10,
    fontWeight: 'bold'
  },
  verde: {
color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    // Apague o textAlign: 'right'
    paddingLeft: 20, // Empurra o texto para a direita para alinhar com o de cima
    paddingTop: 10,
  },
    screen: {
    flex: 1,
    backgroundColor: '#EEF6F1'
  },
    preto: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 10
  },
    cinza1: {
    color: 'gray',
    fontSize: 14,
        paddingLeft: 20, // Empurra o texto para a direita para alinhar com o de cima
    paddingTop: -1,
  },
  card:{
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 20,
    padding: 20,
    elevation: 3
  },
      cinza2: {
    color: 'gray',
    fontSize: 12,
        paddingLeft: 20, // Empurra o texto para a direita para alinhar com o de cima
    paddingTop: -1,
  },
  botaoRegistrar: {
    backgroundColor: '#23804F', // A cor verde principal do protótipo
    borderRadius: 8,            // Cantos levemente arredondados
    paddingVertical: 14,        // Altura interna do botão
    alignItems: 'center',       // Centraliza o texto no meio horizontalmente
    marginTop: 20,              // Afasta o botão do relógio que está em cima
  },
  textoBotao: {
    color: '#FFFFFF',           // Texto branco para contrastar com o verde
    fontWeight: 'bold',
    fontSize: 16,
  },
  //status//
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePresente: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCEFE3', // Fundo verde claro
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  textoBadge: {
    color: '#23804F',           // Texto verde escuro
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,              // Espaço entre o ícone e o texto
  },
  linhaDeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  miniCard: {
    flex: 1, // Faz com que os três dividam o espaço igualmente de forma automática
    backgroundColor: '#F7FCF9', // Um verde bem clarinho de fundo
    borderWidth: 1,
    borderColor: '#DCEBE2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4, // Dá um pequeno espaçamento entre eles
  },
  numeroMiniCard: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#163A2B',
  },
  textoMiniCard: {
    fontSize: 12,
    color: '#5B7A6A',
    marginTop: 2,
  },
  botaoHistorico: {
    borderWidth: 1,
    borderColor: '#23804F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotaoHistorico: {
    color: '#23804F',
    fontWeight: 'bold',
    fontSize: 14,
  },
    // Cabeçalho interno do card (Título na esquerda, Botão na direita)
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  botaoVerTodas: {
    borderWidth: 1,
    borderColor: '#23804F',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  textoVerTodas: {
    color: '#23804F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Caixa do item de justificativa individual
  itemJustificativa: {
    borderWidth: 1,
    borderColor: '#DCEBE2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7FCF9',
  },
  // Selo de status Pendente (tons de amarelo/laranja suave)
  badgePendente: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  textoPendente: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: 'bold',
  },
    // Estilos da Tabela de Histórico de Ponto
  tabelaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DCEBE2',
  },
  tabelaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DCEBE2',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tabelaHeaderTexto: {
    fontWeight: 'bold',
    color: '#163A2B',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  tabelaLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F7F4',
  },
  tabelaColuna: {
    fontSize: 12,
    color: '#5B7A6A',
    flex: 1,
    textAlign: 'center',
  },
  // Selo de Atraso (amarelo)
  badgeAtraso: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignSelf: 'center',
  },
  textoAtraso: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// Mapeia a situação para o par de estilos do badge
export const badgeStyle = (status) => {
  switch (status) {
    case 'Presente':
    case 'Aprovado':
    case 'Ativo':
      return [styles.badgeSuccess, styles.badgeSuccessText];
    case 'Atraso':
    case 'Pendente':
      return [styles.badgeWarning, styles.badgeWarningText];
    case 'Ausente':
    case 'Falta':
    case 'Rejeitado':
      return [styles.badgeDanger, styles.badgeDangerText];
    default:
      return [styles.badgeSuccess, styles.badgeSuccessText];
  }
};

export default styles;
