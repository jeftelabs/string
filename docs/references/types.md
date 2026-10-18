# Tipos publicados

## Objetivo

Este documento descreve os tipos exportados pelo subpath `@jeftelabs/string/types`, sua correspondência com os helpers e os limites entre tipos TypeScript e valores aceitos em runtime.

## Importar os tipos

```ts
import type {
  BytesOptions,
  PrettyBytes,
  PrettyTime,
} from '@jeftelabs/string/types'
```

O subpath aponta para o módulo emitido a partir de `src/types.ts`, conforme `exports` em `package.json`. Os tipos são declarações TypeScript; não são objetos de runtime.

## `BytesOptions`

Interface aceita pelo helper `string.bytes.format(valueInBytes, options?)`:

| Campo | Tipo | Uso |
| --- | --- | --- |
| `decimalPlaces?` | `number \| undefined` | Máximo de casas decimais. |
| `fixedDecimals?` | `boolean \| undefined` | Controla se as casas decimais são sempre exibidas. |
| `thousandsSeparator?` | `string \| undefined` | Separador de milhares. |
| `unit?` | `BytesUnitAnyCase \| undefined` | Unidade de saída: `B`, `KB`, `MB`, `GB` ou `TB`, em maiúsculas/minúsculas. |
| `unitSeparator?` | `string \| undefined` | Separador entre número e unidade. |

Os defaults vêm da implementação subjacente `bytes`, e a opção `unit` tipada localmente não lista `PB`, embora a nota do parser em `src/bytes.ts` inclua petabytes como entrada. Não amplie o tipo por inferência; valide a necessidade e a compatibilidade antes de alterar o contrato.

## `PrettyBytes`

Template literal type para saída numérica textual com unidade de bytes. Aceita número sem unidade, número seguido diretamente por unidade, ou número separado da unidade por espaço. Unidades tipadas: `B`, `KB`, `MB`, `GB`, `TB`, também aceitas em minúsculas.

```ts
const compact: PrettyBytes = '10KB'
const spaced: PrettyBytes = '10 KB'
const numeric: PrettyBytes = '10'
```

## `PrettyTime`

Template literal type que admite número sem unidade ou número com unidade de tempo aceita pelo tipo. As unidades contemplam anos, semanas, dias, horas, minutos, segundos e milissegundos, com formas longas, abreviadas, maiúsculas/minúsculas e forma numérica seguida ou não de espaço.

```ts
const short: PrettyTime = '1h'
const long: PrettyTime = '1 hour'
const numeric: PrettyTime = '250'
```

## Decisões e limites

- Os valores de retorno de `bytes.format`, `seconds.format` e `milliseconds.format` usam esses aliases; consulte a [referência da API](./api.md#duração-e-tamanho-em-bytes) para parsing, erros e opções.
- `PrettyTime` não prova que uma string seja uma duração válida em runtime; é apenas uma restrição estática de formato.
- As unidades de bytes aceitas pelo parser e as unidades aceitas pelo campo `BytesOptions.unit` não são idênticas no código atual.
- `bytes.format` pode retornar `null` em runtime, apesar de `PrettyBytes` descrever somente o ramo string. Use o retorno observado/tipado do método ao tratar essa possibilidade.

## Manutenção e verificação

As definições fonte estão em [`src/types.ts`](../../src/types.ts), e os wrappers que as usam estão em [`src/bytes.ts`](../../src/bytes.ts), [`src/seconds.ts`](../../src/seconds.ts) e [`src/milliseconds.ts`](../../src/milliseconds.ts). Ao mudar aliases ou opções, atualize testes de tipo, esta página, [referência da API](./api.md) e [guia de início](../guides/getting-started.md). O fluxo de declaração/build está explicado em [desenvolvimento](../development.md).
