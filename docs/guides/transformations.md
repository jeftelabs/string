# Transformar nomes e palavras

## Objetivo

Este guia ajuda a escolher entre conversão de caixa, geração de slug e inflexão de palavras, e mostra como encadear essas operações quando se está construindo identificadores.

## Converter o estilo das palavras

Use o helper cujo formato final corresponde ao consumidor do nome:

```ts
import string from '@jeftelabs/string'

string.camelCase('user profile') // 'userProfile'
string.snakeCase('user profile') // 'user_profile'
string.dashCase('user profile') // 'user-profile'
string.dotCase('user profile') // 'user.profile'
string.pascalCase('user profile') // 'UserProfile'
string.capitalCase('user profile') // 'User Profile'
string.sentenceCase('USER PROFILE') // 'User profile'
string.noCase('UserProfile') // 'user profile'
```

`titleCase` aplica capitalização de título com regras locais para palavras pequenas; não é igual a capitalizar toda palavra. `dashCase` aceita `{ capitalize: true }` para gerar train case. `dotCase` aceita `{ lowerCase: true }` para forçar minúsculas.

## Criar slugs

Para produzir um valor amigável a URL, use `slug`:

```ts
string.slug('hello world') // 'hello-world'
string.slug('hello ♥ world') // 'hello-love-world'
```

As opções vêm de `slugify`. Para caracteres que precisam de uma substituição customizada, `string.slug.extend(...)` registra regras compartilhadas pelo módulo. Consulte a [referência do helper](../references/api.md#slug) e use `extend` conscientemente em inicialização, já que a mudança não fica restrita a uma chamada.

## Singular e plural

Para escolher a forma de acordo com uma contagem, use `pluralize`. Para conversão direta, use `plural` ou `singular`:

```ts
string.pluralize('error', 1) // 'error'
string.pluralize('error', 3) // 'errors'
string.plural('person') // forma plural de person
string.singular('people') // forma singular segundo as regras do pacote
```

As regras são majoritariamente fornecidas por `pluralize`, com correções locais para inflexões cobertas pela suíte. O objeto `pluralize` também expõe funções para registrar regras customizadas; elas alteram o estado global da dependência.

## Encadear transformações

Quando uma operação exige vários passos, `StringBuilder` deixa a ordem explícita:

```ts
import StringBuilder from '@jeftelabs/string/builder'

const name = new StringBuilder('userController')
  .removeSuffix('controller')
  .plural()
  .snakeCase()
  .suffix('_controller')
  .toString()

// 'users_controller'
```

Os métodos alteram a instância atual. Use os helpers do objeto padrão quando uma transformação única for mais clara. Para prefixos/sufixos opcionais e extensões, veja a [referência de `StringBuilder`](../references/string-builder.md).

## Decisões e limites

- Diferentes algoritmos podem dividir letras, números, pontuação e Unicode de forma distinta. Use os exemplos dos testes como contrato em vez de inferir resultado somente pelo nome do método.
- Regras linguísticas dependem da biblioteca `pluralize`; substantivos irregulares podem ter diferenças conforme as regras adicionadas ao longo da vida do módulo.
- Slug e regras de pluralização customizadas alteram configuração compartilhada. Em testes, restaure ou isole o estado para que casos não influenciem outros.
- Conversões de caixa não são substitutas para validação ou escaping de dados.

## Manutenção e verificação

As implementações estão em `src/change_case.ts`, `src/slugify.ts` e `src/pluralize.ts`; os métodos encadeáveis estão em `string_builder.ts`. Ao alterar comportamento, atualize `tests/change_case.spec.ts`, `tests/slugify.spec.ts`, `tests/pluralize.spec.ts` ou `tests/string_builder.spec.ts`, conforme o caso, e mantenha esta receita e a [referência da API](../references/api.md) sincronizadas. Consulte [desenvolvimento](../development.md) para selecionar verificações.
