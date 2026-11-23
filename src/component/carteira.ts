// Lógica da carteira (MetaMask e outras compatíveis), usando web3.js
import { useEffect, useState } from 'react'
import type { types, Web3 } from 'web3'

type Provedor = types.MetaMaskProvider<types.Web3EthExecutionAPI>

declare global {
  interface Window {
    ethereum?: Provedor
  }
}

// web3.js é pesado: só baixamos quando precisamos, e uma vez só
let web3Promessa: Promise<Web3> | null = null
export function obterWeb3(): Promise<Web3> {
  const eth = window.ethereum
  if (!eth) return Promise.reject(new Error('Nenhuma carteira encontrada'))
  web3Promessa ??= import('web3').then(({ Web3 }) => new Web3(eth))
  return web3Promessa
}

// Chamada "crua" à carteira, para métodos que o web3.js não tipa (trocar de rede etc.)
export function pedirCarteira(method: string, params?: unknown[]) {
  const eth = window.ethereum
  if (!eth) return Promise.reject(new Error('Nenhuma carteira encontrada'))
  const request = eth.request as (args: { method: string; params?: unknown[] }) => Promise<unknown>
  return request.call(eth, { method, params })
}

// Transforma o erro (que o web3.js costuma embrulhar) em texto pesquisável
function textoDoErro(e: unknown): string {
  try {
    return JSON.stringify(e, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)) + String(e)
  } catch {
    return String(e)
  }
}

const ERROS_DO_CONTRATO: [string, string][] = [
  ['0xf4d678b8', 'Saldo insuficiente no contrato. Deposite mais pela carteira.'], // InsufficientBalance
  ['0x1f2a2005', 'O valor precisa ser maior que zero'], // ZeroAmount
  ['0x0a6fc7ca', 'Essa aposta não está mais aberta'], // BetNotOpen
  ['0xa0f7462e', 'Essa aposta não está esperando a moeda'], // BetNotJoined
  ['0xa6e9b6d7', 'Só quem criou a aposta pode cancelar'], // NotBetCreator
  ['0x8c78585b', 'Você não pode entrar na sua própria aposta'], // CannotJoinOwnBet
  ['0x085de625', 'Ainda cedo: espere o próximo bloco para jogar a moeda'], // TooEarly
  ['0x9b0beeda', 'Só quem venceu pode devolver'], // NotBetWinner
  ['0xb5820ebf', 'A aposta ainda não foi resolvida'], // BetNotResolved
  ['0xd0bfcb60', 'Não dá para devolver mais do que o perdedor apostou'], // ReturnTooHigh
  ['0x90b8ec18', 'A transferência falhou'], // TransferFailed
]

export function mensagemDeErro(e: unknown): string {
  const codigo = (e as { code?: number })?.code
  const t = textoDoErro(e).toLowerCase()
  if (
    codigo === 4001 ||
    t.includes('"code":4001') ||
    t.includes('user denied') ||
    t.includes('user rejected')
  )
    return 'Cancelado na carteira'
  if (codigo === -32002 || t.includes('-32002'))
    return 'Já tem um pedido aberto na carteira, dá uma olhada lá'
  if (t.includes('insufficient funds'))
    return 'Saldo insuficiente para o valor + taxa da rede (gás)'
  // Erros do próprio contrato (seletor = primeiros 4 bytes do keccak256 do nome)
  for (const [seletor, msg] of ERROS_DO_CONTRATO) if (t.includes(seletor)) return msg
  return 'Algo deu errado. Tente de novo.'
}

// 0x1234abcd...ef56 -> 0x1234…ef56
export function encurtarEndereco(endereco: string) {
  return `${endereco.slice(0, 6)}…${endereco.slice(-4)}`
}

export function useCarteira() {
  const [conta, setConta] = useState<string | null>(null)
  const [conectando, setConectando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const temCarteira = typeof window !== 'undefined' && window.ethereum !== undefined

  // Se o site já tinha permissão, reconecta sozinho e acompanha trocas de conta
  useEffect(() => {
    const eth = window.ethereum
    if (!eth) return

    const aoTrocarConta = (contas: string[]) => setConta(contas[0] ?? null)

    obterWeb3()
      .then((web3) => web3.eth.getAccounts())
      .then((contas) => setConta(contas[0] ?? null))
      .catch(() => {})

    eth.on('accountsChanged', aoTrocarConta)
    return () => eth.removeListener('accountsChanged', aoTrocarConta)
  }, [])

  // Some com a mensagem de erro depois de alguns segundos
  useEffect(() => {
    if (!erro) return
    const t = setTimeout(() => setErro(null), 4000)
    return () => clearTimeout(t)
  }, [erro])

  // Devolve true se conectou
  async function conectar(): Promise<boolean> {
    if (!window.ethereum || conectando) return false
    setConectando(true)
    setErro(null)
    try {
      const web3 = await obterWeb3()
      const contas = await web3.eth.requestAccounts()
      setConta(contas[0] ?? null)
      return contas.length > 0
    } catch (e) {
      setErro(mensagemDeErro(e))
      return false
    } finally {
      setConectando(false)
    }
  }

  async function desconectar() {
    setConta(null)
    // Pede para a carteira esquecer a permissão (nem todas suportam; tudo bem se falhar)
    try {
      await pedirCarteira('wallet_revokePermissions', [{ eth_accounts: {} }])
    } catch {
      // ignorado
    }
  }

  return { conta, conectando, erro, temCarteira, conectar, desconectar }
}

export type CarteiraHook = ReturnType<typeof useCarteira>
