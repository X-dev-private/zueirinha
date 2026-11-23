import { useEffect, useRef, useState } from 'react'
import { vencedor, type Rodada } from './jogo'

type Props = {
  jogadas: Rodada[]
}

// Botão "Ver últimas jogadas" que abre um painel flutuante por cima do
// conteúdo, sem empurrar nada para fora da tela.
export function Historico({ jogadas }: Props) {
  const [aberto, setAberto] = useState(false)
  const caixaRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!aberto) return
    function aoClicar(e: PointerEvent) {
      if (!caixaRef.current?.contains(e.target as Node)) setAberto(false)
    }
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('pointerdown', aoClicar)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('pointerdown', aoClicar)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto])

  if (jogadas.length === 0) return null

  return (
    <div ref={caixaRef} className="relative w-full">
      {/* Painel (abre para cima) */}
      <div
        id="painel-historico"
        role="dialog"
        aria-label="Últimas jogadas"
        inert={!aberto}
        className={`absolute right-0 bottom-full left-0 z-20 mb-2 origin-bottom rounded-3xl border-2 border-white bg-[var(--carteira-fundo)] p-3 text-left shadow-2xl shadow-violet-300/40 transition duration-200 ease-out dark:border-white/10 dark:shadow-black/50 ${
          aberto ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold">🕘 Últimas jogadas</h2>
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar"
            className="grid h-7 w-7 place-items-center rounded-full text-xs opacity-60 transition hover:bg-pink-100 hover:opacity-100 dark:hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <ul className="flex max-h-60 flex-col gap-1 overflow-y-auto pr-1">
          {jogadas.map((j, i) => {
            const v = vencedor(j)
            return (
              <li
                key={jogadas.length - i}
                className={`flex shrink-0 items-start gap-2 rounded-xl px-3 py-1.5 text-sm break-words ${
                  v === null
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
                }`}
              >
                <span className="shrink-0 opacity-60">#{jogadas.length - i}</span>
                <span className="min-w-0">
                  {j.quantidade > 1 && `${j.quantidade}x · `}
                  {v === null ? '🤝 Empate' : `🏆 ${v}`}
                  {j.quantidade > 1 && ` (${j.caras} × ${j.coroas})`}
                  {j.aposta && ` · ${j.aposta}`}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Botão que abre/fecha */}
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls="painel-historico"
        className="flex w-full items-center justify-between rounded-2xl bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--texto-forte)] transition hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15"
      >
        <span className="flex items-center gap-2">
          🕘 Últimas jogadas
          <span className="rounded-full bg-pink-400 px-2 text-xs leading-5 text-white dark:bg-violet-400">
            {jogadas.length}
          </span>
        </span>
        <span
          aria-hidden
          className={`text-xs transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`}
        >
          ▲
        </span>
      </button>
    </div>
  )
}
