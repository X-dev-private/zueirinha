import { useRef, useState } from 'react'
import { BotaoJogar } from './component/BotaoJogar'
import { Fundo } from './component/Fundo'
import { Historico } from './component/Historico'
import { Jogadores } from './component/Jogadores'
import { Moeda } from './component/Moeda'
import { Multiplicador } from './component/Multiplicador'
import { Placar } from './component/Placar'
import { Resultado } from './component/Resultado'
import {
  ladoDaMoeda,
  normalizarQuantidade,
  sortearRodada,
  type Lado,
  type Rodada,
} from './component/jogo'

function App() {
  // Jogo
  const [rodada, setRodada] = useState<Rodada | null>(null)
  const [pendente, setPendente] = useState<Rodada | null>(null)
  const [girando, setGirando] = useState(false)
  const [placar, setPlacar] = useState({ cara: 0, coroa: 0 })
  const [historico, setHistorico] = useState<Rodada[]>([])
  const [multiplicador, setMultiplicador] = useState(1)

  // Animação da moeda
  const [angulo, setAngulo] = useState(0)
  const [animacao, setAnimacao] = useState({ id: 0, de: 0, ate: 0 })

  // Formulário
  const [nomeCaraInput, setNomeCaraInput] = useState('')
  const [nomeCoroaInput, setNomeCoroaInput] = useState('')
  const [apostaInput, setApostaInput] = useState('')

  const nomeCara = nomeCaraInput.trim()
  const nomeCoroa = nomeCoroaInput.trim()
  const nomesPreenchidos = nomeCara !== '' && nomeCoroa !== ''

  // Área da moeda: no celular, rolamos até ela ao jogar
  const palcoRef = useRef<HTMLDivElement>(null)

  function mostrarMoeda() {
    const palco = palcoRef.current
    if (!palco) return
    const r = palco.getBoundingClientRect()
    if (r.top < 0 || r.bottom > window.innerHeight) {
      palco.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function jogar() {
    if (girando || !nomesPreenchidos) return

    // Sorteia já no início para a moeda cair no lado certo,
    // mas o resultado só é revelado quando a animação terminar.
    const nova = sortearRodada(
      normalizarQuantidade(multiplicador),
      nomeCara,
      nomeCoroa,
      apostaInput.trim(),
    )

    const de = angulo % 360
    const faceAtual: Lado = de === 0 ? 'cara' : 'coroa'
    const ate = de + 1800 + (ladoDaMoeda(nova) === faceAtual ? 0 : 180)

    setRodada(null)
    setPendente(nova)
    setGirando(true)
    setAnimacao((a) => ({ id: a.id + 1, de, ate }))
    mostrarMoeda()
  }

  function fimDaAnimacao() {
    if (!pendente) return
    const nova = pendente
    setAngulo(animacao.ate % 360)
    setPendente(null)
    setGirando(false)
    setRodada(nova)
    setHistorico((h) => [nova, ...h].slice(0, 10))
    setPlacar((p) => ({ cara: p.cara + nova.caras, coroa: p.coroa + nova.coroas }))
  }

  function zerar() {
    setRodada(null)
    setPlacar({ cara: 0, coroa: 0 })
    setHistorico([])
  }

  // Durante/depois da jogada, a moeda mostra os nomes daquela jogada
  const nomesMoeda = pendente ?? rodada

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 gap-5 px-4 py-5 text-center lg:h-dvh lg:grid-cols-2 lg:gap-8 lg:overflow-hidden lg:px-8">
      <Fundo />

      {/* Coluna da esquerda: o "palco" com a moeda e o resultado */}
      <div ref={palcoRef} className="flex min-h-0 scroll-mt-2 flex-col items-center gap-2 sm:gap-3">
        <header className="flex flex-col items-center">
          <h1 className="titulo-fofo text-4xl font-bold tracking-tight sm:text-5xl">
            Cara ou Coroa
          </h1>
          <p className="text-sm opacity-80 sm:text-base">Decidam na sorte, sem brigas ✨</p>
        </header>

        <Moeda
          girando={girando}
          mostrarFace={rodada !== null || girando}
          angulo={angulo}
          animacao={animacao}
          rotuloCara={nomesMoeda?.nomeCara || nomeCara}
          rotuloCoroa={nomesMoeda?.nomeCoroa || nomeCoroa}
          onFimDaAnimacao={fimDaAnimacao}
        />

        <Resultado
          girando={girando}
          pendente={pendente}
          rodada={rodada}
          nomesPreenchidos={nomesPreenchidos}
        />
      </div>

      {/* Coluna da direita: controles + placar */}
      <div className="flex min-h-0 flex-col items-center gap-4 lg:justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            jogar()
          }}
          className="cartao flex w-full max-w-md shrink-0 flex-col items-center gap-4 p-5"
        >
          <Jogadores
            nomeCara={nomeCaraInput}
            nomeCoroa={nomeCoroaInput}
            aposta={apostaInput}
            desabilitado={girando}
            onNomeCara={setNomeCaraInput}
            onNomeCoroa={setNomeCoroaInput}
            onAposta={setApostaInput}
          />

          <Multiplicador valor={multiplicador} desabilitado={girando} onChange={setMultiplicador} />

          <BotaoJogar girando={girando} nomesPreenchidos={nomesPreenchidos} />
        </form>

        <section className="cartao flex min-h-0 w-full max-w-md flex-col items-center gap-3 p-5">
          <Placar
            nomeCara={nomeCara}
            nomeCoroa={nomeCoroa}
            cara={placar.cara}
            coroa={placar.coroa}
            onZerar={zerar}
          />

          <Historico jogadas={historico} />
        </section>
      </div>
    </main>
  )
}

export default App
