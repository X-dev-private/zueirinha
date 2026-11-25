// Contrato FeeVault na rede Sepolia (rede de testes do Ethereum)
// Código verificado: https://sepolia.etherscan.io/address/0xEca4543ef3933746faBb4e4E9f0b221b9CEBf0a4#code
//
//   deposit() / withdraw(valor)       -> guarda/saca ETH (o depósito paga `feeBps` de taxa)
//   createBet(valor, lado)            -> cria aposta com o saldo que você tem no contrato
//   joinBet(id)                       -> entra numa aposta aberta (fica com o outro lado)
//   resolveBet(id)                    -> joga a moeda (qualquer um, após o bloco de resolução)
//   cancelBet(id)                     -> quem criou cancela, se ninguém entrou
//   returnToLoser(id, valor)          -> vencedor devolve parte/tudo ao perdedor
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Contract, Web3 } from 'web3'
import i18n from '../i18n'
import { ABI_FEE_VAULT } from './abiFeeVault'
import { encurtarEndereco, mensagemDeErro, obterWeb3, pedirCarteira } from './carteira'
import type { Lado, Rodada } from './jogo'

export const ENDERECO_CONTRATO = '0xEca4543ef3933746faBb4e4E9f0b221b9CEBf0a4'

export const SEPOLIA = {
  id: 11155111,
  hex: '0xaa36a7',
  nome: 'Sepolia',
  rpc: 'https://ethereum-sepolia-rpc.publicnode.com',
  explorador: 'https://sepolia.etherscan.io',
  torneira: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
}

// Quantas apostas recentes mostramos
const APOSTAS_RECENTES = 15
// De quanto em quanto tempo atualizamos (um bloco da Sepolia sai a cada ~12s)
const INTERVALO_MS = 8000

type ContratoFeeVault = Contract<typeof ABI_FEE_VAULT>

// ---------- Conversão ETH <-> wei (1 ETH = 10^18 wei), sem perder precisão ----------
const WEI_POR_ETH = 10n ** 18n

// "0,05" -> 50000000000000000n  (null se o texto não for um número válido)
export function lerEth(texto: string): bigint | null {
  const t = texto.trim().replace(',', '.')
  if (t === '' || t === '.' || !/^\d*\.?\d*$/.test(t)) return null
  const [inteiro, decimal = ''] = t.split('.')
  if (decimal.length > 18) return null
  return BigInt(inteiro || '0') * WEI_POR_ETH + BigInt(decimal.padEnd(18, '0'))
}

// 50000000000000000n -> "0.05"
export function formatarEth(wei: bigint, casas = 6): string {
  const inteiro = wei / WEI_POR_ETH
  const decimal = (wei % WEI_POR_ETH)
    .toString()
    .padStart(18, '0')
    .slice(0, casas)
    .replace(/0+$/, '')
  return decimal ? `${inteiro}.${decimal}` : inteiro.toString()
}

export function mesmoEndereco(a: string | null | undefined, b: string | null | undefined) {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase()
}

// ---------- Apostas ----------
export type StatusAposta = 'aberta' | 'em-jogo' | 'resolvida' | 'cancelada' | 'reembolsada'
const STATUS: StatusAposta[] = [
  'aberta',
  'aberta',
  'em-jogo',
  'resolvida',
  'cancelada',
  'reembolsada',
]

export type Aposta = {
  id: number
  criador: string
  oponente: string | null
  valor: bigint
  ladoCriador: Lado
  status: StatusAposta
  blocoResolucao: bigint
  vencedor: string | null
  devolvido: bigint
}

export const outroLado = (l: Lado): Lado => (l === 'cara' ? 'coroa' : 'cara')

// Lado em que a moeda caiu (só para apostas resolvidas)
export function ladoResultado(a: Aposta): Lado | null {
  if (a.status !== 'resolvida' || !a.vencedor) return null
  return mesmoEndereco(a.vencedor, a.criador) ? a.ladoCriador : outroLado(a.ladoCriador)
}

const ZERO = '0x0000000000000000000000000000000000000000'

function converterAposta(id: number, b: Record<string, unknown>): Aposta {
  const oponente = String(b.opponent)
  const vencedor = String(b.winner)
  return {
    id,
    criador: String(b.creator),
    oponente: oponente === ZERO ? null : oponente,
    valor: BigInt(b.amount as bigint),
    ladoCriador: Number(b.creatorSide) === 0 ? 'cara' : 'coroa',
    status: STATUS[Number(b.status)] ?? 'aberta',
    blocoResolucao: BigInt(b.resolveBlock as bigint),
    vencedor: vencedor === ZERO ? null : vencedor,
    devolvido: BigInt(b.returned as bigint),
  }
}

