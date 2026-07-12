/**
 * PostCSS config isolado do blog.
 *
 * Sem Tailwind — blog usa CSS vanilla com custom properties.
 * Este ficheiro override impede o Vite de carregar o postcss.config.js
 * do monorepo parent (que depende de Tailwind).
 */
export default {
  plugins: {},
};
