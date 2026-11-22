import { vencedor, type Rodada } from './jogo'

type Props = {
  girando: boolean
  pendente: Rodada | null
  rodada: Rodada | null
  nomesPreenchidos: boolean
}

export function Resultado({ girando, pendente, rodada, nomesPreenchidos }: Props) {
  return (
    <div className="flex min-h-40 w-full max-w-md items-center justify-center">
      {girando && (
        <p className="text-xl font-semibold">
          {pendente && pendente.quantidade > 1
            ? `Jogando a moeda ${pendente.quantidade} vezes...`
            : 'Jogando a moeda...'}
        </p>
      )}

      {!girando && !rodada && (
        <p className="text-lg">
          {nomesPreenchidos
            ? 'Tudo pronto! Clique em "Jogar a moeda".'
            : 'Coloque o nome de quem é Cara e de quem é Coroa para começar.'}
        </p>
      )}

      {!girando && rodada && <CartaoResultado rodada={rodada} />}
    </div>
  )
}

function CartaoResultado({ rodada }: { rodada: Rodada }) {
  const v = vencedor(rodada)
  const empate = v === null

  return (
    <div
      className={`flex w-full flex-col gap-3 rounded-2xl border-2 p-5 ${
        empate ? 'border-yellow-500 bg-yellow-500/10' : 'border-green-500 bg-green-500/10'
      }`}
    >
      {/* Título */}
      <p
        className={`text-3xl font-bold break-words ${empate ? 'text-yellow-600' : 'text-green-600'}`}
      >
        {empate ? 'Deu empate!' : `${v} venceu!`}
      </p>

      {/* Como foi */}
      {rodada.quantidade === 1 ? (
        <p className="text-lg">
          A moeda caiu em <strong className="uppercase">{rodada.ultimo}</strong>.
        </p>
      ) : (
        <Contagem rodada={rodada} />
      )}

      {/* Aposta */}
      {rodada.aposta && (
        <p className="rounded-lg bg-black/5 px-3 py-2 text-lg break-words dark:bg-white/10">
          {empate ? (
            <>
              Ninguém leva <strong>{rodada.aposta}</strong>. Joguem de novo para desempatar!
            </>
          ) : (
            <>
              <strong>{v}</strong> leva <strong>{rodada.aposta}</strong>!
            </>
          )}
        </p>
      )}
    </div>
  )
}

// Quantas vezes caiu cada lado, quando há várias jogadas
function Contagem({ rodada }: { rodada: Rodada }) {
  const pctCara = Math.round((rodada.caras / rodada.quantidade) * 100)
  const pctCoroa = 100 - pctCara

  return (
    <div className="flex flex-col gap-2">
      <p>
        Em <strong>{rodada.quantidade}</strong> jogadas, a moeda caiu:
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/5 p-2 dark:bg-white/10">
          <p className="truncate text-sm">Cara ({rodada.nomeCara})</p>
          <p className="text-2xl font-bold">{rodada.caras}x</p>
          <p className="text-sm">{pctCara}%</p>
        </div>
        <div className="rounded-lg bg-black/5 p-2 dark:bg-white/10">
          <p className="truncate text-sm">Coroa ({rodada.nomeCoroa})</p>
          <p className="text-2xl font-bold">{rodada.coroas}x</p>
          <p className="text-sm">{pctCoroa}%</p>
        </div>
      </div>

      {/* Barra comparando os dois lados */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-black/10">
        <div className="bg-blue-500" style={{ width: `${pctCara}%` }} />
        <div className="bg-purple-500" style={{ width: `${pctCoroa}%` }} />
      </div>
    </div>
  )
}
