import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { encurtarEndereco, type CarteiraHook } from './carteira'
import {
  formatarEth,
  lerEth,
  mesmoEndereco,
  outroLado,
  type Aposta,
  type ContratoHook,
} from './contrato'
import type { Lado } from './jogo'
import { StatusTx } from './StatusTx'

// O contrato só consegue sortear até 256 blocos depois do bloco de resolução;
// depois disso, "jogar a moeda" devolve o valor para os dois.
const JANELA_BLOCOS = 256n

const ATALHOS = ['0.001', '0.005', '0.01']

type Props = {
  carteira: CarteiraHook
  contrato: ContratoHook
  ocupado: boolean // moeda girando / esperando resultado
  onAbrirCarteira: () => void
  onJogarMoeda: (id: number) => void
}

const EMOJI: Record<Lado, string> = { cara: '🙂', coroa: '👑' }

const botaoPrincipal =
  'rounded-full bg-linear-to-r from-pink-400 via-fuchsia-400 to-violet-400 font-bold text-white shadow-lg shadow-pink-300/50 transition hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:shadow-violet-900/50'

const botaoPequeno =
  'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'

export function ApostasCripto({
  carteira,
  contrato: c,
  ocupado,
  onAbrirCarteira,
  onJogarMoeda,
}: Props) {
  const { t } = useTranslation()
  const { conta } = carteira

  if (!conta) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-sm">
        <p className="text-4xl">💎</p>
        <p>
          <Trans i18nKey="apostas.intro" components={{ b: <strong /> }} />
        </p>
        {carteira.temCarteira ? (
          <button
            type="button"
            onClick={async () => (await carteira.conectar()) && onAbrirCarteira()}
            disabled={carteira.conectando}
            className={`${botaoPrincipal} px-6 py-2.5`}
          >
            {carteira.conectando ? t('carteira.conectando') : t('carteira.conectar')}
          </button>
        ) : (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className={`${botaoPrincipal} px-6 py-2.5`}
          >
            {t('carteira.instalarUma')}
          </a>
        )}
      </div>
    )
  }

  if (!c.naRedeCerta) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-sm">
        <p>
          <Trans i18nKey="apostas.redeErrada" components={{ b: <strong /> }} />
        </p>
        <button
          type="button"
          onClick={c.trocarParaSepolia}
          className={`${botaoPrincipal} px-6 py-2.5`}
        >
          {t('painel.trocarBotao')}
        </button>
      </div>
    )
  }

  return (
    <PainelApostas
      conta={conta}
      c={c}
      ocupado={ocupado}
      onAbrirCarteira={onAbrirCarteira}
      onJogarMoeda={onJogarMoeda}
    />
  )
}

