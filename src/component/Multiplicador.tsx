import { MAX_MULTIPLICADOR } from './jogo'

const ATALHOS = [1, 10, 100, 1000]

type Props = {
  valor: number
  desabilitado: boolean
  onChange: (valor: number) => void
}

export function Multiplicador({ valor, desabilitado, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="font-semibold" htmlFor="multiplicador">
        Multiplicador de partidas
      </label>

      <div className="flex items-center gap-2">
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
          className="w-28 rounded-lg border-2 border-gray-400 bg-transparent px-3 py-2 text-center"
        />
        <span className="font-semibold">x</span>
      </div>

      <div className="flex gap-2">
        {ATALHOS.map((n) => (
          <button
            key={n}
            type="button"
            disabled={desabilitado}
            onClick={() => onChange(n)}
            className={`rounded-md px-3 py-1 text-sm font-semibold disabled:opacity-50 ${
              valor === n ? 'bg-yellow-500 text-yellow-950' : 'bg-gray-500/20 hover:bg-gray-500/30'
            }`}
          >
            {n}x
          </button>
        ))}
      </div>
    </div>
  )
}
