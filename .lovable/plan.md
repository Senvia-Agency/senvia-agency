

# Adicionar foto à Hero do SENVIA OS

## O que fazer

1. **Copiar a imagem** `user-uploads://Foto_SENVIA_OS.png` para `public/lovable-uploads/foto-senvia-os.png`

2. **Atualizar `src/components/senvia-os/OSHeroSection.tsx`**:
   - Substituir o `src` da imagem de `/lovable-uploads/5b66da66-9cb0-43be-842f-ce97b2e2e8e2.png` para `/lovable-uploads/foto-senvia-os.png`
   - Atualizar o `alt` para algo como "Fundador SENVIA OS a apresentar o sistema de comissões"
   - Ajustar o estilo da imagem para a foto ficar bem enquadrada (a foto é vertical/retrato, portanto pode precisar de `object-cover` com altura definida para não ficar desproporcional no layout 2 colunas)

