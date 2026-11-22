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
  'w-full rounded-lg border-2 border-gray-400 bg-transparent px-3 py-2 disabled:opacity-50'

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
    <div className="flex w-full max-w-sm flex-col gap-3 text-left">
      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span>
            Quem é Cara <span className="text-red-500">*</span>
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
        <label className="flex flex-1 flex-col gap-1 text-sm">
          <span>
            Quem é Coroa <span className="text-red-500">*</span>
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

      <label className="flex flex-col gap-1 text-sm">
        <span>O que está sendo apostado (opcional)</span>
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
