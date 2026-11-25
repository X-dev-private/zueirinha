import { useTranslation } from 'react-i18next'

type Props = {
  nomeCara: string
  nomeCoroa: string
  cara: number
  coroa: number
  onZerar: () => void
}

export function Placar({ nomeCara, nomeCoroa, cara, coroa, onZerar }: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-1.5">
      <h2 className="text-sm font-semibold">{t('placar.titulo')}</h2>
      <div className="flex w-full items-stretch gap-3">
        <Lado emoji="🙂" nome={nomeCara || t('lado.cara')} pontos={cara} cor="bg-sky-200/70 dark:bg-sky-400/15" />
        <Lado emoji="👑" nome={nomeCoroa || t('lado.coroa')} pontos={coroa} cor="bg-violet-200/70 dark:bg-violet-400/15" />
      </div>
      <button
        type="button"
        onClick={onZerar}
        className="rounded-full px-3 py-1 text-sm opacity-70 transition hover:bg-white/60 hover:opacity-100 dark:hover:bg-white/10"
      >
        {t('placar.zerar')}
      </button>
    </div>
  )
}

function Lado({ emoji, nome, pontos, cor }: { emoji: string; nome: string; pontos: number; cor: string }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col items-center rounded-2xl px-3 py-2 ${cor}`}>
      <span className="max-w-full truncate text-sm">
        {emoji} {nome}
      </span>
      <strong className="text-2xl">{pontos}</strong>
    </div>
  )
}
