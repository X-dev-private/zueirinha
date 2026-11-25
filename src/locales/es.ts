import type { Traducao } from './pt'

// Español
const es: Traducao = {
  titulo: 'Cara o Cruz',
  subtitulo: 'Que decida la suerte, sin peleas ✨',
  lado: { cara: 'Cara', coroa: 'Cruz' },
  voce: 'Tú',

  modo: {
    rotulo: 'Modo de juego',
    local: '🎲 Entre amigos',
    cripto: '💎 Apostando ETH',
  },

  jogadores: {
    quemCara: '🙂 Quién es Cara',
    quemCoroa: '👑 Quién es Cruz',
    nome: 'Nombre',
    aposta: '🎁 Qué se apuesta (opcional)',
    apostaExemplo: 'Ej.: quién paga la merienda',
  },
  multiplicador: { rotulo: 'Número de lanzamientos' },
  jogar: {
    botao: 'Lanzar la moneda 🪙',
    girando: 'Girando...',
    preencha: 'Completa los dos nombres para jugar',
  },
  placar: { titulo: 'Marcador', zerar: '↺ Reiniciar marcador' },
  historico: { titulo: 'Últimas jugadas', fechar: 'Cerrar', empate: '🤝 Empate' },

  resultado: {
    jogando: 'Lanzando la moneda...',
    jogandoVezes: 'Lanzando la moneda {{count}} veces...',
    blockchain: 'Lanzando la moneda en la blockchain... ⛓️',
    pronto: '¡Todo listo! Haz clic en "Lanzar la moneda".',
    comecar: 'Escribe quién es Cara y quién es Cruz para empezar.',
    vazioCripto: 'Crea una apuesta o únete a una abierta. ¡Cuando se lance la moneda, girará aquí! 🪙',
    empate: '¡Empate! 🤝',
    venceu: '¡{{nome}} gana! 🎉',
    caiuEm: 'La moneda cayó en <b>{{lado}}</b>.',
    ninguemLeva: 'Nadie se lleva <b>{{aposta}}</b>. ¡Lancen de nuevo para desempatar!',
    leva: '¡<b>{{nome}}</b> se lleva <b>{{aposta}}</b>!',
    emJogadas: 'En <b>{{count}}</b> lanzamientos, la moneda cayó:',
  },

  carteira: {
    instalar: 'Instalar billetera',
    instalarTitulo: 'Instala una billetera (ej.: MetaMask) para conectar',
    instalarUma: 'Instalar una billetera',
    conectar: 'Conectar billetera',
    conectando: 'Conectando...',
    abrirPainel: 'Abrir panel de la billetera',
    desconectar: 'Desconectar',
  },

  painel: {
    titulo: '💎 Contrato de depósito',
    redeOk: '● Sepolia (prueba)',
    redeErrada: '● Red incorrecta',
    trocarRede:
      'Este contrato está en la red <b>Sepolia</b> (de pruebas). Cambia la red de tu billetera para continuar.',
    trocarBotao: 'Cambiar a Sepolia',
    naCarteira: 'En la billetera',
    noContrato: 'En el contrato',
    semEth: '¿Sin ETH de prueba? Consíguelo gratis en un <link>faucet de Sepolia</link>.',
    abaDepositar: '⬇️ Depositar',
    abaSacar: '⬆️ Retirar',
    valor: 'Monto',
    sacarTudo: 'Retirar todo',
    taxa: 'Comisión del contrato ({{pct}}%)',
    vaiParaSaldo: 'Va a tu saldo',
    aguarde: 'Espera...',
    depositar: 'Depositar',
    sacar: 'Retirar',
  },

  validacao: {
    invalido: 'Monto inválido',
    maiorQueZero: 'El monto debe ser mayor que cero',
    maisQueCarteira: 'Más de lo que tienes en la billetera',
    maisQueContrato: 'Más de lo que tienes en el contrato',
  },

  apostas: {
    intro:
      'Apuesta <b>ETH de prueba</b> contra otra billetera. La moneda la lanza el propio contrato, en la blockchain, y nadie puede hacer trampa.',
    redeErrada:
      'Las apuestas ocurren en la red <b>Sepolia</b> (de pruebas). Cambia la red de tu billetera.',
    saldo: 'Saldo para apostar: <b>{{saldo}}</b>',
    depositar: '⬇️ Depositar',
    valorRotulo: 'Monto de la apuesta en ETH',
    valor: 'Monto',
    seuLado: 'Tu lado',
    criar: 'Crear apuesta',
    criando: 'Creando...',
    titulo: 'Apuestas',
    filtroTodas: 'Todas',
    filtroMinhas: 'Mías',
    nenhumaMinha: 'Todavía no tienes apuestas.',
    nenhuma: 'Todavía no hay apuestas. ¡Crea la primera! ✨',
    aguardando: 'esperando…',
    status: {
      aberta: 'Abierta',
      'em-jogo': 'En juego',
      resolvida: 'Resuelta',
      cancelada: 'Cancelada',
      reembolsada: 'Devuelta',
    },
    cancelar: 'Cancelar',
    saldoNaoCobre: 'Tu saldo en el contrato no cubre esta apuesta',
    depositarParaEntrar: 'Depositar para unirte',
    entrarCom: 'Unirse con {{emoji}}',
    reembolsar: 'Reembolsar',
    jogarMoeda: '🪙 Lanzar la moneda',
    proximoBloco: '⏳ próximo bloque…',
    devolverAbrir: '🤝 Devolver al perdedor (solo por deporte)',
    quantoDevolver: 'Cuánto devolver en ETH',
    devolver: 'Devolver',
    cancelarDevolucao: 'Cancelar devolución',
    devolvido: '🤝 {{valor}} ETH devuelto al perdedor',
    premio: '{{valor}} ETH (apuesta #{{id}})',
  },

  tx: {
    assinando: '✍️ Confirma la transacción en tu billetera...',
    confirmando: '⏳ ¡Enviada! Esperando que la red confirme…',
    verEtherscan: 'ver en Etherscan',
    acoes: {
      deposito: 'Depósito confirmado',
      saque: 'Retiro confirmado',
      apostaCriada: 'Apuesta creada',
      entrouAposta: 'Te uniste a la apuesta',
      moedaJogada: 'Moneda lanzada',
      apostaCancelada: 'Apuesta cancelada',
      valorDevolvido: 'Monto devuelto',
    },
  },

  erros: {
    semCarteira: 'No se encontró ninguna billetera',
    cancelado: 'Cancelado en la billetera',
    pedidoAberto: 'Ya hay una solicitud pendiente en tu billetera, échale un vistazo',
    semGas: 'Saldo insuficiente para el monto + comisión de la red (gas)',
    generico: 'Algo salió mal. Inténtalo de nuevo.',
    contrato: {
      InsufficientBalance: 'Saldo insuficiente en el contrato. Deposita más desde tu billetera.',
      ZeroAmount: 'El monto debe ser mayor que cero',
      BetNotOpen: 'Esta apuesta ya no está abierta',
      BetNotJoined: 'Esta apuesta no está esperando el lanzamiento',
      NotBetCreator: 'Solo quien creó la apuesta puede cancelarla',
      CannotJoinOwnBet: 'No puedes unirte a tu propia apuesta',
      TooEarly: 'Todavía es pronto: espera el próximo bloque para lanzar la moneda',
      NotBetWinner: 'Solo quien ganó puede devolver',
      BetNotResolved: 'La apuesta todavía no se resolvió',
      ReturnTooHigh: 'No puedes devolver más de lo que apostó el perdedor',
      TransferFailed: 'La transferencia falló',
    },
  },
}

export default es
