# Zueirinha: Cara ou Coroa

Um jogo de cara ou coroa para decidir apostas entre duas pessoas. Você coloca quem é Cara e quem é Coroa, diz o que está sendo apostado e joga a moeda. Ela gira na tela e mostra quem venceu.

## Funcionalidades

- **Jogadores:** o nome de quem é Cara e de quem é Coroa é obrigatório e aparece nas faces da moeda.
- **Aposta (opcional):** o que está em jogo, por exemplo "quem paga o lanche". O resultado diz quem leva.
- **Moeda animada:** a moeda sobe, gira em 3D e cai no lado sorteado. O resultado só aparece quando a animação termina.
- **Multiplicador de partidas:** joga a moeda várias vezes de uma vez, até 100.000. Vence quem tiver mais lados no total, e o resultado mostra quantas vezes caiu cada lado, com a porcentagem e uma barra comparando os dois.
- **Placar e histórico:** o placar soma os lados que caíram para cada pessoa, e o histórico guarda as 10 últimas jogadas.

## Tecnologias

- [React 19](https://react.dev) com TypeScript
- [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com)

## Como rodar

Você precisa do [Node.js](https://nodejs.org), versão 20.19 ou mais nova.

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Depois abra o endereço que aparece no terminal, normalmente http://localhost:5173.

### Outros comandos

| Comando           | O que faz                                    |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Inicia o jogo em modo de desenvolvimento     |
| `npm run build`   | Gera a versão de produção na pasta `dist/`   |
| `npm run preview` | Abre a versão de produção para testar        |
| `npm run lint`    | Verifica o código com o ESLint               |

## Estrutura do projeto

```
src/
├── App.tsx               # Guarda o estado do jogo e junta os componentes
├── main.tsx              # Ponto de entrada do React
├── index.css             # Estilos globais e animação da moeda
└── component/
    ├── jogo.ts           # Regras do jogo: tipos, sorteio, vencedor
    ├── Moeda.tsx         # Moeda 3D com a animação
    ├── Resultado.tsx     # Mensagem de resultado
    ├── Jogadores.tsx     # Campos dos nomes e da aposta
    ├── Multiplicador.tsx # Campo do multiplicador e atalhos
    ├── BotaoJogar.tsx    # Botão "Jogar a moeda"
    ├── Placar.tsx        # Placar por pessoa
    └── Historico.tsx     # Últimas jogadas
```
