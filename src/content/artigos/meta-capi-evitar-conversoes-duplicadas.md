---
title: "Meta CAPI: como evitar conversões duplicadas"
description: "Um guia prático para deduplicar eventos do Pixel e da Conversions API sem estragar a leitura das campanhas."
pubDate: 2026-10-22
author: "Thiago Sousa"
category: pmes
tags: ["meta-ads", "conversions-api", "pixel", "deduplicacao", "eventos"]
readingTime: 6
coverImage: /images/artigos/meta-capi-evitar-conversoes-duplicadas.jpg
featured: false
---

Instalar a Conversions API não resolve, por si só, os problemas de medição no Meta Ads. Se o mesmo lead chegar pelo Pixel e pelo servidor sem uma identificação coerente, a plataforma pode interpretar duas conversões onde só existiu uma.

O resultado é perigoso porque parece positivo. O gestor vê mais leads no Ads Manager, o custo por resultado desce e a campanha aparenta estar melhor. Mas o CRM continua a mostrar a realidade. Antes de otimizar anúncios, é preciso garantir que as duas fontes estão a descrever o mesmo evento.

## O que a deduplicação faz

Uma configuração híbrida envia o evento pelo navegador e pelo servidor. São 2 caminhos para registar a mesma ação, não 2 conversões. Segundo a [documentação da Meta para a Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events), a deduplicação depende principalmente da combinação entre `event_name` e `event_id`.

Se o navegador enviar um evento `Lead` com o identificador `lead_8472`, o servidor deve enviar esse mesmo nome e esse mesmo identificador para a mesma ação. A Meta consegue então reconhecer os dois sinais como representações de uma única conversão.

O `event_id` não deve ser um valor fixo nem um número criado separadamente em cada integração. Deve nascer uma vez, no momento da conversão, e viajar pelo formulário, pelo Pixel, pelo backend e pelo envio para a Meta.

## O erro que procuramos primeiro

Na SENVIA, a primeira pergunta numa auditoria deste tipo não é se a CAPI está ativa. É se conseguimos seguir um único identificador de ponta a ponta. Esta distinção parece pequena, mas separa uma integração instalada de uma medição em que podemos confiar.

O nosso diagnóstico começa com 4 pontos: nome do evento, identificador do evento, hora do evento e origem da ação. Depois comparamos o que saiu do navegador com o que saiu do servidor. Se o `event_id` muda a meio do percurso, a deduplicação fica comprometida. Se o nome muda de `Lead` para `CompleteRegistration`, a Meta recebe eventos diferentes e não os junta.

Também verificamos o CRM. Uma plataforma de anúncios nunca deve ser a única fonte de verdade para vendas e leads. A nossa opinião é simples: se a contagem do Meta Ads não consegue ser reconciliada com registos reais, ainda não há base para escalar orçamento.

## Como implementar sem perder o controlo

Começa por definir onde o identificador é criado. Num formulário, pode ser um UUID gerado quando a submissão é aceite. Numa compra, pode ser o identificador único da encomenda, desde que não exponha dados pessoais.

Depois aplica o mesmo fluxo aos dois envios:

1. O formulário ou checkout cria um identificador único.
2. O Pixel envia o evento com esse valor em `eventID`.
3. O backend recebe e guarda o mesmo valor.
4. A Conversions API envia o evento com esse valor em `event_id`.
5. O registo no CRM conserva o identificador para auditoria.

Há ainda dados que ajudam a Meta a associar o evento à pessoa certa, como `fbp`, `fbc` e dados do cliente tratados de acordo com as regras da plataforma. Isso melhora a correspondência, mas não substitui a deduplicação. Correspondência e deduplicação resolvem problemas diferentes.

## Como testar antes de confiar nos números

Usa a ferramenta Test Events no Gestor de Eventos e faz uma conversão real de teste. Confirma que chegaram os sinais do navegador e do servidor e que a interface os apresenta como um único evento deduplicado.

Em seguida, compara três contagens durante um período controlado: submissões aceites no site, registos criados no CRM e eventos recebidos pela Meta. Não esperes igualdade absoluta no relatório atribuído, porque atribuição e receção de eventos não são a mesma coisa. Procura antes diferenças que não consegues explicar.

Documenta também uma forma de repetir o teste depois de alterações no site, no Google Tag Manager ou no backend. Uma CAPI correta hoje pode deixar de o ser depois de uma simples troca de formulário.

Se estiveres a rever toda a ligação entre anúncios e vendas, o artigo sobre [como o CRM ensina o algoritmo do Meta Ads](/blog/artigos/meta-ads-crm-ensina-algoritmo/) explica o passo seguinte: devolver à plataforma sinais que representem qualidade, não apenas volume.

## O que deves levar daqui

Pixel e CAPI devem funcionar como duas testemunhas do mesmo acontecimento. O `event_name` diz o que aconteceu e o `event_id` diz qual foi o acontecimento. Quando ambos são consistentes, a Meta pode deduplicar. Quando não são, o painel pode premiar uma campanha por resultados que nunca existiram.

Antes de aumentar orçamento, escolhe um lead de teste e segue o identificador pelos 5 pontos do fluxo. É uma verificação curta e vale mais do que qualquer leitura otimista do custo por resultado.

Se quiseres rever a implementação entre site, Meta Ads e CRM, fala connosco.
