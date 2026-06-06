# Bird_Runner_Project

O jogo Bird Runner é um projeto acadêmico para desenvolver e por em prática as habilidades de aluno para o desenvolvimento web.

## Como rodar

O projeto é HTML/CSS/JS puro, sem build. Sirva a pasta raiz com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

E abra `http://localhost:8000/BirdRunner/` no navegador. É necessário um servidor local (não `file://`) porque o jogo usa ES Modules.

## Controles

- **Pular**: `Espaço`, `Seta pra cima`, clique ou toque
- **Pausar / menu / reiniciar**: botões na tela

## Estrutura

```
BirdRunner/
├── index.html     # entry point — 4 telas: menu, playing, paused, game-over
├── css/style.css  # estilos + sistema de telas (.screen + .screen--active)
└── js/            # main, bird, pipes, powerup, score, gameState, ...
```

