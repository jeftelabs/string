# Documentação de `@jeftelabs/string`

Este diretório explica a biblioteca para pessoas que a utilizam ou mantêm e para agentes de IA que precisam navegar pelo código com precisão. A documentação descreve o estado atual do pacote e deve ser revisada junto de qualquer alteração, conforme [`AGENTS.md`](../AGENTS.md).

## Objetivo

O objetivo destes guias é explicar como consumir, entender, modificar e verificar o pacote sem depender de contexto externo. O conteúdo atende tanto a quem usa ou mantém a biblioteca quanto a agentes de IA que precisam localizar as fontes de verdade.

## Como navegar

- Para aprender a usar o pacote: comece pelo [README da raiz](../README.md) e siga os [guias práticos](./guides/README.md).
- Para conferir a assinatura ou o contrato exato de uma função: consulte as [referências técnicas](./references/README.md).
- Para entender onde uma funcionalidade está implementada e por que a estrutura está organizada assim: use o [guia de arquitetura](./architecture.md).
- Para instalar dependências, escolher comandos de validação ou entender a publicação: use o [guia de desenvolvimento](./development.md).
- Para alterar o projeto: leia [`AGENTS.md`](../AGENTS.md), consulte o guia relevante, siga o código e os testes e atualize a documentação junto com a mudança.

## Guias e referências

- [Guias práticos](./guides/README.md): tarefas comuns com exemplos progressivos e links para os símbolos envolvidos.
- [Referências técnicas](./references/README.md): catálogo completo da API, classe `StringBuilder` e tipos publicados.
- [Arquitetura e mapa do código](./architecture.md): organização dos módulos, fluxo das exportações, dependências e limites do pacote.
- [Desenvolvimento, testes e publicação](./development.md): scripts, runner, build, CI e fluxo de release.

## Fonte de verdade

O `package.json` define os nomes publicados, exports, scripts, dependências e configuração de build. `index.ts`, `string_builder.ts` e `src/` definem a implementação. Os testes em `tests/` registram exemplos e contratos verificados. Se houver divergência, confirme nesses arquivos antes de confiar nesta documentação e atualize a página pertinente na mesma mudança.

## Manutenção dos guias

Cada guia deve explicar seu propósito, como o assunto funciona ou é usado, as decisões e limites relevantes e como manter ou verificar essa área. Um guia ensina uma tarefa através de passos; uma referência registra contratos e símbolos consultáveis. Ao alterar conteúdo, confira exemplos e links nas páginas relacionadas, atualize este índice e o índice da seção (`guides/README.md` ou `references/README.md`) se a navegação mudar e preserve o caminho de descoberta pelo README da raiz. A exigência completa está em [`AGENTS.md`](../AGENTS.md).
