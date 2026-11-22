import { useState } from 'react'
import { BotaoJogar } from './component/BotaoJogar'
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
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 text-center">
      <h1 className="text-4xl font-bold">Cara ou Coroa</h1>

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

      <BotaoJogar girando={girando} nomesPreenchidos={nomesPreenchidos} onJogar={jogar} />

      <Placar
        nomeCara={nomeCara}
        nomeCoroa={nomeCoroa}
        cara={placar.cara}
        coroa={placar.coroa}
        onZerar={zerar}
      />

      <Historico jogadas={historico} />
    </main>
  )
}

export default App
