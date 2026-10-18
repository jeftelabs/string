# Preparar e formatar texto

## Objetivo

Este guia demonstra um fluxo para interpolar conteúdo e adaptá-lo para exibição: controlar placeholders, limitar texto, construir frases e alinhar linhas. Ele também descreve onde o pacote requer uma decisão explícita do chamador, especialmente para escaping HTML.

## Interpolar valores

Use `interpolate` para substituir caminhos simples dentro de `{{ }}`:

```ts
import string from '@jeftelabs/string'

const text = string.interpolate('Olá, {{ user.name }}', {
  user: { name: 'Ana' },
})
// 'Olá, Ana'
```

Caminhos podem endereçar índices de arrays (`{{ items.0 }}`). Um placeholder com caminho inexistente vira `undefined` em texto. Para manter as chaves literais, escape a abertura com uma barra invertida (`\\{{ nome }}`). Interpolação não avalia expressões e não codifica caracteres do valor substituído.

## Escapar e encurtar conteúdo

Se a saída for HTML, faça escaping no valor interpolado conforme o contexto:

```ts
const escaped = string.htmlEscape('<Ana & Bia>')
// '&lt;Ana &amp; Bia&gt;'
```

Use `truncate` para preservar tags do texto original e `excerpt` quando quiser que as tags sejam removidas:

```ts
string.truncate('Um texto muito longo para uma linha', 12)
string.excerpt('<p>Um texto muito longo</p>', 12)
```

Ambos aceitam `{ completeWords: true }` para encerrar em palavra completa e `suffix` para customizar o sufixo. A opção de palavra completa pode exceder o limite.

## Gerar uma frase a partir de uma lista

```ts
string.sentence(['rotas', 'controllers', 'middleware'])
// 'rotas, controllers, and middleware'

string.sentence(['rotas', 'controllers'], { pairSeparator: ' ou ' })
// 'rotas ou controllers'
```

Para listas com três ou mais itens, configure `separator` e `lastSeparator`; para dois itens, configure `pairSeparator`. Com lista vazia o retorno é `''`.

## Quebrar e alinhar texto

`wordWrap` divide texto conforme uma largura e aceita indentação, separador de linha e callback de escape:

```ts
string.wordWrap('um texto que ocupa mais de uma linha', {
  width: 12,
  indent: '  ',
  newLine: '\n',
})
```

`justify` alinha colunas com padding à esquerda ou à direita. Se o conteúdo inclui códigos ANSI ou caracteres com largura visual especial, passe `getLength` para medir cada coluna corretamente:

```ts
string.justify(['help', 'make:controller'], {
  width: 20,
  align: 'left',
  getLength: (value) => value.length,
})
```

Para condensar whitespace, `condenseWhitespace` remove espaços externos e reduz sequências internas de whitespace. Para converter separadores de caminho, `toUnixSlash` troca barras invertidas por barras, com preservação de caminhos estendidos Windows `\\?\`.

## Decisões e limites

- `htmlEscape` converte cinco caracteres para entidades; não valida URLs, remove tags nem constitui sanitização geral de HTML.
- Aplicar escaping e depois truncar (ou o inverso) pode produzir resultados diferentes, especialmente com entidades. Escolha a ordem conforme o contexto de renderização e teste esse fluxo na aplicação.
- `wordWrap` mede strings por caracteres e não recebe função de largura visual. `justify` suporta customização da medida por `getLength`.
- Os helpers operam sobre texto; eles não fazem renderização, interpretação de templates, I/O ou ajuste ao layout da interface.

## Manutenção e verificação

As implementações correspondentes ficam em `src/interpolate.ts`, `src/html_escape.ts`, `src/truncate.ts`, `src/excerpt.ts`, `src/sentence.ts`, `src/word_wrap.ts`, `src/justify.ts`, `index.ts` e `src/to_unix_slash.ts`. Mantenha as specs correspondentes em `tests/` e atualize este guia e a [referência da API](../references/api.md) se mudar assinatura ou comportamento. Os comandos estão em [desenvolvimento](../development.md).
