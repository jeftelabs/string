# @jeftelabs/string

> Biblioteca ESM escrita em TypeScript, com helpers para transformar strings, formatar texto e apresentar durações e tamanhos em bytes.

[![npm version](https://img.shields.io/npm/v/@jeftelabs/string.svg)](https://www.npmjs.com/package/@jeftelabs/string)
[![license](https://img.shields.io/npm/l/@jeftelabs/string.svg)](./LICENSE)

## Instalação

```sh
# npm
npm install @jeftelabs/string

# yarn
yarn add @jeftelabs/string

# pnpm
pnpm add @jeftelabs/string
```

## Uso

Importe o objeto padrão para acessar os helpers:

```ts
import string from '@jeftelabs/string'

string.camelCase('user profile') // 'userProfile'
string.slug('hello world') // 'hello-world'
string.pluralize('error', 2) // 'errors'
string.bytes.format(1024) // '1KB'
```

Para encadear transformações, importe `StringBuilder` pelo subpath `builder`:

```ts
import StringBuilder from '@jeftelabs/string/builder'

const controller = new StringBuilder('user profile')
  .camelCase()
  .suffix('Controller')
  .toString()

// 'userProfileController'
```

Tipos públicos para bytes e durações podem ser importados pelo subpath `types`:

```ts
import type { BytesOptions, PrettyBytes, PrettyTime } from '@jeftelabs/string/types'
```

## Helpers

### Truncamento e excertos

`truncate` encurta o texto preservando tags HTML; `excerpt` remove tags HTML antes de truncar. Ambos aceitam `completeWords` para tentar terminar em uma palavra completa e `suffix` para definir o texto final.

```ts
string.truncate('Este é um texto longo para exibir', 16)
string.excerpt('<p>Este é um texto longo</p>', 16, { completeWords: true })
```

### Slugs

`slug` gera uma representação adequada para URLs. A API e as opções vêm de `slugify`; `extend` permite adicionar substituições Unicode.

```ts
string.slug('hello ♥ world') // 'hello-love-world'
string.slug.extend({ '☢': 'radioactive' })
```

### Interpolação

`interpolate` substitui placeholders `{{ caminho }}` por valores próprios de objetos, incluindo caminhos aninhados e índices de arrays. Uma barra invertida antes da chave escapa a interpolação.

```ts
string.interpolate('Olá, {{ user.name }}', { user: { name: 'Ana' } })
// 'Olá, Ana'

string.interpolate('Valor: {{ items.0 }}', { items: ['primeiro'] })
// 'Valor: primeiro'
```

Interpolação não faz escaping HTML. Use `htmlEscape` quando o destino exigir escaping de texto HTML.

### Pluralização

`plural`, `singular`, `isPlural` e `isSingular` convertem ou verificam palavras. `pluralize` escolhe a forma pelo número. `pluralize` também expõe `addPluralRule`, `addSingularRule`, `addIrregularRule` e `addUncountableRule` para configurar regras compartilhadas.

```ts
string.pluralize('error', 1) // 'error'
string.pluralize('error', 3) // 'errors'
string.singular('people') // 'person'
```

### Conversão de caixa

| Helper | Exemplo de formato |
| --- | --- |
| `camelCase` | `userProfile` |
| `capitalCase` | `User Profile` |
| `dashCase` | `user-profile` |
| `dotCase` | `user.profile` |
| `noCase` | `user profile` |
| `pascalCase` | `UserProfile` |
| `sentenceCase` | `User profile` |
| `snakeCase` | `user_profile` |
| `titleCase` | `User Profile` |

`dashCase` aceita `{ capitalize: true }` para produzir Train-Case. `dotCase` aceita `{ lowerCase: true }` para forçar minúsculas.

### Formatação e composição de texto

- `wordWrap` quebra uma string por largura e permite configurar indentação, separador de linha e callback de escape.
- `justify` preenche uma lista de colunas à esquerda ou à direita; `getLength` permite definir como medir cada coluna.
- `sentence` combina uma lista em frase e permite personalizar separadores.
- `condenseWhitespace` remove espaços externos e reduz sequências de whitespace.
- `htmlEscape` converte `&`, aspas simples/duplas, `<` e `>` em entidades HTML.
- `toUnixSlash` substitui barras invertidas de caminhos por `/`, preservando caminhos Windows estendidos `\\?\`.

### Outros helpers

- `ordinal` acrescenta sufixos ordinais ingleses (`1st`, `2nd`, `3rd`, `4th`).
- `random` gera strings aleatórias URL-safe e permite instalar/restaurar um gerador customizado.
- `uuid` gera UUID v4 e permite instalar/restaurar uma implementação customizada.
- `seconds` e `milliseconds` oferecem `parse` e `format` para durações.
- `bytes` oferece `parse` e `format` para tamanhos em bytes; `format` aceita opções como unidade, casas decimais e separadores.

## Documentação

Consulte os documentos para exemplos completos, assinaturas, opções e detalhes de manutenção:

- [Guias práticos](./docs/guides/README.md): começar a usar, transformar nomes e preparar texto.
- [Referências técnicas](./docs/references/README.md): [API completa](./docs/references/api.md), [`StringBuilder`](./docs/references/string-builder.md) e [tipos publicados](./docs/references/types.md).
- [Arquitetura](./docs/architecture.md) e [desenvolvimento, testes e publicação](./docs/development.md).

## Contribuição

```sh
npm install
npm test
npm run lint
npm run typecheck
npm run build
```

Os scripts e seus efeitos estão detalhados em [desenvolvimento](./docs/development.md).

Leia [`AGENTS.md`](./AGENTS.md) antes de alterar o projeto. Toda criação ou alteração deve vir acompanhada de documentação detalhada para pessoas e agentes de IA.

## Licença

MIT. Consulte [`LICENSE`](./LICENSE).
