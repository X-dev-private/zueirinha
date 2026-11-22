// Tipos e regras do jogo (sem nada de interface)

export type Lado = 'cara' | 'coroa'

export type Rodada = {
  quantidade: number
  caras: number
  coroas: number
  ultimo: Lado
  nomeCara: string
  nomeCoroa: string
  aposta: string
}

export const MAX_MULTIPLICADOR = 100000

// Joga a moeda `quantidade` vezes e devolve a rodada completa
export function sortearRodada(
  quantidade: number,
  nomeCara: string,
  nomeCoroa: string,
  aposta: string,
): Rodada {
  let caras = 0
  let ultimo: Lado = 'cara'
  for (let i = 0; i < quantidade; i++) {
    ultimo = Math.random() < 0.5 ? 'cara' : 'coroa'
    if (ultimo === 'cara') caras++
  }
  return { quantidade, caras, coroas: quantidade - caras, ultimo, nomeCara, nomeCoroa, aposta }
}

// Lado em que a moeda deve cair na animação
export function ladoDaMoeda(r: Rodada): Lado {
  if (r.quantidade === 1) return r.ultimo
  return r.caras >= r.coroas ? 'cara' : 'coroa'
}

// Nome de quem venceu (null = empate)
export function vencedor(r: Rodada): string | null {
  if (r.caras === r.coroas) return null
  return r.caras > r.coroas ? r.nomeCara : r.nomeCoroa
}

// Garante um número entre 1 e MAX_MULTIPLICADOR
export function normalizarQuantidade(n: number): number {
  return Math.min(Math.max(1, Math.floor(n) || 1), MAX_MULTIPLICADOR)
}
