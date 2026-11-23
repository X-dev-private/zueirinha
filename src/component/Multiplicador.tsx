import { MAX_MULTIPLICADOR } from './jogo'

const ATALHOS = [1, 10, 100, 1000]

type Props = {
  valor: number
  desabilitado: boolean
  onChange: (valor: number) => void
}

export function Multiplicador({ valor, desabilitado, onChange }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <label className="text-sm font-semibold text-[var(--texto-forte)]" htmlFor="multiplicador">
        Multiplicador de partidas
      </label>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <input
            id="multiplicador"
            type="text"
            inputMode="numeric"
            value={valor || ''}
            placeholder="1"
            disabled={desabilitado}
            onChange={(e) => {
              const digitos = e.target.value.replace(/\D/g, '')
              onChange(Math.min(Number(digitos), MAX_MULTIPLICADOR))
            }}
            className="w-24 rounded-2xl border-2 border-pink-200 bg-white/80 px-2 py-1 text-center text-[var(--texto-forte)] outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-200/60 disabled:opacity-50 dark:border-white/15 dark:bg-white/10 dark:focus:border-violet-300 dark:focus:ring-violet-400/30"
          />
          <span className="font-semibold">x</span>
        </div>

        <div className="flex gap-1.5">
          {ATALHOS.map((n) => (
            <button
              key={n}
              type="button"
              disabled={desabilitado}
              onClick={() => onChange(n)}
              className={`rounded-full px-2.5 py-1 text-sm sm:px-3 font-semibold transition active:scale-95 disabled:opacity-50 ${
                valor === n
                  ? 'bg-pink-400 text-white shadow-md shadow-pink-300/50 dark:bg-violet-400 dark:shadow-violet-900/50'
                  : 'bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20'
              }`}
            >
              {n}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
