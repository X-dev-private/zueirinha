import type { CSSProperties } from 'react'

type Props = {
  girando: boolean
  mostrarFace: boolean
  angulo: number
  animacao: { id: number; de: number; ate: number }
  rotuloCara: string
  rotuloCoroa: string
  onFimDaAnimacao: () => void
}

const face =
  'moeda-face flex flex-col items-center justify-center rounded-full border-4 border-yellow-600 bg-yellow-400 px-3 text-5xl text-yellow-900 shadow-lg'

export function Moeda({
  girando,
  mostrarFace,
  angulo,
  animacao,
  rotuloCara,
  rotuloCoroa,
  onFimDaAnimacao,
}: Props) {
  return (
    <div className="moeda-cena mt-24 h-36 w-36">
      <div
        key={animacao.id}
        onAnimationEnd={onFimDaAnimacao}
        className={`moeda h-full w-full ${girando ? 'moeda-girando' : ''}`}
        style={
          {
            '--de': `${animacao.de}deg`,
            '--ate': `${animacao.ate}deg`,
            transform: girando ? undefined : `rotateY(${angulo}deg)`,
          } as CSSProperties
        }
      >
        <div className={face}>
          <span>{mostrarFace ? '🙂' : '?'}</span>
          {mostrarFace && (
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
