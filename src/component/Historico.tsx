import { vencedor, type Rodada } from './jogo'

type Props = {
  jogadas: Rodada[]
}

export function Historico({ jogadas }: Props) {
  if (jogadas.length === 0) return null

  return (
    <div className="w-full max-w-sm">
      <h2 className="mb-2 text-lg font-semibold">Últimas jogadas</h2>
      <ul className="flex flex-col gap-1">
        {jogadas.map((j, i) => {
          const v = vencedor(j)
          return (
            <li
              key={jogadas.length - i}
              className={`rounded px-3 py-1 text-sm break-words ${
                v === null ? 'bg-yellow-500/15 text-yellow-600' : 'bg-green-500/15 text-green-600'
              }`}
            >
              {j.quantidade > 1 && `${j.quantidade}x · `}
              {v === null ? 'Empate' : `Venceu: ${v}`}
              {j.quantidade > 1 && ` (${j.caras} × ${j.coroas})`}
              {j.aposta && ` · ${j.aposta}`}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
