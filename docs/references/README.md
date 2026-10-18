# Referências técnicas

## Objetivo

As referências registram contratos consultáveis: nomes publicados, assinaturas, opções, retornos, efeitos globais e arquivos que implementam cada parte. Para aprender uma tarefa por etapas, comece pelos [guias](../guides/README.md); use estas páginas para confirmar comportamento e detalhes de API.

## Catálogo

- [API completa](./api.md): helpers do export padrão, exemplos, parâmetros, limites e specs relacionadas.
- [Classe `StringBuilder`](./string-builder.md): construtor, todos os métodos, comportamento de mutação e padrões de encadeamento.
- [Tipos publicados](./types.md): `BytesOptions`, `PrettyBytes`, `PrettyTime` e sua relação com o subpath `types`.

## Como usar estas referências

1. Identifique o subpath público em `package.json`.
2. Consulte a assinatura e as opções nesta seção.
3. Confirme comportamento de borda no módulo de implementação e na spec indicada.
4. Use o [guia de desenvolvimento](../development.md) para escolher comandos de validação.

## Manutenção

Quando um símbolo público, opção, tipo ou entry point mudar, atualize a página correspondente e os guias que o demonstram. Confirme que exemplos compilam conceitualmente contra os tipos do pacote, que links apontam para arquivos existentes e que nenhum detalhe de `README copy.md` foi tratado como contrato sem confirmação no código.
