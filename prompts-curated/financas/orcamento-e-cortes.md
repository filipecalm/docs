# Finanças pessoais — orçamento e vazamentos

**Uso:** montar orçamento realista e identificar gastos excessivos sem rigidez extrema.  
**Quando usar:** início de mês, após exportar extrato, ou quando o dinheiro "some" sem explicação.  
**Resultado esperado:** orçamento por categoria + lista de cortes com impacto e sacrifício percebido.

**Fonte:** `Screenshot_20260109-214739.png`

## Contexto

- Renda mensal líquida: `[RENDA]`
- Despesas (lista ou valores): `[DESPESAS]`
- Meta de economia (opcional): `[META_ECONOMIA]`
- Moeda: `[MOEDA]` (default: BRL)

---

## Prompt 1 — Orçamento claro

```
Aqui estão minha renda e despesas mensais:

Renda líquida: [RENDA]
Despesas:
[DESPESAS]

Monte um orçamento realista e sem estresse que inclua:
- Reserva de emergência (meta mensal)
- Custos fixos inegociáveis
- Custos variáveis com teto
- Uma fatia de "gastos sem culpa" (lazer discrecional)

Entregue em tabela por categoria, com % da renda e sobra mensal projetada.
Se os números não fecham, indique o déficit e por onde ajustar primeiro.
```

---

## Prompt 2 — Detector de vazamentos financeiros

```
Com base nestas despesas:

[DESPESAS]

Renda de referência: [RENDA]

Identifique:
1. Categorias onde estou gastando acima do razoável (benchmark para [MOEDA])
2. Assinaturas ou gastos recorrentes fáceis de esquecer
3. Cortes sugeridos — ordenados por impacto financeiro vs. sacrifício percebido (alto impacto / baixo sacrifício primeiro)
4. Uma alternativa mais barata para cada corte, sem me fazer sentir privado

Seja direto. Não moralize.
```

## Variação — os dois em sequência

```
Execute o Prompt 1 (orçamento) e depois o Prompt 2 (vazamentos) com os mesmos dados acima.
```
