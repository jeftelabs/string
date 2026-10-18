# Começar a usar `@jeftelabs/string`

## Objetivo

Este guia apresenta a instalação e os entry points publicados para que uma aplicação escolha o import correto sem depender de módulos internos do repositório.

## Instalar e importar

Instale o pacote pela registry configurada no projeto consumidor:

```sh
npm install @jeftelabs/string
```

O ponto de entrada principal oferece um objeto padrão com os helpers:

```ts
import string from '@jeftelabs/string'

const name = string.camelCase('user profile')
const slug = string.slug('hello world')
```

Para a API fluente, importe `StringBuilder` do subpath dedicado:

```ts
import StringBuilder from '@jeftelabs/string/builder'

const name = new StringBuilder('user profile').camelCase().toString()
```

Tipos públicos de bytes e duração estão no subpath `@jeftelabs/string/types`:

```ts
import type { BytesOptions, PrettyBytes, PrettyTime } from '@jeftelabs/string/types'

const options: BytesOptions = { unit: 'KB', unitSeparator: ' ' }
const display: PrettyBytes = '10 KB'
const duration: PrettyTime = '2 hours'
```

## Escolher o ponto de entrada

| Necessidade | Import |
| --- | --- |
| Helpers e namespaces `bytes`, `seconds` e `milliseconds` | `@jeftelabs/string` |
| Encadear transformações de uma string | `@jeftelabs/string/builder` |
| Anotar opções/retornos dos helpers de bytes e tempo | `@jeftelabs/string/types` |

Os subpaths são definidos por `exports` em `package.json`; importe esses caminhos públicos em vez de depender de `src/`.

## Exemplo de uso conjunto

```ts
import string from '@jeftelabs/string'
import StringBuilder from '@jeftelabs/string/builder'

const message = string.interpolate('Olá, {{ user }}!', { user: 'Ana' })
const controller = new StringBuilder('user')
  .plural()
  .suffix('Controller')
  .snakeCase()
  .toString()

// message: 'Olá, Ana!'
// controller: 'users_controller'
```

## Decisões e limites

- O objeto padrão é o caminho de acesso aos helpers. Os arquivos em `src/` não são entry points documentados para aplicações consumidoras.
- `StringBuilder` muda seu estado interno a cada chamada encadeada; chame `toString()` para obter o texto resultante.
- Interpolação não faz escaping. Se o resultado for inserido em HTML, aplique `string.htmlEscape` de acordo com o contexto de saída.
- O `package.json` não declara `engines`; não deduza uma versão mínima de Node a partir deste guia. Considere o ambiente suportado pela aplicação e valide a compatibilidade necessária.

## Manutenção e verificação

Se `exports` ou tipos públicos mudarem, atualize este mapa de imports, `package.json` correspondente, [`references/types.md`](../references/types.md), [`references/api.md`](../references/api.md) e o README da raiz. Confira a implementação e os testes listados na [referência da API](../references/api.md); comandos de build e testes estão em [desenvolvimento](../development.md).
