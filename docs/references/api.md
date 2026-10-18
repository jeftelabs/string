# Referência da API

Todos os helpers desta página estão disponíveis como propriedades do export padrão `string` de `@jeftelabs/string`, salvo `StringBuilder`, que é exportado pelo subpath `@jeftelabs/string/builder`.

## Objetivo e forma de uso

Esta referência descreve para que serve cada grupo de helpers, como chamá-lo, os parâmetros e retornos observáveis e os efeitos que precisam ser considerados pelo consumidor. O ponto de entrada padrão reúne as operações de uso frequente sem obrigar o consumidor a importar módulos internos. Use `StringBuilder` quando a sequência de transformações ficar mais clara como uma cadeia mutável.

```ts
import string from '@jeftelabs/string'
import StringBuilder from '@jeftelabs/string/builder'
import type { BytesOptions, PrettyBytes, PrettyTime } from '@jeftelabs/string/types'
```

Os exemplos abaixo descrevem a implementação deste repositório. Para opções próprias de `slug`, veja também a documentação do pacote [`slugify`](https://www.npmjs.com/package/slugify). Para unidades aceitas por `bytes` e `@lukeed/ms`, confira suas dependências; esta referência destaca o contrato exposto pelo wrapper local.

## Conversão de caixa e palavras

| Helper | Assinatura | Comportamento |
| --- | --- | --- |
| `camelCase` | `(value: string): string` | Converte palavras para camelCase. |
| `snakeCase` | `(value: string): string` | Converte palavras para `snake_case`. |
| `dashCase` | `(value: string, options?: { capitalize?: boolean }): string` | Produz `kebab-case`; `capitalize: true` seleciona train case (`Train-Case`). |
| `pascalCase` | `(value: string): string` | Converte palavras para PascalCase. |
| `capitalCase` | `(value: string): string` | Converte para palavras com iniciais maiúsculas, separadas por espaço. |
| `sentenceCase` | `(value: string): string` | Separa palavras e põe em maiúscula a primeira letra da frase; demais letras são reduzidas a minúsculas. |
| `titleCase` | `(value: string): string` | Capitaliza palavras em estilo de título preservando capitalização manual em certos tokens e deixando algumas palavras curtas em minúscula conforme as regras locais. |
| `dotCase` | `(value: string, options?: { lowerCase?: boolean }): string` | Converte para palavras separadas por ponto; por padrão pode preservar capitalização, `lowerCase: true` força minúsculas. |
| `noCase` | `(value: string): string` | Remove separadores de estilo e retorna palavras minúsculas separadas por espaços. |

```ts
string.camelCase('hello world') // 'helloWorld'
string.dashCase('hello world') // 'hello-world'
string.dashCase('hello world', { capitalize: true }) // 'Hello-World'
string.dotCase('Hello World', { lowerCase: true }) // 'hello.world'
string.titleCase('the quick brown fox') // 'The Quick Brown Fox'
```

## Pluralização e singularização

| Helper | Assinatura | Comportamento |
| --- | --- | --- |
| `plural` | `(word: string): string` | Retorna a forma plural segundo as regras do pacote `pluralize`. |
| `singular` | `(word: string): string` | Retorna a forma singular. |
| `pluralize` | `(word: string, count?: number, inclusive?: boolean): string` | Escolhe singular quando a contagem é 1 e plural nos demais casos; aceita o comportamento `inclusive` da dependência. |
| `isPlural` | `(word: string): boolean` | Indica se a palavra é plural segundo a dependência. |
| `isSingular` | `(word: string): boolean` | Indica se a palavra é singular segundo a dependência. |

O pacote registra regras adicionais em `src/pluralize.ts` para pares como `bias/biases`, `canvas/canvases`, `cache/caches`, `cliche/cliches`, `fez/fezzes`, `lens/lenses`, `niche/niches`, `quiche/quiches` e `veto/vetoes`. Essas regras também se aplicam a palavras compostas conforme a implementação da dependência.

`pluralize` expõe ainda os métodos de regra da dependência: `addPluralRule`, `addSingularRule`, `addIrregularRule` e `addUncountableRule`. São alterações globais das regras do módulo.

```ts
string.pluralize('error', 2) // 'errors'
string.pluralize('error', 1) // 'error'
string.plural('person') // forma plural segundo pluralize
```

## Slug

### `slug(value, options?)`

Gera uma representação adequada para URLs usando `slugify`. As opções e os caracteres transliterados são os oferecidos por essa dependência. Seu método `extend(replacements)` pode registrar substituições globais de caracteres:

```ts
string.slug('hello world') // 'hello-world'
string.slug.extend({ '☢': 'radioactive' })
string.slug('radioactive ☢')
```

Consulte a referência de `slugify` para as opções disponíveis e lembre-se de que `extend` altera o estado compartilhado da dependência.

## Interpolação

### `interpolate(input: string, data: any): string`

Substitui placeholders `{{ caminho }}` por propriedades próprias de `data`. O caminho é separado por pontos, permitindo acessar objetos aninhados e índices de arrays. Espaços em volta do caminho são ignorados. Um caminho ausente, uma propriedade herdada ou uma travessia interrompida por valor nulo/não objeto produz `undefined` como texto. Uma barra invertida antes da abertura escapa o placeholder e é removida.

```ts
string.interpolate('Olá, {{ user.name }}', { user: { name: 'Ana' } }) // 'Olá, Ana'
string.interpolate('{{ people.0 }}', { people: ['Ana'] }) // 'Ana'
string.interpolate('literal: \\{{ name }}', {}) // 'literal: {{ name }}'
```

Esta função não avalia JavaScript, não formata valores e não faz HTML escaping. Aplique `htmlEscape` quando o contexto de saída exigir escaping HTML.

## Truncamento e excerto

### `truncate(sentence, charactersLimit, options?)`

Trunca por caracteres sem remover tags HTML.

### `excerpt(sentence, charactersLimit, options?)`

Usa a mesma base de truncamento, mas pede à dependência para remover tags HTML antes de produzir o excerto.

Para ambas, as opções são:

| Opção | Tipo | Efeito |
| --- | --- | --- |
| `completeWords` | `boolean` | `true` tenta terminar em uma palavra completa e pode ultrapassar o limite de caracteres; o padrão não força palavras completas. |
| `suffix` | `string` | Texto anexado quando houver truncamento; o padrão da dependência é `...`. |

```ts
string.truncate('Uma frase comprida para exibir', 12) // texto truncado
string.excerpt('<p>Uma frase comprida</p>', 12) // texto truncado sem tags
string.truncate('Uma frase comprida', 12, { completeWords: true, suffix: '…' })
```

## Texto e layout

### `sentence(values, options?)`

Transforma um array em frase. Array vazio retorna `''`; um elemento retorna o próprio valor; dois elementos usam `pairSeparator` (padrão `' and '`); três ou mais usam `separator` (padrão `', '`) e `lastSeparator` (padrão `', and '`). `separator` e `lastSeparator` podem ser configurados em arrays com três ou mais elementos. Os valores são combinados via conversão/interpolação de string do JavaScript. Embora o tipo declarado seja `string`, o caso de um único item retorna esse item diretamente em runtime.

```ts
string.sentence(['red', 'green', 'blue']) // 'red, green, and blue'
string.sentence(['red', 'green', 'blue'], { separator: ' / ', lastSeparator: ' & ' })
string.sentence(['red', 'blue'], { pairSeparator: ' ou ' }) // 'red ou blue'
```

### `wordWrap(value, options)`

Quebra o texto em linhas usando `width` como limite nominal de caracteres. As opções obrigatórias e opcionais:

| Opção | Tipo | Padrão/efeito |
| --- | --- | --- |
| `width` | `number` | Obrigatória; largura usada pela expressão de quebra. |
| `indent` | `string` | `''`; inserido depois de cada separador de linha gerado. |
| `newLine` | `string` | `'\n'`; separador entre as linhas. |
| `escape` | `(value: string) => string` | Opcional; transforma cada segmento antes de juntar as linhas. |

O helper pode preservar espaços ao fim das linhas e não calcula largura visual de terminais ou graphemes; leve essas características em conta para texto com ANSI, emoji ou caracteres de largura variável.

### `justify(columns, options)`

Preenche strings para que cada coluna tenha pelo menos `width` unidades de comprimento. `align` aceita `'left'` (padrão) ou `'right'`; `indent` é o caractere/string repetido para preencher e tem padrão `' '`. `getLength(value)` permite fornecer a medida da coluna, por exemplo ignorando códigos ANSI. Colunas já tão largas quanto ou mais largas que `width` são retornadas sem alteração.

```ts
string.justify(['a', 'long'], { width: 6 }) // ['a     ', 'long  ']
string.justify(['a', 'long'], { width: 6, align: 'right', indent: '.' })
```

### `condenseWhitespace(value: string): string`

Remove espaços no início e no fim e substitui cada sequência de dois ou mais caracteres whitespace por um espaço simples. Um whitespace isolado no interior é mantido.

### `htmlEscape(value: string): string`

Substitui `&`, `"`, `'`, `<` e `>` por `&amp;`, `&quot;`, `&#39;`, `&lt;` e `&gt;`, respectivamente. Esta função é escaping de caracteres para texto HTML, não sanitização de conteúdo ou URLs.

### `toUnixSlash(path: string): string`

Substitui barras invertidas (`\\`) por barras (`/`). Caminhos Windows de comprimento estendido que começam por `\\?\` são devolvidos sem alteração.

### `ordinal(value: string | number): string`

Acrescenta sufixo ordinal inglês (`st`, `nd`, `rd`, `th`). A validação usa o valor absoluto, mas o sufixo é anexado à representação original. Valores que não possam ser interpretados como número finito geram erro.

```ts
string.ordinal(1) // '1st'
string.ordinal(22) // '22nd'
string.ordinal('3') // '3rd'
```

## Duração e tamanho em bytes

### `seconds` e `milliseconds`

Ambos são objetos com `parse(duration: string | number)` e `format(value: number, long?: boolean)`.

- `seconds.parse(number)` devolve esse número sem conversão; com string, interpreta a duração e retorna `Math.floor(milliseconds / 1000)`.
- `milliseconds.parse(number)` devolve esse número; com string, interpreta e retorna milissegundos.
- Entradas de string que não forem reconhecidas geram erro `Invalid duration expression "..."`.
- `seconds.format(seconds, long?)` converte para milissegundos antes da formatação.
- `milliseconds.format(milliseconds, long?)` formata diretamente. `long: true` pede nomes de unidade por extenso; caso contrário, a forma é abreviada.

```ts
string.seconds.parse('10 hours') // 36000
string.milliseconds.parse('1 hour') // 3600000
string.seconds.format(3600) // '1h'
string.milliseconds.format(3600000, true) // '1 hour'
```

### `bytes`

Objeto com `parse(unit: string | number)` e `format(valueInBytes: number, options?)`.

- `bytes.parse(number)` devolve o número; `bytes.parse(string)` converte uma expressão com unidade, ou devolve `null` se não puder interpretar.
- `bytes.format(...)` devolve uma string formatada ou `null` se o pacote `bytes` não conseguir formatar o valor.
- `unit` declarado pelo tipo local aceita `B`, `KB`, `MB`, `GB`, `TB` e variantes em minúsculas. O parser subjacente também documenta `PB`.

`BytesOptions` aceita `decimalPlaces` (padrão 2), `fixedDecimals` (padrão false), `thousandsSeparator` (padrão `''`), `unit` e `unitSeparator` (padrão `''`).

```ts
string.bytes.parse('1KB') // 1024 conforme as opções padrão da dependência
string.bytes.format(1024) // '1KB'
string.bytes.format(1536, { decimalPlaces: 1, unitSeparator: ' ' })
```

Os tipos `PrettyBytes` e `PrettyTime` descrevem strings numéricas com unidades aceitas pelos wrappers; `BytesOptions` descreve opções de formatação. Os tipos estão disponíveis no subpath `@jeftelabs/string/types`.

## Geração aleatória

### `random(size: number): string`

Gera string de tamanho solicitado com bytes criptograficamente aleatórios, codificados como Base64 URL-safe (`+` vira `-`, `/` vira `_`, padding é removido). `random.use(generator)` instala um gerador alternativo compartilhado e `random.restore()` restaura o gerador padrão.

### `uuid(options?: RandomUUIDOptions): UUID`

Gera UUID v4 através de `node:crypto.randomUUID`. `uuid.use(generator)` substitui o gerador compartilhado e `uuid.restore()` restaura o nativo. As opções são as aceitas por `randomUUID` do Node.js.

O uso de `use` é global ao módulo; restaure-o após customização temporária, em especial em testes.

## Classe `StringBuilder`

Importe pelo subpath `@jeftelabs/string/builder`. O construtor recebe uma string ou outro `StringBuilder`. Cada operação modifica a instância atual e retorna `this`; chame `toString()` para obter o valor final.

Para a referência por método, exemplos de encadeamento e limites de regex/extensão, consulte também [a página de `StringBuilder`](./string-builder.md).

```ts
const name = new StringBuilder('user profile')
  .camelCase()
  .suffix('Controller')
  .toString() // 'userProfileController'
```

| Método | Efeito |
| --- | --- |
| `camelCase()`, `capitalCase()`, `dashCase()`, `dotCase()`, `noCase()`, `pascalCase()`, `sentenceCase()`, `snakeCase()`, `titleCase()` | Aplica o helper de conversão correspondente. |
| `plural()`, `singular()` | Pluraliza ou singulariza o valor atual. |
| `slugify()` | Aplica `string.slug`. |
| `removeSuffix(suffix, options?)` | Remove sufixo que case-insensitively corresponda ao padrão gerado, permitindo separador `-` ou `_` antes dele. `options.similarWords` evita remover um sufixo se o valor já terminar com uma palavra semelhante. |
| `suffix(suffix, options?)` | Remove o sufixo indicado (respeitando `similarWords`) e acrescenta o novo sufixo. |
| `removePrefix(prefix, options?)` | Remove prefixo com suporte a separador `-` ou `_`; `similarWords` evita remover prefixos que correspondam a palavra semelhante. |
| `prefix(prefix)` | Remove prefixo equivalente e acrescenta o novo prefixo. Não aceita parâmetro `similarWords`. |
| `removeExtension()` | Remove a extensão reconhecida por `node:path.extname`. |
| `ext(extension)` | Remove a extensão reconhecida e anexa a nova extensão, tirando um ponto inicial do argumento. |
| `toUnixSlash()` | Converte as barras do valor atual como `string.toUnixSlash`. |
| `toString()` | Retorna o valor atual como string. |

`removePrefix` e `removeSuffix` constroem expressões regulares a partir de seus argumentos; use valores controlados pelo chamador. `similarWords` também é interpolado no padrão da expressão. O comportamento de extensões segue `node:path` da plataforma onde o código executa.

## Decisões e limites da API

- A API principal é um objeto padrão. As funções dos arquivos `src/` são detalhes de implementação; não são necessariamente exports nomeados do pacote.
- `slug` e pluralização delegam regras e opções a dependências. Mudanças nessas regras podem alterar saídas para entradas linguísticas ou Unicode; mantenha exemplos e testes que documentem o resultado esperado.
- `interpolate` não faz escaping. O escaping depende do contexto de saída e deve ser solicitado pelo chamador.
- `random.use`, `uuid.use`, `slug.extend` e as regras de `pluralize` afetam estado compartilhado pelo módulo. Não os trate como configuração isolada por chamada.
- Alguns wrappers preservam quirks de dependências ou tipos: valide retornos, arredondamentos, erros e valores de borda no código e nos testes antes de contar com eles.

## Testes relacionados

As specs relevantes ficam em `tests/`: `change_case`, `pluralize`, `slugify`, `interpolate`, `truncate`, `excerpt`, `sentence`, `word_wrap`, `justify`, `html_escape`, `to_unix_slash`, `ordinal`, `random`, `uuid`, `string` e `string_builder`. Elas são a referência executável para os exemplos e casos de borda.

## Manutenção e verificação

Ao alterar um helper, confira sua implementação em `src/`, sua inclusão no objeto padrão em `index.ts`, os tipos em `src/types.ts` e a spec que registra o contrato. Para mudanças em `StringBuilder`, consulte `string_builder.ts` e `tests/string_builder.spec.ts`. Atualize os exemplos nesta página e o README quando a instalação, assinatura, retorno, opções ou uso público mudar. Use os comandos de validação descritos em [desenvolvimento](../development.md) e declare somente as verificações que realmente executou.
