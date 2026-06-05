// bird.js
// Responsável por: física do pássaro (gravidade, pulo, posição) e sua representação no DOM

import { isSlowMoActive } from './powerup.js';

// ─── Referência ao DOM ────────────────────────────────────────────────────────

const birdEl = document.getElementById('bird');

// ─── Constantes de física ─────────────────────────────────────────────────────

const GRAVITY       =  0.4;   // px/frame² — aceleração para baixo
const JUMP_FORCE    = -7;     // px/frame  — velocidade ao pular (negativo = sobe)
const MAX_FALL_SPEED = 10;    // px/frame  — velocidade máxima de queda
const SLOW_MO_MULT  =  0.4;   // multiplicador de gravidade durante slow motion

// Posição inicial do pássaro (centro vertical, lado esquerdo)
const INITIAL_X = 80;         // px do lado esquerdo do container
const INITIAL_Y = 200;        // px do topo do container

// ─── Estado interno ───────────────────────────────────────────────────────────

let posY     = INITIAL_Y;   // posição vertical atual em px
let velocity = 0;           // velocidade vertical atual em px/frame

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Reseta o pássaro para a posição e velocidade iniciais.
 * Chame ao iniciar ou reiniciar a partida.
 */
export function resetBird() {
  posY     = INITIAL_Y;
  velocity = 0;

  birdEl.style.left = INITIAL_X + 'px';
  birdEl.style.top  = posY + 'px';

  // Remove rotação residual de uma partida anterior
  birdEl.style.transform = 'rotate(0deg)';
}

/**
 * Atualiza a física do pássaro em um frame.
 * Deve ser chamado pelo main.js a cada frame enquanto o estado for PLAYING.
 */
export function updateBird() {
  // Aplica gravidade — reduzida se slow motion estiver ativo
  const gravityThisFrame = isSlowMoActive()
    ? GRAVITY * SLOW_MO_MULT
    : GRAVITY;

  velocity += gravityThisFrame;

  // Limita a velocidade de queda para não atravessar objetos
  velocity = Math.min(velocity, MAX_FALL_SPEED);

  posY += velocity;

  // Atualiza posição no DOM
  birdEl.style.top = posY + 'px';

  // Rotaciona o pássaro conforme a direção do movimento
  _applyRotation();
}

/**
 * Aplica força de pulo ao pássaro.
 * Chamado pelo main.js quando o input.js detecta um clique/tecla.
 */
export function jumpBird() {
  velocity = JUMP_FORCE;
}

/**
 * Retorna o elemento DOM do pássaro.
 * Usado pelo collision.js e pelo checkPickup do powerup.js.
 * @returns {HTMLElement}
 */
export function getBirdEl() {
  return birdEl;
}

// ─── Funções privadas ─────────────────────────────────────────────────────────

/**
 * Rotaciona o sprite do pássaro baseado na velocidade vertical:
 * - Subindo rápido → inclina para cima (-30°)
 * - Caindo         → inclina para baixo (até +90°)
 */
function _applyRotation() {
  // Mapeia velocity para graus de rotação
  const minVelocity = JUMP_FORCE;      // -7 → -30°
  const maxVelocity = MAX_FALL_SPEED;  //  10 → +90°

  const minAngle = -30;
  const maxAngle =  90;

  const angle = minAngle + ((velocity - minVelocity) / (maxVelocity - minVelocity))
    * (maxAngle - minAngle);

  birdEl.style.transform = `rotate(${Math.round(angle)}deg)`;
}
