

# Atualizar Hero — Copy Escolhido + Remover SENVIA OS

## Copy Final

**Titulo principal:**
"Inteligencia Artificial nao e o futuro." + "E o agora."

**Subtitulo:**
"A SENVIA e especializada em Inteligencia Artificial e chegou para transformar a tua empresa. Software, automacoes e solucoes digitais, tudo potenciado por IA."

**CTA:** "Agendar Consultoria" (alinhado com a navbar)

## Alteracoes no arquivo `src/components/senvia/SenviaHeroSection.tsx`

### 1. Titulo H1 (linhas 110-117)
- **De:** "Construimos o / Futuro Digital."
- **Para:** "Inteligencia Artificial nao e o futuro." / "E o agora." (parte gradient-text-animated)

### 2. Paragrafo (linhas 119-122)
- **De:** Menciona "CRM proprietario — SENVIA OS"
- **Para:** "A SENVIA e especializada em Inteligencia Artificial e chegou para transformar a tua empresa. Software, automacoes e solucoes digitais, tudo potenciado por IA."

### 3. Botao CTA (linha 129)
- **De:** "Falar com Especialista"
- **Para:** "Agendar Consultoria"

### 4. Icone orbitante (linha 182)
- **De:** `{ icon: Rocket, label: "SENVIA OS", angle: 270, radius: 180 }`
- **Para:** `{ icon: Bot, label: "Chatbots", angle: 270, radius: 180 }` (importar `Bot` do lucide-react)

### Resumo
- 1 arquivo modificado: `src/components/senvia/SenviaHeroSection.tsx`
- 4 alteracoes pontuais (titulo, paragrafo, CTA, icone orbitante)
- Adicionar import `Bot` do lucide-react, remover `Rocket` se nao usado noutro lugar

