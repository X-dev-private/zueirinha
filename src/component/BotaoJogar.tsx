type Props = {
  girando: boolean
  nomesPreenchidos: boolean
  onJogar: () => void
}

export function BotaoJogar({ girando, nomesPreenchidos, onJogar }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={girando || !nomesPreenchidos}
        onClick={onJogar}
        className="rounded-lg bg-yellow-500 px-8 py-3 text-lg font-bold text-yellow-950 hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Jogar a moeda
      </button>
      {!nomesPreenchidos && (
        <p className="text-sm text-red-500">Preencha os dois nomes para jogar</p>
      )}
    </div>
  )
}
