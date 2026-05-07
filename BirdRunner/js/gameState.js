// Estado global do jogo
const gameState = {
  running: true,
  paused: false,

  start() {
    this.running = true;
    this.paused = false;
  },

  pause() {
    this.paused = true;
  },

  resume() {
    this.paused = false;
  },

  stop() {
    this.running = false;
  },

  isActive() {
    return this.running && !this.paused;
  },
};
