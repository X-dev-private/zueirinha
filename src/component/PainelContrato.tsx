import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { encurtarEndereco } from './carteira'
import { ENDERECO_CONTRATO, SEPOLIA, formatarEth, lerEth, type ContratoHook } from './contrato'
import { LinkEtherscan, StatusTx } from './StatusTx'

type Operacao = 'depositar' | 'sacar'

type Props = {
  conta: string
  contrato: ContratoHook
  aberto: boolean
  onDesconectar: () => void
}

const ATALHOS_DEPOSITO = ['0.001', '0.01', '0.05']

const campo =
  'w-full rounded-2xl border-2 border-pink-200 bg-white/80 py-2 pr-14 pl-3 text-lg font-semibold text-[var(--texto-forte)] outline-none transition placeholder:text-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-200/60 disabled:opacity-50 dark:border-white/15 dark:bg-white/10 dark:placeholder:text-white/30 dark:focus:border-violet-300 dark:focus:ring-violet-400/30'

const chip =
  'rounded-full bg-white/70 px-3 py-1 text-xs font-semibold transition hover:bg-white active:scale-95 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20'

export function PainelContrato({ conta, contrato: c, aberto, onDesconectar }: Props) {
  const { t } = useTranslation()
  const [operacao, setOperacao] = useState<Operacao>('depositar')
  const [texto, setTexto] = useState('')

  const valor = lerEth(texto)
  const ocupado = c.tx.estado === 'assinando' || c.tx.estado === 'confirmando'
  // Só mostramos aqui as transações feitas por este painel
  const tx = c.tx.estado !== 'parado' && c.tx.origem === 'carteira' ? c.tx : null
  const saldoDisponivel = operacao === 'depositar' ? c.saldoCarteira : c.saldoContrato

  // Taxa só existe no depósito
  const taxa =
    operacao === 'depositar' && valor !== null && c.taxaBps !== null
      ? (valor * c.taxaBps) / 10000n
      : null
  const liquido = taxa !== null && valor !== null ? valor - taxa : null

  let problema: string | null = null
  if (texto !== '' && valor === null) problema = t('validacao.invalido')
  else if (valor !== null && valor === 0n) problema = t('validacao.maiorQueZero')
  else if (valor !== null && saldoDisponivel !== null && valor > saldoDisponivel)
    problema =
      operacao === 'depositar'
        ? t('validacao.maisQueCarteira')
        : t('validacao.maisQueContrato')

  const podeEnviar = c.naRedeCerta && valor !== null && valor > 0n && problema === null && !ocupado

  function trocarOperacao(o: Operacao) {
    setOperacao(o)
    setTexto('')
    c.limparTx()
  }

  async function enviar() {
    if (!podeEnviar || valor === null) return
    const ok = await (operacao === 'depositar' ? c.depositar(valor) : c.sacar(valor))
    if (ok) setTexto('')
  }

  return (
    <div
      role="dialog"
      aria-label={t('painel.titulo')}
      inert={!aberto}
      className={`absolute top-full right-0 mt-2 w-[min(22rem,calc(100vw-1rem))] origin-top-right rounded-3xl border-2 border-white bg-[var(--carteira-fundo)] p-4 text-left shadow-2xl shadow-violet-300/40 transition duration-200 ease-out dark:border-white/10 dark:shadow-black/50 ${
        aberto
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
      }`}
    >
      {/* Cabeçalho */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{t('painel.titulo')}</h2>
          <p className="text-xs opacity-70">
            <LinkEtherscan caminho={`address/${ENDERECO_CONTRATO}`}>
              {encurtarEndereco(ENDERECO_CONTRATO)}
            </LinkEtherscan>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
            c.naRedeCerta
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200'
          }`}
        >
          {c.naRedeCerta ? t('painel.redeOk') : t('painel.redeErrada')}
        </span>
      </div>

      {!c.naRedeCerta ? (
        // Carteira em outra rede
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-amber-50 p-4 text-center text-sm dark:bg-amber-400/10">
          <p>
            <Trans i18nKey="painel.trocarRede" components={{ b: <strong /> }} />
          </p>
          <button
            type="button"
            onClick={c.trocarParaSepolia}
            className="rounded-full bg-linear-to-r from-pink-400 to-violet-400 px-5 py-2 font-bold text-white shadow-md transition hover:-translate-y-0.5 active:scale-95"
          >
            {t('painel.trocarBotao')}
          </button>
        </div>
      ) : (
        <>
          {/* Saldos */}
          <div className="mb-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl bg-sky-100 px-2 py-1.5 dark:bg-sky-400/15">
              <p className="text-xs">{t('painel.naCarteira')}</p>
              <p className="truncate font-bold">
                {c.saldoCarteira === null ? '…' : `${formatarEth(c.saldoCarteira, 4)} ETH`}
              </p>
            </div>
            <div className="rounded-2xl bg-violet-100 px-2 py-1.5 dark:bg-violet-400/15">
              <p className="text-xs">{t('painel.noContrato')}</p>
              <p className="truncate font-bold">
                {c.saldoContrato === null ? '…' : `${formatarEth(c.saldoContrato, 4)} ETH`}
              </p>
            </div>
          </div>

          {c.saldoCarteira === 0n && (
            <p className="mb-3 rounded-2xl bg-pink-50 px-3 py-2 text-xs dark:bg-white/10">
              <Trans
                i18nKey="painel.semEth"
                components={{
                  link: (
                    <a
                      href={SEPOLIA.torneira}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline"
                    />
                  ),
                }}
              />
            </p>
          )}

          {/* Depositar / Sacar */}
          <div className="mb-3 grid grid-cols-2 rounded-full bg-white/70 p-1 dark:bg-white/10">
            {(['depositar', 'sacar'] as const).map((o) => (
              <button
                key={o}
                type="button"
                disabled={ocupado}
                onClick={() => trocarOperacao(o)}
                className={`rounded-full py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
                  operacao === o
                    ? 'bg-pink-400 text-white shadow-md shadow-pink-300/50 dark:bg-violet-400 dark:shadow-violet-900/50'
                    : 'hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                {o === 'depositar' ? t('painel.abaDepositar') : t('painel.abaSacar')}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              enviar()
            }}
            className="flex flex-col gap-2"
          >
            <label className="flex flex-col gap-1 text-sm font-medium">
              <span>{t('painel.valor')}</span>
              <span className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.00"
                  value={texto}
                  disabled={ocupado}
                  onChange={(e) => setTexto(e.target.value.replace(/[^\d.,]/g, ''))}
                  className={campo}
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold opacity-60">
                  ETH
                </span>
              </span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {operacao === 'depositar'
                ? ATALHOS_DEPOSITO.map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setTexto(v)}
                      className={chip}
                    >
                      {v}
                    </button>
                  ))
                : c.saldoContrato !== null &&
                  c.saldoContrato > 0n && (
                    <button
                      type="button"
                      disabled={ocupado}
                      onClick={() => setTexto(formatarEth(c.saldoContrato!, 18))}
                      className={chip}
                    >
                      {t('painel.sacarTudo')}
                    </button>
                  )}
            </div>

            {/* Resumo / validação */}
            {problema ? (
              <p className="text-xs text-pink-600 dark:text-pink-300">{problema}</p>
            ) : (
              taxa !== null &&
              liquido !== null &&
              valor! > 0n && (
                <div className="rounded-2xl bg-white/70 px-3 py-2 text-xs dark:bg-white/10">
                  <p className="flex justify-between">
                    <span>{t('painel.taxa', { pct: Number(c.taxaBps) / 100 })}</span>
                    <span>{formatarEth(taxa, 8)} ETH</span>
                  </p>
                  <p className="flex justify-between font-semibold">
                    <span>{t('painel.vaiParaSaldo')}</span>
                    <span>{formatarEth(liquido, 8)} ETH</span>
                  </p>
                </div>
              )
            )}

            <button
              type="submit"
              disabled={!podeEnviar}
              className="mt-1 rounded-full bg-linear-to-r from-pink-400 via-fuchsia-400 to-violet-400 py-2.5 font-bold text-white shadow-lg shadow-pink-300/50 transition hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:shadow-violet-900/50"
            >
              {ocupado
                ? t('painel.aguarde')
                : `${operacao === 'depositar' ? t('painel.depositar') : t('painel.sacar')}${valor && !problema ? ` ${formatarEth(valor, 8)} ETH` : ''}`}
            </button>
          </form>

          {/* Andamento da transação */}
          {tx && <StatusTx tx={tx} />}
        </>
      )}

      {/* Rodapé */}
      <div className="mt-3 flex items-center justify-between border-t border-pink-100 pt-2 text-xs dark:border-white/10">
        <span className="font-mono opacity-70" title={conta}>
          {encurtarEndereco(conta)}
        </span>
        <button
          type="button"
          onClick={onDesconectar}
          className="rounded-full px-2 py-1 opacity-70 transition hover:bg-pink-100 hover:opacity-100 dark:hover:bg-white/10"
        >
          {t('carteira.desconectar')}
        </button>
      </div>
    </div>
  )
}
