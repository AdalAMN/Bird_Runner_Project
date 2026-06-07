// geometry.js
// Utilitarios geometricos compartilhados entre os modulos do jogo.

// Funcoes publicas

/**
 * Verifica se dois retangulos se sobrepoem em ambos os eixos (X e Y).
 * Dois retangulos NAO se sobrepoem se um esta completamente acima,
 * abaixo, a esquerda ou a direita do outro.
 *
 * Aceita tanto um DOMRect (de getBoundingClientRect) quanto um objeto
 * com os mesmos campos (ex.: o retorno de _getShrunkRect em collision.js).
 *
 * @param {{ top: number, bottom: number, left: number, right: number }} a
 * @param {{ top: number, bottom: number, left: number, right: number }} b
 * @returns {boolean}
 */
export function rectsOverlap(a, b) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}
