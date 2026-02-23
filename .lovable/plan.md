

# Atualizar Footer (HomeFooter) com servicos atuais

## Problema
A secao "Solucoes" do footer lista items desatualizados ("SENVIA OS", "Landing Pages & Funis", "Agentes de IA", "Psicologos") que nao correspondem aos servicos atuais do submenu.

## Alteracoes

### `src/components/home/HomeFooter.tsx`

**Secao "Solucoes" (linhas 148-168)** - Atualizar os links para refletir os servicos atuais:

De:
```
SENVIA OS -> /senvia-os
Landing Pages & Funis -> /funis
Agentes de IA -> /ia
Psicologos -> /ia-psicologos
```

Para:
```
Sites & E-commerces -> /sites
Chatbots -> /chatbots
Softwares -> /softwares
```

Apenas 3 items em vez de 4, alinhados com o submenu "Servicos" da navbar.