// Leituras vão por um nó público da Sepolia: não incomodam a carteira e
// funcionam mesmo se ela estiver em outra rede.
let leituraPromessa: Promise<{
  web3: Web3
  contrato: ContratoFeeVault
}> | null = null
function obterLeitura() {
  leituraPromessa ??= import('web3').then(({ Web3 }) => {
    const web3 = new Web3(SEPOLIA.rpc)
    return {
      web3,
      contrato: new web3.eth.Contract(ABI_FEE_VAULT, ENDERECO_CONTRATO),
    }
  })
  return leituraPromessa
}

export async function lerAposta(id: number): Promise<Aposta> {
  const { contrato } = await obterLeitura()
  const b = await contrato.methods.bets(id).call()
  return converterAposta(id, b as unknown as Record<string, unknown>)
}

// ---------- Transações ----------
export type Origem = 'carteira' | 'apostas'

export type EstadoTx =
  | { estado: 'parado' }
  | { estado: 'assinando'; origem: Origem; acao: string }
  | { estado: 'confirmando'; origem: Origem; acao: string; hash: string }
  | { estado: 'ok'; origem: Origem; acao: string; hash: string }
  | {
      estado: 'erro'
      origem: Origem
      acao: string
      mensagem: string
      hash?: string
    }

type EnvioTx = ReturnType<ReturnType<ContratoFeeVault['methods']['deposit']>['send']>