function PainelApostas({
  conta,
  c,
  ocupado: moedaOcupada,
  onAbrirCarteira,
  onJogarMoeda,
}: Omit<Props, 'carteira' | 'contrato'> & { conta: string; c: ContratoHook }) {
  const { t } = useTranslation()
  const [texto, setTexto] = useState('')
  const [lado, setLado] = useState<Lado>('cara')
  const [filtro, setFiltro] = useState<'todas' | 'minhas'>('todas')

  const enviando = c.tx.estado === 'assinando' || c.tx.estado === 'confirmando'
  const ocupado = enviando || moedaOcupada
  const tx = c.tx.estado !== 'parado' && c.tx.origem === 'apostas' ? c.tx : null

  const valor = lerEth(texto)
  let problema: string | null = null
  if (texto !== '' && valor === null) problema = t('validacao.invalido')
  else if (valor === 0n) problema = t('validacao.maiorQueZero')
  else if (valor !== null && c.saldoContrato !== null && valor > c.saldoContrato)
    problema = t('validacao.maisQueContrato')
  const podeCriar = valor !== null && valor > 0n && !problema && !ocupado

  const minhas = (a: Aposta) => mesmoEndereco(a.criador, conta) || mesmoEndereco(a.oponente, conta)
  const lista = filtro === 'minhas' ? c.apostas.filter(minhas) : c.apostas

  async function criar() {
    if (!podeCriar || valor === null) return
    if (await c.criarAposta(valor, lado)) setTexto('')
  }

  return (
    <div className="flex w-full flex-col gap-3 text-left">
      {/* Saldo */}
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-violet-100 px-3 py-2 text-sm dark:bg-violet-400/15">
        <span>
          <Trans
            i18nKey="apostas.saldo"
            values={{
              saldo: c.saldoContrato === null ? '…' : `${formatarEth(c.saldoContrato, 5)} ETH`,
            }}
            components={{ b: <strong /> }}
          />
        </span>
        <button
          type="button"
          onClick={onAbrirCarteira}
          className={`${botaoPequeno} bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20`}
        >
          {t('apostas.depositar')}
        </button>
      </div>

      {/* Criar aposta */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          criar()
        }}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-2">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t('apostas.valorRotulo')}</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder={t('apostas.valor')}
              value={texto}
              disabled={ocupado}
              onChange={(e) => setTexto(e.target.value.replace(/[^\d.,]/g, ''))}
              className="w-full rounded-2xl border-2 border-pink-200 bg-white/80 py-1.5 pr-12 pl-3 font-semibold text-[var(--texto-forte)] outline-none transition placeholder:text-pink-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-200/60 disabled:opacity-50 dark:border-white/15 dark:bg-white/10 dark:placeholder:text-white/30 dark:focus:border-violet-300 dark:focus:ring-violet-400/30"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold opacity-60">
              ETH
            </span>
          </label>

          {/* Escolha do lado */}
          <div
            role="radiogroup"
            aria-label={t('apostas.seuLado')}
            className="flex shrink-0 rounded-full bg-white/70 p-1 dark:bg-white/10"
          >
            {(['cara', 'coroa'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={lado === l}
                disabled={ocupado}
                onClick={() => setLado(l)}
                className={`rounded-full px-2.5 py-1 text-sm font-semibold transition ${
                  lado === l
                    ? 'bg-pink-400 text-white shadow-md dark:bg-violet-400'
                    : 'hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                {EMOJI[l]} {t(`lado.${l}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {ATALHOS.map((v) => (
            <button
              key={v}
              type="button"
              disabled={ocupado}
              onClick={() => setTexto(v)}
              className={`${botaoPequeno} bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20`}
            >
              {v}
            </button>
          ))}
          <button
            type="submit"
            disabled={!podeCriar}
            className={`${botaoPrincipal} ml-auto px-4 py-1.5 text-sm`}
          >
            {enviando && c.tx.estado !== 'parado' && c.tx.acao === 'apostaCriada'
              ? t('apostas.criando')
              : t('apostas.criar')}
          </button>
        </div>
        {problema && <p className="text-xs text-pink-600 dark:text-pink-300">{problema}</p>}
      </form>

      {tx && <StatusTx tx={tx} />}

      {/* Lista de apostas */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t('apostas.titulo')}</h2>
        <div className="flex rounded-full bg-white/70 p-0.5 text-xs dark:bg-white/10">
          {(['todas', 'minhas'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              className={`rounded-full px-2.5 py-0.5 font-semibold transition ${
                filtro === f ? 'bg-pink-400 text-white dark:bg-violet-400' : ''
              }`}
            >
              {f === 'todas' ? t('apostas.filtroTodas') : t('apostas.filtroMinhas')}
            </button>
          ))}
        </div>
      </div>

      <ul className="rolagem-suave -mt-1 flex max-h-52 flex-col gap-1.5 overflow-y-auto py-1 pr-1">
        {lista.length === 0 && (
          <li className="rounded-2xl bg-white/50 px-3 py-3 text-center text-sm opacity-80 dark:bg-white/5">
            {filtro === 'minhas'
              ? t('apostas.nenhumaMinha')
              : t('apostas.nenhuma')}
          </li>
        )}
        {lista.map((a) => (
          <ItemAposta
            key={a.id}
            aposta={a}
            conta={conta}
            c={c}
            ocupado={ocupado}
            onJogarMoeda={onJogarMoeda}
            onAbrirCarteira={onAbrirCarteira}
          />
        ))}
      </ul>
    </div>
  )
}

function ItemAposta({
  aposta: a,
  conta,
  c,
  ocupado,
  onJogarMoeda,
  onAbrirCarteira,
}: {
  aposta: Aposta
  conta: string
  c: ContratoHook
  ocupado: boolean
  onJogarMoeda: (id: number) => void
  onAbrirCarteira: () => void
}) {
  const { t } = useTranslation()
  const [devolvendo, setDevolvendo] = useState(false)
  const [textoDevolver, setTextoDevolver] = useState('')

  const souCriador = mesmoEndereco(a.criador, conta)
  const souVencedor = mesmoEndereco(a.vencedor, conta)
  const quem = (endereco: string | null) =>
    !endereco
      ? t('apostas.aguardando')
      : mesmoEndereco(endereco, conta)
        ? t('voce')
        : encurtarEndereco(endereco)

  const ladoOponente = outroLado(a.ladoCriador)
  const blocosFaltando =
    a.status === 'em-jogo' && c.bloco !== null ? a.blocoResolucao - c.bloco + 1n : null
  const podeJogar = blocosFaltando !== null && blocosFaltando <= 0n
  const expirou =
    c.bloco !== null && a.status === 'em-jogo' && c.bloco > a.blocoResolucao + JANELA_BLOCOS
  const restaDevolver = a.valor - a.devolvido
  const saldoInsuficiente = c.saldoContrato !== null && c.saldoContrato < a.valor

  const etiqueta: Record<Aposta['status'], [string, string]> = {
    aberta: [t('apostas.status.aberta'), 'bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200'],
    'em-jogo': [t('apostas.status.em-jogo'), 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200'],
    resolvida: [
      t('apostas.status.resolvida'),
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200',
    ],
    cancelada: [t('apostas.status.cancelada'), 'bg-gray-200/70 text-gray-600 dark:bg-white/10 dark:text-white/60'],
    reembolsada: [t('apostas.status.reembolsada'), 'bg-gray-200/70 text-gray-600 dark:bg-white/10 dark:text-white/60'],
  }
  const [textoEtiqueta, corEtiqueta] = etiqueta[a.status]

  const valorDevolver = lerEth(textoDevolver)
  const devolucaoValida =
    valorDevolver !== null && valorDevolver > 0n && valorDevolver <= restaDevolver

  return (
    <li
      className={`shrink-0 rounded-2xl px-3 py-2 text-sm ${
        souCriador || mesmoEndereco(a.oponente, conta)
          ? 'bg-white/80 ring-2 ring-pink-200 dark:bg-white/10 dark:ring-violet-400/40'
          : 'bg-white/60 dark:bg-white/5'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span>
          <span className="opacity-60">#{a.id}</span> ·{' '}
          <strong>{formatarEth(a.valor, 5)} ETH</strong>
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${corEtiqueta}`}>
          {textoEtiqueta}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-xs">
          {EMOJI[a.ladoCriador]} {quem(a.criador)} <span className="opacity-50">×</span>{' '}
          {EMOJI[ladoOponente]} {quem(a.oponente)}
        </span>

        {/* Ação de cada estado */}
        {a.status === 'aberta' &&
          (souCriador ? (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => c.cancelarAposta(a.id)}
              className={`${botaoPequeno} bg-white hover:bg-pink-50 dark:bg-white/10 dark:hover:bg-white/20`}
            >
              {t('apostas.cancelar')}
            </button>
          ) : saldoInsuficiente ? (
            <button
              type="button"
              onClick={onAbrirCarteira}
              title={t('apostas.saldoNaoCobre')}
              className={`${botaoPequeno} bg-white hover:bg-pink-50 dark:bg-white/10`}
            >
              {t('apostas.depositarParaEntrar')}
            </button>
          ) : (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => c.entrarAposta(a.id)}
              className={`${botaoPequeno} bg-pink-400 text-white hover:bg-pink-500 dark:bg-violet-400`}
            >
              {t('apostas.entrarCom', { emoji: EMOJI[ladoOponente] })}
            </button>
          ))}

        {a.status === 'em-jogo' &&
          (podeJogar ? (
            <button
              type="button"
              disabled={ocupado}
              onClick={() => onJogarMoeda(a.id)}
              className={`${botaoPequeno} animate-pulse bg-linear-to-r from-pink-400 to-violet-400 text-white`}
            >
              {expirou ? t('apostas.reembolsar') : t('apostas.jogarMoeda')}
            </button>
          ) : (
            <span className="shrink-0 text-xs opacity-70">{t('apostas.proximoBloco')}</span>
          ))}

        {a.status === 'resolvida' && (
          <span className="shrink-0 text-xs font-semibold">🏆 {quem(a.vencedor)}</span>
        )}
      </div>

      {/* Vencedor pode devolver ao perdedor */}
      {a.status === 'resolvida' && souVencedor && restaDevolver > 0n && (
        <div className="mt-1.5">
          {!devolvendo ? (
            <button
              type="button"
              onClick={() => {
                setDevolvendo(true)
                setTextoDevolver(formatarEth(restaDevolver, 18))
              }}
              className="text-xs underline decoration-dotted underline-offset-2 opacity-80 hover:opacity-100"
            >
              {t('apostas.devolverAbrir')}
            </button>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!devolucaoValida || valorDevolver === null) return
                if (await c.devolverAoPerdedor(a.id, valorDevolver)) setDevolvendo(false)
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                inputMode="decimal"
                aria-label={t('apostas.quantoDevolver')}
                value={textoDevolver}
                disabled={ocupado}
                onChange={(e) => setTextoDevolver(e.target.value.replace(/[^\d.,]/g, ''))}
                className="min-w-0 flex-1 rounded-xl border-2 border-pink-200 bg-white/80 px-2 py-0.5 text-xs outline-none focus:border-pink-400 dark:border-white/15 dark:bg-white/10"
              />
              <button
                type="submit"
                disabled={!devolucaoValida || ocupado}
                className={`${botaoPequeno} bg-pink-400 text-white dark:bg-violet-400`}
              >
                {t('apostas.devolver')}
              </button>
              <button
                type="button"
                onClick={() => setDevolvendo(false)}
                aria-label={t('apostas.cancelarDevolucao')}
                className="grid h-6 w-6 place-items-center rounded-full text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      )}
      {a.status === 'resolvida' && a.devolvido > 0n && (
        <p className="mt-1 text-[11px] opacity-70">
          {t('apostas.devolvido', { valor: formatarEth(a.devolvido, 5) })}
        </p>
      )}
    </li>
  )
}
