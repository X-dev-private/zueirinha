import { Trans, useTranslation } from 'react-i18next'
import { vencedor, type Rodada } from './jogo'

type Props = {
  girando: boolean
  pendente: Rodada | null
  rodada: Rodada | null
  nomesPreenchidos: boolean
  // Texto quando ainda não há jogada (substitui o padrão)
  mensagemVazia?: string
  // Esperando a rede confirmar a jogada
  aguardando?: boolean
}

export function Resultado({
  girando,
  pendente,
  rodada,
  nomesPreenchidos,
  mensagemVazia,
  aguardando = false,
}: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-16 w-full sm:min-h-28 max-w-md items-start justify-center">
      {girando && (
        <p className="animate-pulse pt-2 text-lg font-semibold">
          {pendente && pendente.quantidade > 1
            ? t('resultado.jogandoVezes', { count: pendente.quantidade })
            : t('resultado.jogando')}
        </p>
      )}

      {aguardando && !girando && (
        <p className="animate-pulse pt-2 text-lg font-semibold">
          {t('resultado.blockchain')}
        </p>
      )}

      {!aguardando && !girando && !rodada && (
        <p className="pt-1 text-sm sm:pt-2 sm:text-base">
          {mensagemVazia ??
            (nomesPreenchidos
              ? t('resultado.pronto')
              : t('resultado.comecar'))}
        </p>
      )}

      {!aguardando && !girando && rodada && <CartaoResultado rodada={rodada} />}
    </div>
  )
}

function CartaoResultado({ rodada }: { rodada: Rodada }) {
  const { t } = useTranslation()
  const v = vencedor(rodada)
  const empate = v === null

  return (
    <div
      className={`cartao surgir flex w-full flex-col gap-2 p-4 ${
        empate
          ? 'ring-4 ring-amber-200/70 dark:ring-amber-300/30'
          : 'ring-4 ring-emerald-200/70 dark:ring-emerald-300/30'
      }`}
    >
      {/* Título */}
      <p
        className={`text-2xl font-bold break-words sm:text-3xl ${empate ? 'text-amber-500 dark:text-amber-300' : 'text-emerald-500 dark:text-emerald-300'}`}
      >
        {empate ? t('resultado.empate') : t('resultado.venceu', { nome: v })}
      </p>

      {/* Como foi */}
      {rodada.quantidade === 1 ? (
        <p>
          <Trans
            i18nKey="resultado.caiuEm"
            values={{ lado: t(`lado.${rodada.ultimo}`) }}
            components={{ b: <strong className="uppercase" /> }}
          />
        </p>
      ) : (
        <Contagem rodada={rodada} />
      )}

      {/* Aposta */}
      {rodada.aposta && (
        <p className="rounded-2xl bg-pink-50 px-3 py-1.5 break-words dark:bg-white/10">
          {empate ? (
            <Trans
              i18nKey="resultado.ninguemLeva"
              values={{ aposta: rodada.aposta }}
              components={{ b: <strong /> }}
            />
          ) : (
            <Trans
              i18nKey="resultado.leva"
              values={{ nome: v, aposta: rodada.aposta }}
              components={{ b: <strong /> }}
            />
          )}
        </p>
      )}
    </div>
  )
}

// Quantas vezes caiu cada lado, quando há várias jogadas
function Contagem({ rodada }: { rodada: Rodada }) {
  const { t } = useTranslation()
  const pctCara = Math.round((rodada.caras / rodada.quantidade) * 100)
  const pctCoroa = 100 - pctCara

  return (
    <div className="flex flex-col gap-2">
      <p>
        <Trans
          i18nKey="resultado.emJogadas"
          values={{ count: rodada.quantidade }}
          components={{ b: <strong /> }}
        />
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-sky-50 p-2 dark:bg-sky-400/15">
          <p className="truncate text-sm">{t('lado.cara')} ({rodada.nomeCara})</p>
          <p className="text-xl font-bold">{rodada.caras}x</p>
          <p className="text-sm">{pctCara}%</p>
        </div>
        <div className="rounded-2xl bg-violet-50 p-2 dark:bg-violet-400/15">
          <p className="truncate text-sm">{t('lado.coroa')} ({rodada.nomeCoroa})</p>
          <p className="text-xl font-bold">{rodada.coroas}x</p>
          <p className="text-sm">{pctCoroa}%</p>
        </div>
      </div>

      {/* Barra comparando os dois lados */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/60 dark:bg-white/10">
        <div className="bg-sky-400" style={{ width: `${pctCara}%` }} />
        <div className="bg-violet-400" style={{ width: `${pctCoroa}%` }} />
      </div>
    </div>
  )
}