// ---------- Hook ----------
export function useContrato(conta: string | null, aoResolverAposta?: (a: Aposta) => void) {
  const [rede, setRede] = useState<number | null>(null)
  const [saldoCarteira, setSaldoCarteira] = useState<bigint | null>(null)
  const [saldoContrato, setSaldoContrato] = useState<bigint | null>(null)
  const [taxaBps, setTaxaBps] = useState<bigint | null>(null)
  const [apostas, setApostas] = useState<Aposta[]>([])
  const [bloco, setBloco] = useState<bigint | null>(null)
  const [tx, setTx] = useState<EstadoTx>({ estado: 'parado' })

  const naRedeCerta = rede === SEPOLIA.id

  // Último status visto de cada aposta, para perceber quando uma é resolvida
  const statusVistos = useRef(new Map<number, StatusAposta>())
  const aoResolverRef = useRef(aoResolverAposta)
  useEffect(() => {
    aoResolverRef.current = aoResolverAposta
  })

  // Rede em que a carteira está
  useEffect(() => {
    const eth = window.ethereum
    if (!eth) return
    const aoTrocarRede = (id: string) => setRede(Number(id))
    obterWeb3()
      .then((web3) => web3.eth.getChainId())
      .then((id) => setRede(Number(id)))
      .catch(() => {})
    eth.on('chainChanged', aoTrocarRede)
    return () => eth.removeListener('chainChanged', aoTrocarRede)
  }, [conta])

  // Lê tudo do contrato de uma vez
  const recarregar = useCallback(async () => {
    const { web3, contrato } = await obterLeitura()
    const [blocoAtual, taxa, proximoId] = await Promise.all([
      web3.eth.getBlockNumber(),
      contrato.methods.feeBps().call(),
      contrato.methods.nextBetId().call(),
    ])
    const total = Number(proximoId)
    const ids = Array.from({ length: Math.min(total, APOSTAS_RECENTES) }, (_, i) => total - 1 - i)
    const [lidas, naCarteira, noContrato] = await Promise.all([
      Promise.all(ids.map(lerAposta)),
      conta ? web3.eth.getBalance(conta) : null,
      conta ? contrato.methods.balanceOf(conta).call() : null,
    ])
    setBloco(BigInt(blocoAtual))
    setTaxaBps(BigInt(taxa as unknown as bigint))
    setApostas(lidas)
    for (const a of lidas) {
      const antes = statusVistos.current.get(a.id)
      statusVistos.current.set(a.id, a.status)
      if (antes === 'em-jogo' && a.status === 'resolvida') aoResolverRef.current?.(a)
    }
    setSaldoCarteira(naCarteira === null ? null : BigInt(naCarteira))
    setSaldoContrato(noContrato === null ? null : BigInt(noContrato as unknown as bigint))
  }, [conta])

  // Atualiza ao conectar e depois periodicamente (só com a aba visível)
  useEffect(() => {
    const atualizar = () => {
      if (document.visibilityState === 'visible') recarregar().catch(() => {})
    }
    const primeira = setTimeout(atualizar, 0)
    const t = setInterval(atualizar, INTERVALO_MS)
    return () => {
      clearTimeout(primeira)
      clearInterval(t)
    }
  }, [recarregar])

  async function trocarParaSepolia() {
    try {
      await pedirCarteira('wallet_switchEthereumChain', [{ chainId: SEPOLIA.hex }])
    } catch (e) {
      // 4902 = a carteira ainda não conhece a rede: pedimos para adicionar
      if ((e as { code?: number })?.code === 4902) {
        await pedirCarteira('wallet_addEthereumChain', [
          {
            chainId: SEPOLIA.hex,
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'Sepolia Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [SEPOLIA.rpc],
            blockExplorerUrls: [SEPOLIA.explorador],
          },
        ]).catch(() => {})
      }
    }
  }

  // Envia uma transação pela carteira e acompanha o andamento. Devolve true se confirmou.
  async function enviarTx(
    origem: Origem,
    acao: string,
    montar: (contrato: ContratoFeeVault, de: string) => EnvioTx,
  ): Promise<boolean> {
    if (!conta || !naRedeCerta) return false
    setTx({ estado: 'assinando', origem, acao })
    let hash: string | undefined
    try {
      const web3 = await obterWeb3()
      const contrato = new web3.eth.Contract(ABI_FEE_VAULT, ENDERECO_CONTRATO)
      const envio = montar(contrato, conta)
      envio.on('transactionHash', (h) => {
        hash = String(h)
        setTx({ estado: 'confirmando', origem, acao, hash })
      })
      const recibo = await envio
      setTx({
        estado: 'ok',
        origem,
        acao,
        hash: String(recibo.transactionHash),
      })
      return true
    } catch (e) {
      setTx({
        estado: 'erro',
        origem,
        acao,
        mensagem: mensagemDeErro(e),
        hash,
      })
      return false
    } finally {
      recarregar().catch(() => {})
    }
  }

  const id = (n: number) => n.toString()

  return {
    naRedeCerta,
    saldoCarteira,
    saldoContrato,
    taxaBps,
    apostas,
    bloco,
    tx,
    limparTx: () => setTx({ estado: 'parado' }),
    trocarParaSepolia,

    // Carteira <-> contrato
    depositar: (valor: bigint) =>
      enviarTx('carteira', 'deposito', (c, de) =>
        c.methods.deposit().send({ from: de, value: valor.toString() }),
      ),
    sacar: (valor: bigint) =>
      enviarTx('carteira', 'saque', (c, de) =>
        c.methods.withdraw(valor.toString()).send({ from: de }),
      ),

    // Apostas
    criarAposta: (valor: bigint, lado: Lado) =>
      enviarTx('apostas', 'apostaCriada', (c, de) =>
        c.methods.createBet(valor.toString(), lado === 'cara' ? '0' : '1').send({ from: de }),
      ),
    entrarAposta: (n: number) =>
      enviarTx('apostas', 'entrouAposta', (c, de) =>
        c.methods.joinBet(id(n)).send({ from: de }),
      ),
    resolverAposta: (n: number) =>
      enviarTx('apostas', 'moedaJogada', (c, de) =>
        c.methods.resolveBet(id(n)).send({ from: de }),
      ),
    cancelarAposta: (n: number) =>
      enviarTx('apostas', 'apostaCancelada', (c, de) =>
        c.methods.cancelBet(id(n)).send({ from: de }),
      ),
    devolverAoPerdedor: (n: number, valor: bigint) =>
      enviarTx('apostas', 'valorDevolvido', (c, de) =>
        c.methods.returnToLoser(id(n), valor.toString()).send({ from: de }),
      ),
  }
}

export type ContratoHook = ReturnType<typeof useContrato>

// ---------- Integração com o jogo ----------
function rotulo(endereco: string | null, conta: string | null) {
  if (!endereco) return '?'
  return mesmoEndereco(endereco, conta) ? i18n.t('voce') : encurtarEndereco(endereco)
}

// Transforma uma aposta resolvida numa rodada do jogo (moeda, resultado, placar e histórico)
export function rodadaDaAposta(a: Aposta, conta: string | null): Rodada | null {
  const lado = ladoResultado(a)
  if (!lado) return null
  const donoCara = a.ladoCriador === 'cara' ? a.criador : a.oponente
  const donoCoroa = a.ladoCriador === 'coroa' ? a.criador : a.oponente
  return {
    quantidade: 1,
    caras: lado === 'cara' ? 1 : 0,
    coroas: lado === 'coroa' ? 1 : 0,
    ultimo: lado,
    nomeCara: rotulo(donoCara, conta),
    nomeCoroa: rotulo(donoCoroa, conta),
    aposta: i18n.t('apostas.premio', { valor: formatarEth(a.valor * 2n), id: a.id }),
  }
}
