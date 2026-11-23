type Props = {
  girando: boolean
  nomesPreenchidos: boolean
}

export function BotaoJogar({ girando, nomesPreenchidos }: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="submit"
        disabled={girando || !nomesPreenchidos}
        className="rounded-full bg-linear-to-r from-pink-400 via-fuchsia-400 to-violet-400 px-10 py-3 text-lg font-bold text-white shadow-lg shadow-pink-300/60 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:shadow-violet-900/60"
      >
        {girando ? 'Girando...' : 'Jogar a moeda 🪙'}
      </button>
      {!nomesPreenchidos && (
        <p className="text-sm text-pink-500 dark:text-pink-300">Preencha os dois nomes para jogar</p>
      )}
    </div>
  )
}
