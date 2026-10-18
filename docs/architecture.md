# Arquitetura e mapa do código

## Objetivo e escopo

`@jeftelabs/string` reúne helpers pequenos para operações comuns em strings e valores apresentados como texto. O pacote oferece transformações de caixa e de palavras, pluralização, interpolação, truncamento, construção de frases, alinhamento e quebra de linhas, escaping HTML, normalização de barras de caminho, além de utilitários para UUID, strings aleatórias, duração e bytes.

O pacote é ESM e escrito em TypeScript. Ele não é um framework de templates nem faz sanitização geral de HTML: `interpolate` insere valores e `htmlEscape` codifica caracteres para HTML, mas o chamador escolhe quando e onde aplicar escaping. Não há API de I/O de arquivos; `toUnixSlash` apenas converte separadores em uma string de caminho.

## Mapa do repositório

| Caminho | Responsabilidade |
| --- | --- |
| [`index.ts`](../index.ts) | Monta e exporta por padrão o objeto `string`, que agrupa os helpers públicos. |
| [`string_builder.ts`](../string_builder.ts) | Exporta por padrão `StringBuilder`, um wrapper mutável com métodos encadeáveis. |
| `src/change_case.ts` | Conversões para camel, snake, dash, dot, Pascal, capital, sentence, title e no case. |
| `src/pluralize.ts` | Pluralização, singularização, inspeção de número e regras de inflexão. |
| `src/slugify.ts` | Adapta e exporta a implementação de `slugify`. |
| `src/truncate.ts`, `src/excerpt.ts` | Truncamento de texto e geração de excertos com remoção de tags no excerpt. |
| `src/interpolate.ts` | Substituição de placeholders `{{ caminho }}` em dados próprios de objetos. |
| `src/justify.ts`, `src/word_wrap.ts`, `src/sentence.ts` | Alinhamento de colunas, quebra de texto e composição de listas em frases. |
| `src/html_escape.ts`, `src/to_unix_slash.ts` | Escaping básico de caracteres HTML e troca de barras em caminhos. |
| `src/bytes.ts`, `src/seconds.ts`, `src/milliseconds.ts` | Parsing e formatação de tamanhos em bytes e durações. |
| `src/ordinal.ts`, `src/random.ts`, `src/uuid.ts` | Ordinais em inglês e geração de string aleatória e UUID. |
| [`src/types.ts`](../src/types.ts) | Tipos públicos `BytesOptions`, `PrettyBytes` e `PrettyTime`. |
| `tests/*.spec.ts` | Contratos de comportamento organizados por helper ou grupo de helpers. |
| [`bin/test.ts`](../bin/test.ts) | Configura o runner de testes e registra os arquivos `tests/**/*.spec.ts`. |
| `package.json`, `tsconfig.json` | Metadados, exports, scripts, dependências, entradas do build e compilação de declarações. |
| `.github/workflows/` | Automação de validação de commits, release e publicação. |

## Como funciona e como usar

O entry point principal (`.`) aponta para `build/index.js`. `index.ts` importa as implementações de `src/` e cria um objeto padrão `string`. Portanto, os helpers são chamados como propriedades:

```ts
import string from '@jeftelabs/string'

string.camelCase('user profile')
string.bytes.format(1024)
```

O subpath `@jeftelabs/string/builder` aponta para `build/string_builder.js`, que exporta a classe padrão `StringBuilder`. O subpath `@jeftelabs/string/types` aponta para o módulo gerado de tipos. Esses destinos são definidos pelo campo `exports` em `package.json`; não deduza destinos publicados pela estrutura TypeScript sozinha.

O objeto principal também contém namespaces `bytes`, `seconds` e `milliseconds`, cada um com `parse` e `format`. `StringBuilder` delega a maior parte das conversões ao objeto `string`, mantendo o valor atual em um campo privado e retornando `this` nos métodos de transformação.

## Decisões de arquitetura e dependências

A separação por helper mantém cada operação independente em `src/`, enquanto `index.ts` oferece uma entrada única e simples para consumidores. `StringBuilder` atende fluxos em que várias transformações sequenciais ficam mais legíveis encadeadas. Tipos compartilhados ficam separados em `src/types.ts` para que os tipos associados à formatação também possam ser publicados pelo subpath próprio.

As dependências especializadas evitam reimplementar regras de pluralização, slug, truncamento, bytes e tempo. As lógicas locais documentam ajustes de contrato e casos que o pacote controla diretamente. Avalie impacto de tamanho, compatibilidade e comportamento antes de introduzir outra dependência ou substituir uma implementação local.

### Dependências de implementação

- `case-anything` implementa a maioria das conversões de caixa. `titleCase`, `sentenceCase` e `noCase` têm lógica local em `src/change_case.ts`.
- `pluralize` fornece regras linguísticas; `src/pluralize.ts` acrescenta correções para alguns plurais e expõe métodos de configuração de regras.
- `slugify` implementa a geração de slugs.
- `truncatise` implementa o truncamento usado por `truncate` e `excerpt`; `excerpt` ativa a remoção de HTML.
- `bytes` e `@lukeed/ms` fazem parsing/formatação de bytes e durações.
- `node:crypto` fornece bytes aleatórios e UUID v4; `node:path` ajuda `StringBuilder` a localizar extensões.

As versões declaradas estão em `package.json` e as resoluções instaladas em `package-lock.json`. Os detalhes de uma dependência não substituem o contrato documentado e testado neste pacote.

## Decisões de comportamento e limites

- `random.use(...)`/`random.restore()` e `uuid.use(...)`/`uuid.restore()` substituem geradores compartilhados no módulo. São ganchos úteis para testes, mas afetam chamadas subsequentes até restauração; não são configurações isoladas por instância.
- `slug.extend(...)` e as funções de regras do `pluralize` alteram regras de dependências compartilhadas durante a vida do módulo.
- `StringBuilder` transforma o próprio valor interno. Uma nova instância criada a partir de outra recebe seu texto atual, sem compartilhar o campo privado.
- `interpolate` não executa expressões: resolve uma sequência de propriedades separadas por pontos, incluindo índices de arrays. Valores ausentes são convertidos pelo replace para a representação de `undefined`.
- `seconds.parse` converte a duração para milissegundos por meio da dependência e usa `Math.floor` para retornar segundos inteiros. `milliseconds.parse` mantém a precisão retornada pelo parser.
- As medidas de largura de `justify` e `wordWrap` partem de comprimentos de string/caracteres. Para colunas com códigos ANSI ou glifos de largura visual diferente, `justify` aceita `getLength`; `wordWrap` não oferece callback de largura.

## Manutenção e verificação

1. Identifique o helper agregado em `index.ts` e sua implementação em `src/`.
2. Leia a spec correspondente em `tests/` e os tipos afetados em `src/types.ts`.
3. Confirme se a alteração afeta o objeto padrão, um subpath público, `StringBuilder` ou uma dependência/configuração.
4. Atualize a referência da API e/ou este mapa, mais o guia de desenvolvimento ou README quando aplicável.
5. Verifique a mudança com os comandos adequados descritos em [desenvolvimento](./development.md) e registre o que executou.
