# Referência de `StringBuilder`

## Objetivo

`StringBuilder` oferece uma forma mutável e encadeável de transformar um valor textual usando um subconjunto dos helpers públicos de `@jeftelabs/string`, além de operações para prefixos, sufixos e extensões.

## Importação e estado

```ts
import StringBuilder from '@jeftelabs/string/builder'

const result = new StringBuilder('userController')
  .removeSuffix('controller')
  .plural()
  .snakeCase()
  .suffix('_controller')
  .toString()
// 'users_controller'
```

O construtor recebe `string | StringBuilder`. Ao receber outro builder, copia o `toString()` atual para o novo builder. Métodos de transformação mutam a instância corrente e retornam `this`. `toString()` lê o valor atual.

## Métodos

| Método | Assinatura | Comportamento |
| --- | --- | --- |
| `camelCase`, `capitalCase`, `dashCase`, `dotCase`, `noCase`, `pascalCase`, `sentenceCase`, `snakeCase`, `titleCase` | `(): this` | Delegam ao helper de mesmo nome no objeto `string`. |
| `plural`, `singular` | `(): this` | Convertem o valor para plural ou singular por `pluralize`. |
| `slugify` | `(): this` | Gera slug via `string.slug`. |
| `removeSuffix` | `(suffix: string, options?: { similarWords: string[] }): this` | Remove sufixo correspondente a regex case-insensitive com separador opcional `-`/`_`. Pode preservar uma palavra final listada em `similarWords`. |
| `suffix` | `(suffix: string, options?: { similarWords: string[] }): this` | Chama `removeSuffix` e acrescenta o sufixo recebido. |
| `removePrefix` | `(prefix: string, options?: { similarWords: string[] }): this` | Remove prefixo correspondente a regex case-insensitive com separador opcional `-`/`_`. Pode preservar uma palavra inicial de `similarWords`. |
| `prefix` | `(prefix: string): this` | Remove prefixo equivalente e acrescenta o prefixo recebido. |
| `removeExtension` | `(): this` | Remove a extensão reconhecida por `extname` de `node:path`. |
| `ext` | `(extension: string): this` | Remove extensão reconhecida e acrescenta a nova extensão, com ponto inicial opcional no argumento. |
| `toUnixSlash` | `(): this` | Converte separadores do valor atual via `string.toUnixSlash`. |
| `toString` | `(): string` | Retorna o valor atual. |

## Decisões e limites

- O builder cobre apenas operações encadeáveis implementadas em `string_builder.ts`; para helpers que não aparecem na lista acima, use o objeto padrão `string`.
- A ordem das chamadas importa porque cada passo recebe a saída do passo anterior.
- `prefix` não aceita `similarWords`, enquanto `removePrefix` aceita; essa diferença faz parte da assinatura atual.
- Prefixos, sufixos e `similarWords` são incorporados a expressões regulares sem escape. Passe padrões controlados e simples para evitar correspondências inesperadas.
- `extname` segue as regras da plataforma do Node.js, portanto a identificação da extensão depende do caminho passado e do ambiente.

## Manutenção e verificação

A implementação está em [`string_builder.ts`](../../string_builder.ts), que delega helpers ao [`index.ts`](../../index.ts). Os casos verificáveis estão em [`tests/string_builder.spec.ts`](../../tests/string_builder.spec.ts). Ao adicionar ou remover método, mantenha os três artefatos sincronizados: implementação, tabela desta referência e testes; atualize também os [guias de transformação](../guides/transformations.md) quando a receita mudar.
