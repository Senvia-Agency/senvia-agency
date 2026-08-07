# Vídeo da hero da página /sites

## Ficheiro esperado

```
public/videos/sites-hero.mp4
```

Assim que este ficheiro existir, a página `/sites` passa **automaticamente** a usar vídeo
na moldura de browser da hero. Não é preciso alterar código: a existência do ficheiro é
verificada em build-time em `src/pages/sites.astro`.

Enquanto o ficheiro não existir, a hero usa o screenshot real do Longev Studio
(`src/assets/projetos/longev-studio.png`), otimizado pelo Astro.

## O que o vídeo deve mostrar

Um loop curto e calmo, sem texto queimado na imagem, com três momentos:

1. Um site de cliente a ser percorrido (scroll suave);
2. O clique no botão de WhatsApp / o envio do formulário;
3. O relatório de resultados / tracking.

## Especificações

| Item      | Valor recomendado                                   |
| --------- | --------------------------------------------------- |
| Formato   | MP4 (H.264 + AAC ou sem áudio)                      |
| Rácio     | **1898 × 906** (≈ 2.1:1), igual aos screenshots    |
| Duração   | 8 a 14 segundos, em loop perfeito                   |
| Peso      | **≤ 2 MB** (idealmente ~1,2 MB)                     |
| FPS       | 24 a 30                                               |
| Áudio     | Sem áudio (o vídeo é reproduzido em mute)           |

O rácio importa: a moldura reserva `aspect-ratio: 1898 / 906`. Um rácio diferente é
recortado com `object-fit: cover` e pode cortar informação nas bordas.

## Comportamento implementado

- `muted`, `loop`, `playsinline`;
- `preload="none"`: o ficheiro **só** é descarregado depois de a página carregar,
  por isso não compete com o LCP;
- O screenshot otimizado está sempre na moldura e é ele o candidato a LCP.
  O vídeo entra por cima, com fade, só depois de estar mesmo a tocar. Se falhar
  o carregamento, fica a imagem e ninguém dá por nada;
- Enquanto está a tocar aparece um botão para parar a animação, no canto
  inferior direito da moldura (exigido pelo critério WCAG 2.2.2, nível A);
- O vídeo **não** é carregado quando:
  - o utilizador tem `prefers-reduced-motion: reduce`;
  - a largura do ecrã é inferior a 768 px (mobile fica no poster);
  - o browser reporta `navigator.connection.saveData === true`.

Em qualquer um desses casos fica o poster estático, sem download desperdiçado.
