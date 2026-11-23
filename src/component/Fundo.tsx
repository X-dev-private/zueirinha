// Decoração do fundo: bolhas desfocadas + estrelinhas e corações flutuando

const BOLHAS = [
  { cor: '#ff9ccf', tamanho: 320, top: '-6%', left: '-8%', atraso: '0s' },
  { cor: '#b9a2ff', tamanho: 380, top: '40%', left: '70%', atraso: '-6s' },
  { cor: '#8fd8ff', tamanho: 300, top: '75%', left: '-5%', atraso: '-12s' },
  { cor: '#ffd98f', tamanho: 220, top: '8%', left: '78%', atraso: '-3s' },
]

const ENFEITES = [
  { s: '✦', cor: '#ffb3d9', tam: 22, top: '12%', left: '14%', atraso: '0s' },
  { s: '♥', cor: '#ff8fc4', tam: 18, top: '22%', left: '86%', atraso: '-2s' },
  { s: '✧', cor: '#b9a2ff', tam: 26, top: '48%', left: '6%', atraso: '-4s' },
  { s: '●', cor: '#a8e6ff', tam: 10, top: '60%', left: '92%', atraso: '-1s' },
  { s: '✦', cor: '#ffd36e', tam: 16, top: '80%', left: '20%', atraso: '-5s' },
  { s: '♥', cor: '#c6a8ff', tam: 14, top: '88%', left: '78%', atraso: '-3s' },
  { s: '✧', cor: '#ff9ccf', tam: 20, top: '35%', left: '94%', atraso: '-7s' },
  { s: '●', cor: '#ffc2e0', tam: 8, top: '6%', left: '50%', atraso: '-2.5s' },
]

export function Fundo() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BOLHAS.map((b, i) => (
        <div
          key={i}
          className="bolha"
          style={{
            background: b.cor,
            width: b.tamanho,
            height: b.tamanho,
            top: b.top,
            left: b.left,
            animationDelay: b.atraso,
          }}
        />
      ))}
      {ENFEITES.map((e, i) => (
        <span
          key={i}
          className="enfeite"
          style={{
            color: e.cor,
            fontSize: e.tam,
            top: e.top,
            left: e.left,
            animationDelay: e.atraso,
          }}
        >
          {e.s}
        </span>
      ))}
    </div>
  )
}
