// bird.js
// Responsavel por: fisica do passaro (gravidade, pulo, posicao) e sua representacao no DOM

import { isSlowMoActive } from "./powerup.js";

// Referencia ao DOM

export const birdEl = document.getElementById("bird");

// Constantes de fisica

const GRAVITY = 0.4;
const JUMP_FORCE = -7;
const MAX_FALL_SPEED = 10;
const SLOW_MO_MULT = 0.4;

// Possicao inicial do passaro (centro vertical, lado esquerdo)
const INITIAL_X = 80;
const INITIAL_Y = 200;

// Estado interno

let posY = INITIAL_Y;
let velocity = 0;

// Funcoes públicas ─────────────────────────────────────────────────────────

/**
 * Reseta o passaro para a posicao e velocidade iniciais.
 * Chame ao iniciar ou reiniciar a partida.
 */
export function resetBird() {
  posY = INITIAL_Y;
  velocity = 0;

  birdEl.style.left = INITIAL_X + "px";
  birdEl.style.top = posY + "px";
}

/**
 * Atualiza a fisica do passaro em um frame.
 * Deve ser chamado pelo main.js a cada frame enquanto o estado for PLAYING.
 */
export function updateBird() {
  // Aplica gravidade — reduzida se slow motion estiver ativo
  const gravityThisFrame = isSlowMoActive() ? GRAVITY * SLOW_MO_MULT : GRAVITY;

  velocity += gravityThisFrame;

  // Limita a velocidade de queda para não atravessar objetos
  velocity = Math.min(velocity, MAX_FALL_SPEED);

  posY += velocity;

  // Atualiza posicao no DOM
  birdEl.style.top = posY + "px";

  // Rotaciona o passaro conforme a direção do movimento
  _applyRotation();
}

/**
 * Aplica força de pulo ao passaro.
 * Chamado pelo main.js quando o input.js detecta um clique/tecla.
 */
export function jumpBird() {
  velocity = JUMP_FORCE;
}

// Funcoes privadas

/**
 * Rotaciona o sprite do passaro baseado na velocidade vertical:
 * - Subindo rapido -> inclina para cima (-30 graus)
 * - Caindo -> inclina para baixo (até +90 graus)
 */
function _applyRotation() {
  const minVelocity = JUMP_FORCE; // -7 -> -30 graus
  const maxVelocity = MAX_FALL_SPEED; //  10 -> +90 graus

  const minAngle = -30;
  const maxAngle = 90;

  const angle =
    minAngle +
    ((velocity - minVelocity) / (maxVelocity - minVelocity)) *
      (maxAngle - minAngle);

  birdEl.style.transform = `rotate(${Math.round(angle)}deg)`;
}
