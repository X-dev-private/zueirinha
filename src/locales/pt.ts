// Textos em português (língua base). Para adicionar uma língua, copie este
// arquivo, traduza os valores e registre-o em src/i18n.ts.
//
// <b>...</b> e <link>...</link> viram negrito / link na tela.
// {{nome}} é trocado pelo valor na hora.
const pt = {
  titulo: 'Cara ou Coroa',
  subtitulo: 'Decidam na sorte, sem brigas ✨',
  lado: { cara: 'Cara', coroa: 'Coroa' },
  voce: 'Você',

  modo: {
    rotulo: 'Modo de jogo',
    local: '🎲 Entre amigos',
    cripto: '💎 Valendo ETH',
  },

  jogadores: {
    quemCara: '🙂 Quem é Cara',
    quemCoroa: '👑 Quem é Coroa',
    nome: 'Nome',
    aposta: '🎁 O que está sendo apostado (opcional)',
    apostaExemplo: 'Ex.: quem paga o lanche',
  },
  multiplicador: { rotulo: 'Multiplicador de partidas' },
  jogar: {
    botao: 'Jogar a moeda 🪙',
    girando: 'Girando...',
    preencha: 'Preencha os dois nomes para jogar',
  },
  placar: { titulo: 'Placar', zerar: '↺ Zerar placar' },
  historico: { titulo: 'Últimas jogadas', fechar: 'Fechar', empate: '🤝 Empate' },

  resultado: {
    jogando: 'Jogando a moeda...',
    jogandoVezes: 'Jogando a moeda {{count}} vezes...',
    blockchain: 'Jogando a moeda na blockchain... ⛓️',
    pronto: 'Tudo pronto! Clique em "Jogar a moeda".',
    comecar: 'Coloque o nome de quem é Cara e de quem é Coroa para começar.',
    vazioCripto: 'Crie uma aposta ou entre numa aberta. Quando a moeda for jogada, ela gira aqui! 🪙',
    empate: 'Deu empate! 🤝',
    venceu: '{{nome}} venceu! 🎉',
    caiuEm: 'A moeda caiu em <b>{{lado}}</b>.',
    ninguemLeva: 'Ninguém leva <b>{{aposta}}</b>. Joguem de novo para desempatar!',
    leva: '<b>{{nome}}</b> leva <b>{{aposta}}</b>!',
    emJogadas: 'Em <b>{{count}}</b> jogadas, a moeda caiu:',
  },

  carteira: {
    instalar: 'Instalar carteira',
    instalarTitulo: 'Instale uma carteira (ex.: MetaMask) para conectar',
    instalarUma: 'Instalar uma carteira',
    conectar: 'Conectar carteira',
    conectando: 'Conectando...',
    abrirPainel: 'Abrir painel da carteira',
    desconectar: 'Desconectar',
  },

  painel: {
    titulo: '💎 Contrato de depósito',
    redeOk: '● Sepolia (teste)',
    redeErrada: '● Rede errada',
    trocarRede:
      'Esse contrato fica na rede <b>Sepolia</b> (de testes). Troque a rede da sua carteira para continuar.',
    trocarBotao: 'Trocar para Sepolia',
    naCarteira: 'Na carteira',
    noContrato: 'No contrato',
    semEth: 'Sem ETH de teste? Pegue de graça numa <link>torneira da Sepolia</link>.',
    abaDepositar: '⬇️ Depositar',
    abaSacar: '⬆️ Sacar',
    valor: 'Valor',
    sacarTudo: 'Sacar tudo',
    taxa: 'Taxa do contrato ({{pct}}%)',
    vaiParaSaldo: 'Vai para seu saldo',
    aguarde: 'Aguarde...',
    depositar: 'Depositar',
    sacar: 'Sacar',
  },

  validacao: {
    invalido: 'Valor inválido',
    maiorQueZero: 'O valor precisa ser maior que zero',
    maisQueCarteira: 'Mais do que você tem na carteira',
    maisQueContrato: 'Mais do que você tem no contrato',
  },

  apostas: {
    intro:
      'Aposte <b>ETH de teste</b> contra outra carteira. A moeda é jogada pelo próprio contrato, na blockchain, e ninguém consegue roubar.',
    redeErrada:
      'As apostas acontecem na rede <b>Sepolia</b> (de testes). Troque a rede da sua carteira.',
    saldo: 'Saldo para apostar: <b>{{saldo}}</b>',
    depositar: '⬇️ Depositar',
    valorRotulo: 'Valor da aposta em ETH',
    valor: 'Valor',
    seuLado: 'Seu lado',
    criar: 'Criar aposta',
    criando: 'Criando...',
    titulo: 'Apostas',
    filtroTodas: 'Todas',
    filtroMinhas: 'Minhas',
    nenhumaMinha: 'Você ainda não tem apostas.',
    nenhuma: 'Nenhuma aposta ainda. Crie a primeira! ✨',
    aguardando: 'aguardando…',
    status: {
      aberta: 'Aberta',
      'em-jogo': 'Em jogo',
      resolvida: 'Resolvida',
      cancelada: 'Cancelada',
      reembolsada: 'Devolvida',
    },
    cancelar: 'Cancelar',
    saldoNaoCobre: 'Seu saldo no contrato não cobre essa aposta',
    depositarParaEntrar: 'Depositar p/ entrar',
    entrarCom: 'Entrar com {{emoji}}',
    reembolsar: 'Reembolsar',
    jogarMoeda: '🪙 Jogar a moeda',
    proximoBloco: '⏳ próximo bloco…',
    devolverAbrir: '🤝 Devolver ao perdedor (só pelo esporte)',
    quantoDevolver: 'Quanto devolver em ETH',
    devolver: 'Devolver',
    cancelarDevolucao: 'Cancelar devolução',
    devolvido: '🤝 {{valor}} ETH devolvido ao perdedor',
    premio: '{{valor}} ETH (aposta #{{id}})',
  },

  tx: {
    assinando: '✍️ Confirme a transação na sua carteira...',
    confirmando: '⏳ Enviada! Esperando a rede confirmar…',
    verEtherscan: 'ver no Etherscan',
    acoes: {
      deposito: 'Depósito confirmado',
      saque: 'Saque confirmado',
      apostaCriada: 'Aposta criada',
      entrouAposta: 'Você entrou na aposta',
      moedaJogada: 'Moeda jogada',
      apostaCancelada: 'Aposta cancelada',
      valorDevolvido: 'Valor devolvido',
    },
  },

  erros: {
    semCarteira: 'Nenhuma carteira encontrada',
    cancelado: 'Cancelado na carteira',
    pedidoAberto: 'Já tem um pedido aberto na carteira, dá uma olhada lá',
    semGas: 'Saldo insuficiente para o valor + taxa da rede (gás)',
    generico: 'Algo deu errado. Tente de novo.',
    contrato: {
      InsufficientBalance: 'Saldo insuficiente no contrato. Deposite mais pela carteira.',
      ZeroAmount: 'O valor precisa ser maior que zero',
      BetNotOpen: 'Essa aposta não está mais aberta',
      BetNotJoined: 'Essa aposta não está esperando a moeda',
      NotBetCreator: 'Só quem criou a aposta pode cancelar',
      CannotJoinOwnBet: 'Você não pode entrar na sua própria aposta',
      TooEarly: 'Ainda cedo: espere o próximo bloco para jogar a moeda',
      NotBetWinner: 'Só quem venceu pode devolver',
      BetNotResolved: 'A aposta ainda não foi resolvida',
      ReturnTooHigh: 'Não dá para devolver mais do que o perdedor apostou',
      TransferFailed: 'A transferência falhou',
    },
  },
}

export default pt
export type Traducao = typeof pt
