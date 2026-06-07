// powerup.js
// Responsavel por: spawnar, mover, verificar coleta e aplicar efeitos de power-ups

import { containerEl } from "./dom.js";
import { rectsOverlap } from "./geometry.js";
import { addLife } from "./score.js";

// Tipos de power-up disponiveis

const POWERUP_TYPES = {
  SHIELD: {
    id: "shield",
    emoji: "🛡️",
    label: "Escudo",
    color: "#4FC3F7",
    duration: 3000,
  },
  EXTRA_LIFE: {
    id: "extra_life",
    emoji: "❤️",
    label: "Vida Extra",
    color: "#EF5350",
    duration: 0,
  },
  SLOW_MO: {
    id: "slow_mo",
    emoji: "⏳",
    label: "Câmera Lenta",
    color: "#FFD54F",
    duration: 4000,
  },
};

// Estado interno

/** @type {HTMLElement[]} Power-ups ativos no DOM */
const activePowerups = [];

/** @type {{ type: object, expiresAt: number }|null} Efeito ativo no momento */
let activeEffect = null;

let spawnTimer = 0;

const SPAWN_INTERVAL = 300;
const SPAWN_CHANCE = 0.4;
const SIZE = 36;
const SPEED = 2;

/** Indicador visual de power-up ativo na HUD; cache local para evitar lookup repetido */
const indicatorEl = document.getElementById("powerup-indicator");

// Funcoes publicas

/**
 * Reinicia o estado dos power-ups para uma nova partida.
 */
export function resetPowerups() {
  activePowerups.forEach((el) => el.remove());
  activePowerups.length = 0;
  activeEffect = null;
  spawnTimer = 0;
}

/**
 * Atualiza power-ups a cada frame: tenta spawnar, move os existentes,
 * remove os que saíram da tela e verifica se efeitos expiraram.
 * Deve ser chamado pelo main.js enquanto o estado for PLAYING.
 */
export function updatePowerups() {
  spawnTimer++;
  if (spawnTimer >= SPAWN_INTERVAL) {
    spawnTimer = 0;
    if (Math.random() < SPAWN_CHANCE) _spawnRandom();
  }

  for (let i = activePowerups.length - 1; i >= 0; i--) {
    const el = activePowerups[i];
    const newLeft = parseFloat(el.style.left) - SPEED;
    el.style.left = newLeft + "px";

    if (newLeft + SIZE < 0) {
      el.remove();
      activePowerups.splice(i, 1);
    }
  }

  if (activeEffect && Date.now() >= activeEffect.expiresAt) {
    _removeEffect(activeEffect.type);
    activeEffect = null;
  }
}

/**
 * Verifica se o pássaro coletou algum power-up.
 * Deve ser chamado pelo main.js após updatePowerups(), passando o elemento do pássaro.
 * @param {HTMLElement} birdEl
 */
export function checkPickup(birdEl) {
  const birdRect = birdEl.getBoundingClientRect();

  for (let i = activePowerups.length - 1; i >= 0; i--) {
    const el = activePowerups[i];
    const powerRect = el.getBoundingClientRect();

    if (rectsOverlap(birdRect, powerRect)) {
      const typeId = el.dataset.typeId;
      const type = Object.values(POWERUP_TYPES).find((t) => t.id === typeId);

      _applyEffect(type);

      _playCollectAnimation(el);

      activePowerups.splice(i, 1);
    }
  }
}

/**
 * Retorna true se o escudo estiver ativo no momento.
 * Usado pelo main.js para ignorar colisões enquanto o escudo estiver ativo.
 * @returns {boolean}
 */
export function isShieldActive() {
  return activeEffect?.type?.id === "shield";
}

/**
 * Retorna true se o slow motion estiver ativo.
 * Pode ser consultado pelo bird.js para reduzir a gravidade.
 * @returns {boolean}
 */
export function isSlowMoActive() {
  return activeEffect?.type?.id === "slow_mo";
}

// Funcoes privadas

/**
 * Spawna um power-up aleatório no lado direito da tela.
 */
function _spawnRandom() {
  const gameHeight = containerEl.offsetHeight;
  const gameWidth = containerEl.offsetWidth;

  // Escolhe tipo aleatoriamente
  const types = Object.values(POWERUP_TYPES);
  const type = types[Math.floor(Math.random() * types.length)];

  // Posição Y aleatória (evita aparecer nas bordas)
  const topMin = 40;
  const topMax = gameHeight - SIZE - 40;
  const top = topMin + Math.random() * (topMax - topMin);

  const el = document.createElement("div");
  el.classList.add("powerup");
  el.dataset.typeId = type.id;
  el.textContent = type.emoji;

  el.style.cssText = `
    position:    absolute;
    left:        ${gameWidth}px;
    top:         ${top}px;
    width:       ${SIZE}px;
    height:      ${SIZE}px;
    font-size:   22px;
    line-height: ${SIZE}px;
    text-align:  center;
    border-radius: 50%;
    background:  ${type.color}44;
    border:      2px solid ${type.color};
    cursor:      default;
    user-select: none;
    animation:   powerup-float 1s ease-in-out infinite alternate;
  `;

  containerEl.appendChild(el);
  activePowerups.push(el);
}

/**
 * Aplica o efeito do power-up coletado.
 * `extra_life` é aditivo: não mexe em `activeEffect`, então shield/slow_mo
 * ativos continuam contando normalmente. `shield` e `slow_mo` substituem
 * qualquer efeito anterior (resetando o timer).
 * @param {object} type - Um dos valores de POWERUP_TYPES
 */
function _applyEffect(type) {
  if (!type) return;

  switch (type.id) {
    case "extra_life":
      addLife();
      return;

    case "shield":
    case "slow_mo":
      if (activeEffect) {
        _removeEffect(activeEffect.type);
        activeEffect = null;
      }
      activeEffect = {
        type,
        expiresAt: Date.now() + type.duration,
      };
      _showEffectIndicator(type);
      break;
  }
}

/**
 * Remove o efeito visual do indicador de power-up ativo.
 * @param {object} type
 */
function _removeEffect(type) {
  console.log("[debug] _removeEffect: type =", type?.id);
  if (indicatorEl) indicatorEl.style.display = "none";
}

/**
 * Exibe o indicador de power-up ativo na HUD.
 * Requer um elemento <div id="powerup-indicator"> no HTML.
 * O indicador é escondido por _removeEffect, chamado de updatePowerups quando
 * o efeito de fato expira — assim o tempo do indicador respeita o pause.
 * @param {object} type
 */
function _showEffectIndicator(type) {
  if (!indicatorEl) return;

  indicatorEl.textContent = `${type.emoji} ${type.label}`;
  indicatorEl.style.display = "block";
}

/**
 * Anima e remove o elemento do power-up coletado do DOM.
 * @param {HTMLElement} el
 */
function _playCollectAnimation(el) {
  el.style.transition = "transform 0.2s ease, opacity 0.2s ease";
  el.style.transform = "scale(1.8)";
  el.style.opacity = "0";

  setTimeout(() => el.remove(), 200);
}
