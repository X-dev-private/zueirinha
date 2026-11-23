import { encurtarEndereco, useCarteira } from './carteira'

// Ícone de carteira (herda a cor do texto)
function IconeCarteira() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" aria-hidden>
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17a1 1 0 0 1 1 1v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="3.5" y="7.5" width="17" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

const pilula =
  'botao-carteira flex h-10 items-center gap-2 rounded-full px-2.5 text-sm lg:h-11 font-semibold text-[var(--texto-forte)] transition hover:-translate-y-0.5 active:scale-95 lg:px-4'

export function BotaoCarteira() {
  const { conta, conectando, erro, temCarteira, conectar, desconectar } = useCarteira()

  return (
    <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1.5 lg:top-5 lg:right-8">
      {!temCarteira && (
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
          title="Instale uma carteira (ex.: MetaMask) para conectar"
          className={pilula}
        >
          <span className="text-violet-500 dark:text-violet-300">
            <IconeCarteira />
          </span>
          <span className="hidden lg:inline">Instalar carteira</span>
        </a>
      )}

      {temCarteira && !conta && (
        <button
          type="button"
          onClick={conectar}
          disabled={conectando}
          aria-label="Conectar carteira"
          className={`${pilula} disabled:cursor-wait disabled:opacity-70`}
        >
          <span className="text-violet-500 dark:text-violet-300">
            {conectando ? (
              <span className="block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <IconeCarteira />
            )}
          </span>
          <span className="hidden lg:inline">{conectando ? 'Conectando...' : 'Conectar carteira'}</span>
        </button>
      )}

      {conta && (
        <div className={`${pilula} hover:translate-y-0 active:scale-100`} title={conta}>
          <span className="relative text-violet-500 dark:text-violet-300">
            <IconeCarteira />
            <span className="absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#2a2152]" />
          </span>
          <span className="hidden font-mono text-xs lg:inline">{encurtarEndereco(conta)}</span>
          <button
            type="button"
            onClick={desconectar}
            aria-label="Desconectar carteira"
            title="Desconectar"
            className="-mr-1 grid h-6 w-6 place-items-center rounded-full text-xs opacity-60 transition hover:bg-pink-100 hover:opacity-100 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      )}

      {erro && (
        <p
          role="alert"
          className="surgir max-w-60 rounded-xl bg-white/90 px-3 py-1 text-xs text-pink-600 shadow-md dark:bg-[#2a2152] dark:text-pink-300"
        >
          {erro}
        </p>
      )}
    </div>
  )
}
