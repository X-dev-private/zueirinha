// Lógica da carteira (MetaMask e outras compatíveis), usando web3.js
import { useEffect, useState } from 'react'
import type { types, Web3 } from 'web3'
import i18n from '../i18n'

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
  if (!eth) return Promise.reject(new Error(i18n.t('erros.semCarteira')))
  web3Promessa ??= import('web3').then(({ Web3 }) => new Web3(eth))
  return web3Promessa
}

// Chamada "crua" à carteira, para métodos que o web3.js não tipa (trocar de rede etc.)
export function pedirCarteira(method: string, params?: unknown[]) {
  const eth = window.ethereum
  if (!eth) return Promise.reject(new Error(i18n.t('erros.semCarteira')))
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

// Erros do contrato: seletor (4 primeiros bytes do keccak256 do nome) -> chave da tradução
const ERROS_DO_CONTRATO: [string, string][] = [
  ['0xf4d678b8', 'InsufficientBalance'],
  ['0x1f2a2005', 'ZeroAmount'],
  ['0x0a6fc7ca', 'BetNotOpen'],
  ['0xa0f7462e', 'BetNotJoined'],
  ['0xa6e9b6d7', 'NotBetCreator'],
  ['0x8c78585b', 'CannotJoinOwnBet'],
  ['0x085de625', 'TooEarly'],
  ['0x9b0beeda', 'NotBetWinner'],
  ['0xb5820ebf', 'BetNotResolved'],
  ['0xd0bfcb60', 'ReturnTooHigh'],
  ['0x90b8ec18', 'TransferFailed'],
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
    return i18n.t('erros.cancelado')
  if (codigo === -32002 || t.includes('-32002'))
    return i18n.t('erros.pedidoAberto')
  if (t.includes('insufficient funds'))
    return i18n.t('erros.semGas')
  // Erros do próprio contrato (seletor = primeiros 4 bytes do keccak256 do nome)
  for (const [seletor, nome] of ERROS_DO_CONTRATO)
    if (t.includes(seletor)) return i18n.t(`erros.contrato.${nome}`)
  return i18n.t('erros.generico')
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
