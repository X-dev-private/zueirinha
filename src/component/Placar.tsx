type Props = {
  nomeCara: string
  nomeCoroa: string
  cara: number
  coroa: number
  onZerar: () => void
}

export function Placar({ nomeCara, nomeCoroa, cara, coroa, onZerar }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-lg break-words">
        {nomeCara || 'Cara'}: <strong>{cara}</strong> · {nomeCoroa || 'Coroa'}:{' '}
        <strong>{coroa}</strong>
      </p>
      <button
        type="button"
        onClick={onZerar}
        className="text-sm underline opacity-70 hover:opacity-100"
      >
        Zerar placar
      </button>
    </div>
  )
}
