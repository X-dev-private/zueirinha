type Props = {
  nomeCara: string
  nomeCoroa: string
  aposta: string
  desabilitado: boolean
  onNomeCara: (valor: string) => void
  onNomeCoroa: (valor: string) => void
  onAposta: (valor: string) => void
}

const campo =
  'w-full rounded-2xl border-2 border-pink-200 bg-white/80 px-3 py-1.5 text-[var(--texto-forte)] outline-none transition placeholder:text-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-200/60 disabled:opacity-50 dark:border-white/15 dark:bg-white/10 dark:placeholder:text-white/30 dark:focus:border-violet-300 dark:focus:ring-violet-400/30'

export function Jogadores({
  nomeCara,
  nomeCoroa,
  aposta,
  desabilitado,
  onNomeCara,
  onNomeCoroa,
  onAposta,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-3 text-left">
      <div className="flex gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium">
          <span>
            🙂 Quem é Cara <span className="text-pink-500">*</span>
          </span>
          <input
            type="text"
            value={nomeCara}
            placeholder="Nome"
            maxLength={30}
            required
            disabled={desabilitado}
            onChange={(e) => onNomeCara(e.target.value)}
            className={campo}
          />
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium">
          <span>
            👑 Quem é Coroa <span className="text-pink-500">*</span>
          </span>
          <input
            type="text"
            value={nomeCoroa}
            placeholder="Nome"
            maxLength={30}
            required
            disabled={desabilitado}
            onChange={(e) => onNomeCoroa(e.target.value)}
            className={campo}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium">
        <span>🎁 O que está sendo apostado (opcional)</span>
        <input
          type="text"
          value={aposta}
          placeholder="Ex.: quem paga o lanche"
          maxLength={100}
          disabled={desabilitado}
          onChange={(e) => onAposta(e.target.value)}
          className={campo}
        />
      </label>
    </div>
  )
}
