import type { CSSProperties } from 'react'

type Props = {
  girando: boolean
  // Girando sem parar enquanto espera um resultado (ex.: a rede confirmar a jogada)
  aguardando?: boolean
  mostrarFace: boolean
  angulo: number
  animacao: { id: number; de: number; ate: number }
  rotuloCara: string
  rotuloCoroa: string
  onFimDaAnimacao: () => void
}

const face =
  'moeda-face flex flex-col items-center justify-center rounded-full border-4 border-amber-300 bg-radial-[at_30%_30%] from-yellow-100 via-yellow-300 to-amber-400 px-3 text-5xl text-amber-900 shadow-[0_12px_30px_-8px_rgba(245,158,11,0.6),inset_0_-6px_0_rgba(217,119,6,0.25)]'

export function Moeda({
  girando,
  aguardando = false,
  mostrarFace,
  angulo,
  animacao,
  rotuloCara,
  rotuloCoroa,
  onFimDaAnimacao,
}: Props) {
  return (
    <div className="moeda-cena mt-16 h-28 w-28 shrink-0 sm:mt-20 sm:h-36 sm:w-36">
      <div
        key={animacao.id}
        onAnimationEnd={onFimDaAnimacao}
        className={`moeda h-full w-full ${girando ? 'moeda-girando' : aguardando ? 'moeda-suspense' : ''}`}
        style={
          {
            '--de': `${animacao.de}deg`,
            '--ate': `${animacao.ate}deg`,
            transform: girando || aguardando ? undefined : `rotateY(${angulo}deg)`,
          } as CSSProperties
        }
      >
        <div className={face}>
          <span>{mostrarFace || aguardando ? '🙂' : '?'}</span>
          {(mostrarFace || aguardando) && (
            <span className="max-w-full truncate text-sm font-bold">{rotuloCara || 'CARA'}</span>
          )}
        </div>
        <div className={`${face} moeda-verso`}>
          <span>👑</span>
          <span className="max-w-full truncate text-sm font-bold">{rotuloCoroa || 'COROA'}</span>
        </div>
      </div>
    </div>
  )
}
