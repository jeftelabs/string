# Desenvolvimento, testes e publicação

## Objetivo e escopo

Este guia explica como preparar o ambiente, escolher comandos, entender testes e build e acompanhar a publicação do pacote. A intenção é tornar explícitos os efeitos dos scripts para quem mantém o repositório e para agentes de IA. As descrições refletem `package.json` e workflows atualmente versionados; confira essas fontes antes de executar um release, pois configuração, credenciais, versões e políticas podem mudar.

## Pré-requisitos e instalação

O projeto usa Node.js, npm, TypeScript, `tsdown` e ferramentas locais instaladas em `devDependencies`. Não há campo `engines` em `package.json`, portanto este repositório não declara por esse campo uma versão mínima de Node. O workflow de publicação configura Node 24; o runner TypeScript também depende de `@jeftelabs/exec`.

```sh
npm ci
```

Use `npm ci` para reproduzir as versões travadas em `package-lock.json`. `npm install` é apropriado quando intencionalmente se altera a resolução/dependências; revise e documente o lockfile nesse caso.

## Como executar as tarefas

| Comando | O que faz | Efeito relevante |
| --- | --- | --- |
| `npm test` | Executa o lifecycle `pretest` (ESLint) e então `c8 npm run quick:test`. | Gera relatório de cobertura em texto e HTML conforme a configuração `c8`. |
| `npm run quick:test` | Executa `bin/test.ts` através de `node --import=@jeftelabs/exec --enable-source-maps`. | Roda os arquivos `tests/**/*.spec.ts` sem coverage. |
| `npm run lint` | Executa `eslint .`. | Verifica o repositório, incluindo as regras de formatação integradas ao ESLint. |
| `npm run typecheck` | Executa `tsc --noEmit`. | Verifica tipos sem emitir saída. |
| `npm run compile` | Roda `tsdown` e `tsc --emitDeclarationOnly --declaration`. | Gera arquivos de distribuição/declarations em `build/`; lifecycle `precompile` executa lint antes. |
| `npm run build` | Encaminha para `npm run compile`. | Atualiza o diretório gerado `build/`. |
| `npm run format` | Executa `prettier --write .`. | Modifica arquivos; revise o diff. O lint também reporta diferenças detectadas pela regra Prettier. |
| `npm run commit` | Inicia Commitizen configurado para Conventional Commits. | Interativo. |

`npm test` não chama explicitamente `typecheck` ou `build`; não suponha que ele valida essas etapas. Escolha os comandos compatíveis com o escopo da alteração e com o pedido recebido.

## Organização e execução dos testes

`bin/test.ts` importa os plugins de `@t8ngs` para asserções, snapshots, filesystem e tipos, configura `@t8ngs/runner` para procurar `tests/**/*.spec.ts` e inicia o runner. O helper de filesystem é importado de `@t8ngs/fs`, conforme declarado em `devDependencies`. As specs importam normalmente o código fonte TypeScript (`../src/...`, `../index.ts`), portanto verificam o código do repositório em vez de apenas artefatos publicados.

O runner é iniciado pelo loader `@jeftelabs/exec`, que exige `compilerOptions.rewriteRelativeImportExtensions: true` para resolver importações relativas com extensão `.ts`. Essa opção está explícita em `tsconfig.json`; mantenha-a ao alterar a configuração, pois os fontes e testes usam imports com `.ts`.

As convenções presentes:

- Agrupe casos relacionados por helper usando `test.group`.
- Use assertions e testes de tipo existentes para registrar retorno, erros, opções e tipos públicos relevantes.
- Reaproveite snapshots quando o resultado for uma sequência longa ou conjunto de linhas.
- Para substituições globais via `.use()` ou regras de dependência, restaure o estado ao final do caso para evitar dependência entre testes.
- Mantenha nomes de specs alinhados ao helper ou família que cobrem.

## Build e estrutura publicada

