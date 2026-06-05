// collision.js
// Responsável por: detectar colisao entre o bird e qualquer cano ou o chao/teto

import { containerEl } from "./dom.js";
import { rectsOverlap } from "./geometry.js";

// Funcao publica

/**
 * Verifica se o bird colidiu com algum cano, com o chão ou com o teto.
 *
 * Usa getBoundingClientRect() para obter a poisicao real dos elementos no viewport.
 * Aplica um FATOR DE TOLERÂNCIA para tornar a colisao mais justa visualmente:
 * a hitbox é ligeiramente menor que o elemento visual.
 *
 * @param {HTMLElement}   birdEl  - O elemento #bird
 * @param {HTMLElement[]} pipes   - Array de elementos de cano (getAllPipes())
 * @returns {{ hit: boolean, reason: string|null }}
 *   hit    = true se houve colisao
 *   reason = 'pipe' | 'floor' | 'ceiling' | null
 */
export function checkCollision(birdEl, pipes) {
  const birdRect = _getShrunkRect(birdEl, 0.7);

  // 1. Colisao com o chao ou teto
  const containerRect = containerEl.getBoundingClientRect();

  if (birdRect.bottom >= containerRect.bottom) {
    return { hit: true, reason: "floor" };
  }
  if (birdRect.top <= containerRect.top) {
    return { hit: true, reason: "ceiling" };
  }

  // 2. Colisao com canos
  for (const pipe of pipes) {
    const pipeRect = _getShrunkRect(pipe, 0.85);

    if (rectsOverlap(birdRect, pipeRect)) {
      return { hit: true, reason: "pipe" };
    }
  }

  return { hit: false, reason: null };
}

// Funcoes privadas

/**
 * Retorna um DOMRect "encolhido" pelo fator dado, centralizado no elemento.
 * Isso cria uma hitbox menor que o visual, deixando o jogo mais justo.
 *
 * @param {HTMLElement} el     - Elemento do DOM
 * @param {number}      factor - 0.0 a 1.0 (ex: 0.75 = hitbox 75% do tamanho)
 * @returns {{ top: number, bottom: number, left: number, right: number }}
 */
function _getShrunkRect(el, factor) {
  const rect = el.getBoundingClientRect();
  const shrinkX = (rect.width * (1 - factor)) / 2;
  const shrinkY = (rect.height * (1 - factor)) / 2;

  return {
    top: rect.top + shrinkY,
    bottom: rect.bottom - shrinkY,
    left: rect.left + shrinkX,
    right: rect.right - shrinkX,
  };
}
