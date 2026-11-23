import { useEffect, useRef, useState } from 'react'
import { ApostasCripto } from './component/ApostasCripto'
import { BotaoCarteira } from './component/BotaoCarteira'
import { useCarteira } from './component/carteira'
import {
  lerAposta,
  mesmoEndereco,
  rodadaDaAposta,
  useContrato,
  type Aposta,
} from './component/contrato'
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

type Modo = 'local' | 'cripto'

function App() {
  // Modo de jogo: entre amigos (sorteio no navegador) ou valendo ETH (sorteio no contrato)
  const [modo, setModo] = useState<Modo>('local')

  // Carteira + contrato (compartilhados entre o botão da carteira e as apostas)
  const carteira = useCarteira()
  const [painelCarteiraAberto, setPainelCarteiraAberto] = useState(false)
  // Apostas que já animamos (para não girar a moeda duas vezes)
  const apostasAnimadas = useRef(new Set<number>())
  // Alguém (nós ou o oponente) jogou a moeda numa aposta nossa: mostramos o resultado
  const aoResolverAposta = useRef<(a: Aposta) => void>(() => {})
  const contrato = useContrato(carteira.conta, (a) => aoResolverAposta.current(a))
  // Moeda girando enquanto a rede confirma a jogada
  const [aguardando, setAguardando] = useState(false)

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

  // Gira a moeda até cair no lado da rodada `nova` (vale para os dois modos)
  function girar(nova: Rodada) {
    const de = angulo % 360
    const faceAtual: Lado = de === 0 ? 'cara' : 'coroa'
    const ate = de + 1800 + (ladoDaMoeda(nova) === faceAtual ? 0 : 180)

    setRodada(null)
    setPendente(nova)
    setGirando(true)
    setAnimacao((a) => ({ id: a.id + 1, de, ate }))
    mostrarMoeda()
  }

  // Modo "entre amigos": sorteia no navegador
  function jogar() {
    if (girando || !nomesPreenchidos) return

    // Sorteia já no início para a moeda cair no lado certo,
    // mas o resultado só é revelado quando a animação terminar.
    girar(
      sortearRodada(normalizarQuantidade(multiplicador), nomeCara, nomeCoroa, apostaInput.trim()),
    )
  }

  // Modo "valendo ETH": o contrato sorteia. A moeda gira em suspense até a rede confirmar.
  async function jogarMoedaCripto(id: number) {
    if (girando || aguardando) return
    apostasAnimadas.current.add(id)
    setRodada(null)
    setAguardando(true)
    mostrarMoeda()

    const ok = await contrato.resolverAposta(id)
    const aposta = ok ? await lerAposta(id).catch(() => null) : null
    setAguardando(false)

    const nova = aposta && rodadaDaAposta(aposta, carteira.conta)
    if (nova) girar(nova)
    else apostasAnimadas.current.delete(id)
  }

  // Resultado que chegou pela atualização automática (ex.: o oponente jogou a moeda)
  useEffect(() => {
    aoResolverAposta.current = (a) => {
      const minha =
        mesmoEndereco(a.criador, carteira.conta) || mesmoEndereco(a.oponente, carteira.conta)
      if (!minha || apostasAnimadas.current.has(a.id) || girando || aguardando) return
      const nova = rodadaDaAposta(a, carteira.conta)
      if (!nova) return
      apostasAnimadas.current.add(a.id)
      girar(nova)
    }
  })

  function fimDaAnimacao() {
    if (!pendente) return
    const nova = pendente
    setAngulo(animacao.ate % 360)
    setPendente(null)
    setGirando(false)
    setRodada(nova)
    setHistorico((h) => [nova, ...h].slice(0, 10))
    setPlacar((p) => ({
      cara: p.cara + nova.caras,
      coroa: p.coroa + nova.coroas,
    }))
  }

  function zerar() {
    setRodada(null)
    setPlacar({ cara: 0, coroa: 0 })
    setHistorico([])
  }

  // Durante/depois da jogada, a moeda mostra os nomes daquela jogada
  const nomesMoeda = pendente ?? rodada

  return (
    <main className="relative mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 gap-5 px-4 py-5 text-center lg:h-dvh lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:gap-8 lg:overflow-hidden lg:px-8">
      <Fundo />
      <BotaoCarteira
        carteira={carteira}
        contrato={contrato}
        aberto={painelCarteiraAberto}
        setAberto={setPainelCarteiraAberto}
      />

      {/* Coluna da esquerda: o "palco" com a moeda e o resultado */}
      <div ref={palcoRef} className="flex min-h-0 scroll-mt-2 flex-col items-center gap-2 sm:gap-3">
        <header className="flex flex-col items-center">
          <h1 className="titulo-fofo text-[2rem] font-bold tracking-tight sm:text-5xl">
            Cara ou Coroa
          </h1>
          <p className="text-sm opacity-80 sm:text-base">Decidam na sorte, sem brigas ✨</p>
        </header>

        <Moeda
          girando={girando}
          aguardando={aguardando}
          mostrarFace={rodada !== null || girando}
          angulo={angulo}
          animacao={animacao}
          rotuloCara={nomesMoeda?.nomeCara || (modo === 'local' ? nomeCara : '')}
          rotuloCoroa={nomesMoeda?.nomeCoroa || (modo === 'local' ? nomeCoroa : '')}
          onFimDaAnimacao={fimDaAnimacao}
        />

        <Resultado
          girando={girando}
          pendente={pendente}
          rodada={rodada}
          nomesPreenchidos={nomesPreenchidos}
          aguardando={aguardando}
          mensagemVazia={
            modo === 'cripto'
              ? 'Crie uma aposta ou entre numa aberta. Quando a moeda for jogada, ela gira aqui! 🪙'
              : undefined
          }
        />
      </div>

      {/* Coluna da direita: controles + placar */}
      <div className="flex min-h-0 flex-col items-center gap-4 lg:justify-center lg:pt-14">
        <div className="cartao flex w-full max-w-md shrink-0 flex-col items-center gap-4 p-5">
          {/* Seletor de modo */}
          <div
            role="tablist"
            aria-label="Modo de jogo"
            className="grid w-full grid-cols-2 rounded-full bg-white/70 p-1 dark:bg-white/10"
          >
            {(
              [
                ['local', '🎲 Entre amigos'],
                ['cripto', '💎 Valendo ETH'],
              ] as const
            ).map(([m, texto]) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={modo === m}
                disabled={girando || aguardando}
                onClick={() => {
                  setModo(m)
                  setRodada(null)
                }}
                className={`rounded-full py-1.5 text-sm font-semibold transition disabled:opacity-60 ${
                  modo === m
                    ? 'bg-linear-to-r from-pink-400 to-violet-400 text-white shadow-md shadow-pink-300/50 dark:shadow-violet-900/50'
                    : 'hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                {texto}
              </button>
            ))}
          </div>

          {modo === 'local' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                jogar()
              }}
              className="flex w-full flex-col items-center gap-4"
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

              <Multiplicador
                valor={multiplicador}
                desabilitado={girando}
                onChange={setMultiplicador}
              />

              <BotaoJogar girando={girando} nomesPreenchidos={nomesPreenchidos} />
            </form>
          ) : (
            <ApostasCripto
              carteira={carteira}
              contrato={contrato}
              ocupado={girando || aguardando}
              onAbrirCarteira={() => setPainelCarteiraAberto(true)}
              onJogarMoeda={jogarMoedaCripto}
            />
          )}
        </div>

        <section
          className={`cartao w-full max-w-md shrink-0 flex-col items-center gap-3 p-5 ${
            modo === 'local' ? 'flex' : 'hidden'
          }`}
        >
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
