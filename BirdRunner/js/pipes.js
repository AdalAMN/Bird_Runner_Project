// pipes.js
// Responsável por: criar, mover, remover canos e detectar passagem pelo pássaro

import { getGameConfig } from './gameState.js';

// ─── Estado interno do módulo ────────────────────────────────────────────────

/** @type {HTMLElement[]} Lista de todos os elementos de cano ativos no DOM */
const activePipes = [];

let spawnTimer = 0;        // Contador de frames até o próximo par de canos
let pipesPassed = 0;       // Quantos pares de canos o pássaro já passou

// ─── Constantes base (ajustadas pela dificuldade via getGameConfig) ───────────

const PIPE_WIDTH    = 60;   // px — largura visual de cada cano
const MIN_GAP_TOP   = 80;   // px — altura mínima do cano de cima
const MIN_GAP_BOT   = 80;   // px — espaço mínimo abaixo do gap

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Inicializa (ou reinicia) o estado dos canos.
 * Chame ao começar uma nova partida.
 */
export function resetPipes() {
  // Remove todos os elementos do DOM
  activePipes.forEach(pipe => pipe.remove());
  activePipes.length = 0;

  spawnTimer  = 0;
  pipesPassed = 0;
}

/**
 * Deve ser chamado uma vez por frame pelo main.js enquanto o estado for PLAYING.
 * @returns {{ scored: boolean }} scored = true quando o pássaro passa por um par
 */
export function updatePipes() {
  const config = getGameConfig();   // velocidade e gap vindos da dificuldade atual
  let scored = false;

  // 1. Contar frames para o próximo spawn
  spawnTimer++;
  if (spawnTimer >= config.spawnInterval) {
    spawnTimer = 0;
    _spawnPair(config.pipeGap);
  }

  // 2. Mover e verificar cada cano
  // Percorremos de trás pra frente para poder remover com segurança
  for (let i = activePipes.length - 1; i >= 0; i--) {
    const pipe = activePipes[i];

    // Lê posição atual e aplica velocidade
    const currentLeft = parseFloat(pipe.style.left);
    const newLeft = currentLeft - config.pipeSpeed;
    pipe.style.left = newLeft + 'px';

    // Detecta passagem: quando o cano sai pelo lado esquerdo da tela
    // O dataset.scored evita contar o mesmo par duas vezes
    if (!pipe.dataset.scored && newLeft + PIPE_WIDTH < 0) {
      // Só marca ponto no cano de cima (cada par tem top + bottom)
      if (pipe.dataset.role === 'top') {
        pipesPassed++;
        scored = true;
      }
      pipe.dataset.scored = 'true';
    }

    // Remove canos que saíram completamente da tela
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

// ─── Funções privadas ─────────────────────────────────────────────────────────

/**
 * Cria um par de canos (topo + baixo) e insere no DOM.
 * @param {number} gapSize - Espaço em px entre os dois canos
 */
function _spawnPair(gapSize) {
  const container  = document.getElementById('game-container');
  const gameHeight = container.offsetHeight;
  const gameWidth  = container.offsetWidth;

  // Calcula posição aleatória para o gap (abertura entre os canos)
  const maxGapTop = gameHeight - gapSize - MIN_GAP_BOT;
  const gapTop    = MIN_GAP_TOP + Math.random() * (maxGapTop - MIN_GAP_TOP);
  const gapBottom = gapTop + gapSize;

  // Cria cano de CIMA (cresce para baixo, altura = gapTop)
  const topPipe = _createPipeElement({
    top:    0,
    height: gapTop,
    left:   gameWidth,
    role:   'top',
  });

  // Cria cano de BAIXO (vai do fim do gap até o chão)
  const bottomPipe = _createPipeElement({
    top:    gapBottom,
    height: gameHeight - gapBottom,
    left:   gameWidth,
    role:   'bottom',
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
  const el = document.createElement('div');

  el.classList.add('pipe', `pipe--${role}`);
  el.dataset.role   = role;
  el.dataset.scored = 'false';

  el.style.position = 'absolute';
  el.style.top      = top   + 'px';
  el.style.height   = height + 'px';
  el.style.left     = left  + 'px';
  el.style.width    = PIPE_WIDTH + 'px';

  return el;
}
