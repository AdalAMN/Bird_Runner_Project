// pipes.js
// Responsável por: criar, mover, remover canos e detectar passagem pelo passaro

import { getGameConfig } from "./gameState.js";

// Estado interno do modulo

/** @type {HTMLElement[]} Lista de todos os elementos de cano ativos no DOM */
const activePipes = [];

let spawnTimer = 0;
let pipesPassed = 0;

// Constantes base (ajustadas pela dificuldade via getGameConfig)

const PIPE_WIDTH = 60;
const MIN_GAP_TOP = 80;
const MIN_GAP_BOT = 80;

// Funcoes publicas

/**
 * Inicializa (ou reinicia) o estado dos canos.
 * Chame ao começar uma nova partida.
 */
export function resetPipes() {
  activePipes.forEach((pipe) => pipe.remove());
  activePipes.length = 0;

  spawnTimer = 0;
  pipesPassed = 0;
}

/**
 * Deve ser chamado uma vez por frame pelo main.js enquanto o estado for PLAYING.
 * @returns {{ scored: boolean }} scored = true quando o pássaro passa por um par
 */
export function updatePipes() {
  const config = getGameConfig();
  let scored = false;

  spawnTimer++;
  if (spawnTimer >= config.spawnInterval) {
    spawnTimer = 0;
    _spawnPair(config.pipeGap);
  }

  for (let i = activePipes.length - 1; i >= 0; i--) {
    const pipe = activePipes[i];

    const currentLeft = parseFloat(pipe.style.left);
    const newLeft = currentLeft - config.pipeSpeed;
    pipe.style.left = newLeft + "px";

    if (!pipe.dataset.scored && newLeft + PIPE_WIDTH < 0) {
      if (pipe.dataset.role === "top") {
        pipesPassed++;
        scored = true;
      }
      pipe.dataset.scored = "true";
    }

    // Remove canos que sairam completamente da tela
    if (newLeft + PIPE_WIDTH < -10) {
      pipe.remove();
      activePipes.splice(i, 1);
    }
  }

  return { scored };
}

/**
 * Retorna todos os elementos de cano ativos.
 * Usado pelo collision.js para checar colisão.
 * @returns {HTMLElement[]}
 */
export function getAllPipes() {
  return activePipes;
}

/**
 * Retorna quantos pares de canos o pássaro já passou nesta partida.
 * @returns {number}
 */
export function getPipesPassed() {
  return pipesPassed;
}

// Funcoes privadas

/**
 * Cria um par de canos (topo + baixo) e insere no DOM.
 * @param {number} gapSize - Espaço em px entre os dois canos
 */
function _spawnPair(gapSize) {
  const container = document.getElementById("game-container");
  const gameHeight = container.offsetHeight;
  const gameWidth = container.offsetWidth;

  // Calcula posicao aleatoria para o gap (abertura entre os canos)
  const maxGapTop = gameHeight - gapSize - MIN_GAP_BOT;
  const gapTop = MIN_GAP_TOP + Math.random() * (maxGapTop - MIN_GAP_TOP);
  const gapBottom = gapTop + gapSize;

  // Cria cano de CIMA (cresce para baixo, altura = gapTop)
  const topPipe = _createPipeElement({
    top: 0,
    height: gapTop,
    left: gameWidth,
    role: "top",
  });

  // Cria cano de BAIXO (vai do fim do gap até o chão)
  const bottomPipe = _createPipeElement({
    top: gapBottom,
    height: gameHeight - gapBottom,
    left: gameWidth,
    role: "bottom",
  });

  container.appendChild(topPipe);
  container.appendChild(bottomPipe);

  activePipes.push(topPipe, bottomPipe);
}

/**
 * Cria e estiliza um elemento de cano.
 * @param {{ top: number, height: number, left: number, role: string }} opts
 * @returns {HTMLElement}
 */
function _createPipeElement({ top, height, left, role }) {
  const el = document.createElement("div");

  el.classList.add("pipe", `pipe--${role}`);
  el.dataset.role = role;
  el.dataset.scored = "false";

  el.style.position = "absolute";
  el.style.top = top + "px";
  el.style.height = height + "px";
  el.style.left = left + "px";
  el.style.width = PIPE_WIDTH + "px";

  return el;
}
