
# Remover botao "Falar com Especialista" do Hero da pagina SENVIA OS

## Alteracao

### `src/components/home2/Hero2Section.tsx` (linhas 129-134)

Remover o bloco do segundo botao:
```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button onClick={scrollToContact} size="lg" variant="outline" className="text-base px-8 py-6 border-primary/30 hover:bg-primary/10">
    Falar com Especialista
  </Button>
</motion.div>
```

O botao "Comecar Teste Gratis" permanece como unico CTA no hero.
