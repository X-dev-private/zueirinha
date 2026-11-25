import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SEPOLIA, type EstadoTx } from './contrato'

// Andamento de uma transação: assinando -> confirmando -> ok / erro
export function StatusTx({ tx }: { tx: Exclude<EstadoTx, { estado: 'parado' }> }) {
  const { t } = useTranslation()
  const ver = t('tx.verEtherscan')
  return (
    <div
      role="status"
      className={`surgir mt-3 rounded-2xl px-3 py-2 text-left text-xs ${
        tx.estado === 'erro'
          ? 'bg-pink-50 text-pink-700 dark:bg-pink-400/15 dark:text-pink-200'
          : tx.estado === 'ok'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
            : 'bg-violet-50 dark:bg-violet-400/15'
      }`}
    >
      {tx.estado === 'assinando' && t('tx.assinando')}
      {tx.estado === 'confirmando' && (
        <>
          {t('tx.confirmando')}{' '}
          <LinkEtherscan caminho={`tx/${tx.hash}`}>{ver}</LinkEtherscan>
        </>
      )}
      {tx.estado === 'ok' && (
        <>
          ✅ {t(`tx.acoes.${tx.acao}`)}! <LinkEtherscan caminho={`tx/${tx.hash}`}>{ver}</LinkEtherscan>
        </>
      )}
      {tx.estado === 'erro' && (
        <>
          ⚠️ {tx.mensagem}
          {tx.hash && (
            <>
              {' '}
              <LinkEtherscan caminho={`tx/${tx.hash}`}>{ver}</LinkEtherscan>
            </>
          )}
        </>
      )}
    </div>
  )
}

export function LinkEtherscan({ caminho, children }: { caminho: string; children: ReactNode }) {
  return (
    <a
      href={`${SEPOLIA.explorador}/${caminho}`}
      target="_blank"
      rel="noreferrer"
      className="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  )
}
