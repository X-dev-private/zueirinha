import { vencedor, type Rodada } from './jogo'

type Props = {
  jogadas: Rodada[]
}

export function Historico({ jogadas }: Props) {
  if (jogadas.length === 0) return null

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <h2 className="mb-2 text-sm font-semibold">Últimas jogadas</h2>
      <ul className="flex max-h-56 min-h-0 flex-col gap-1 overflow-y-auto pr-1 lg:max-h-none">
        {jogadas.map((j, i) => {
          const v = vencedor(j)
          return (
            <li
              key={jogadas.length - i}
              className={`surgir shrink-0 rounded-xl px-3 py-1 text-sm break-words ${
                v === null
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
              }`}
            >
              {j.quantidade > 1 && `${j.quantidade}x · `}
              {v === null ? '🤝 Empate' : `🏆 ${v}`}
              {j.quantidade > 1 && ` (${j.caras} × ${j.coroas})`}
              {j.aposta && ` · ${j.aposta}`}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
