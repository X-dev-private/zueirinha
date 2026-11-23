// Lógica da carteira (MetaMask e outras compatíveis), usando web3.js
import { useEffect, useState } from 'react'
import type { types } from 'web3'

type Provedor = types.MetaMaskProvider<types.Web3EthExecutionAPI>

declare global {
  interface Window {
    ethereum?: Provedor
  }
}

// web3.js é pesado: só baixamos quando realmente precisamos
async function criarWeb3(eth: Provedor) {
  const { Web3 } = await import('web3')
  return new Web3(eth)
}

function mensagemDeErro(e: unknown): string {
  const codigo = (e as { code?: number })?.code
  if (codigo === 4001) return 'Conexão cancelada na carteira'
  if (codigo === -32002) return 'Já tem um pedido aberto na carteira, dá uma olhada lá'
  return 'Não deu para conectar a carteira'
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

    criarWeb3(eth)
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

  async function conectar() {
    const eth = window.ethereum
    if (!eth || conectando) return
    setConectando(true)
    setErro(null)
    try {
      const web3 = await criarWeb3(eth)
      const contas = await web3.eth.requestAccounts()
      setConta(contas[0] ?? null)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setConectando(false)
    }
  }

  async function desconectar() {
    setConta(null)
    // Pede para a carteira esquecer a permissão (nem todas suportam; tudo bem se falhar)
    const request = window.ethereum?.request as
      | ((args: { method: string; params?: unknown[] }) => Promise<unknown>)
      | undefined
    try {
      await request?.call(window.ethereum, {
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      })
    } catch {
      // ignorado
    }
  }

  return { conta, conectando, erro, temCarteira, conectar, desconectar }
}