`package.json` lista `index.ts`, `src/types.ts` e `string_builder.ts` como entradas do `tsdown`; a saída é ESM no diretório `build/`. `tsdown` limpa `build/` antes de emitir e usa `target: esnext`. Em seguida, o compilador TypeScript emite declarações. `files` do pacote inclui `build` e exclui os diretórios buildados de `bin` e `tests`.

O campo `exports` define estes pontos de entrada publicados:

| Import | Arquivo gerado |
| --- | --- |
| `@jeftelabs/string` | `build/index.js` |
| `@jeftelabs/string/types` | `build/src/types.js` |
| `@jeftelabs/string/builder` | `build/string_builder.js` |

Ao alterar exports, entradas do bundler, tipos públicos ou `files`, confira a saída e mantenha os exemplos de instalação/importação em `README.md`, `docs/guides/` e `docs/references/api.md` sincronizados.

## CI e workflows

Workflows presentes em `.github/workflows/`:

- `checks.yml` roda ao fazer `push` em `main`; configura Node LTS e valida mensagens de commit com commitlint. Apesar de conter uma condição para commits de pull request, o gatilho atual do workflow não inclui `pull_request`.
- `release.yml` roda em `push` para `main` e usa Release Please. Quando cria um release, instala dependências, constrói o pacote e anexa o resultado de `npm pack` à release.
- `deploy.yml` reage à publicação de uma release e publica o pacote no GitHub Packages e no npm. Configura Node 24, executa `npm ci`, `npm run build` e `npm publish` em cada registry.
- `toc.yml` atualiza o sumário do README e faz push do commit `chore(docs): update TOC`; por isso declara `permissions: contents: write`. Sem essa permissão o `GITHUB_TOKEN` é somente leitura e o push falha com 403.
- `toc.yml`, `stale.yml` e `labels.yml` automatizam tarefas de issue/PR e manutenção do repositório; não fazem parte da execução da biblioteca.

Estas descrições refletem o YAML local; não significam que as workflows tenham sido executadas ou que os segredos de publicação estejam disponíveis.

## Decisões e manutenção de dependências/configuração

1. Identifique se a dependência é usada durante runtime ou só no desenvolvimento: `dependencies` é empacotado para consumidores; `devDependencies` serve build, testes, lint e tarefas do repositório.
2. Atualize `package-lock.json` de forma intencional.
3. Registre em `docs/` por que a dependência/configuração é necessária, o que passa a fazer e qualquer impacto de compatibilidade.
4. Atualize testes, README, referência de API, workflows e configuração de build se o contrato afetado mudar.
5. Rode os comandos relevantes e descreva o que foi executado; não afirme validação que não aconteceu.

## Manutenção e verificação

Quando um script, workflow, dependência, tipo de build ou entry point mudar:

1. Leia a configuração e o arquivo de workflow real; registre neste guia os gatilhos, entradas e efeitos que mudaram.
2. Atualize o comando correspondente e explique se ele gera artefatos, coverage ou altera arquivos.
3. Confira se README, `AGENTS.md`, `CLAUDE.md` e os guias de arquitetura/API continuam coerentes.
4. Execute as validações pertinentes, registre sucesso ou falha com precisão e não trate a descrição do fluxo como evidência de que ele foi executado.

Os comandos `lint`, `typecheck`, `quick:test`, `test` e `build` verificam dimensões diferentes. Consulte a tabela de scripts e selecione os que cobrem o escopo da mudança; não presuma que um único comando cobre todas as dimensões.

## Fluxo de release

O fluxo configurado começa com commits em `main`, usa Release Please para criar release/tag e, após publicação da release, constrói e publica os pacotes em dois registries. `prepublishOnly` também executa o build ao publicar pelo npm. Não faça commit, push, tag ou publicação sem solicitação explícita; credenciais são fornecidas por secrets de GitHub Actions e nunca devem ser copiadas para arquivos ou logs.

Para detalhes de contribuições, requisitos de documentação e regras de segurança, consulte [`AGENTS.md`](../AGENTS.md) e [`CLAUDE.md`](../CLAUDE.md).
