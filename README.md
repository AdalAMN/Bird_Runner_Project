# Flappy Bird — Integracao Front-end + Backend

Projeto academico da disciplina de Programacao Web (UFAM). Jogo Flappy Bird integrado a uma aplicacao web completa com Express, TypeScript, Prisma e Bootstrap.

## Funcionalidades

- Cadastro de usuarios (nome, email, curso, senha)
- Login e logout com sessao
- Jogo Flappy Bird com 3 dificuldades e power-ups
- Salvar pontuacao automaticamente apos Game Over
- Pagina de ranking com top 10 jogadores
- Navbar responsiva condicional (logado / nao logado)

## Tecnologias

- **Backend:** Express.js + TypeScript
- **Banco de dados:** MariaDB + Prisma ORM
- **Templates:** Handlebars
- **Frontend:** Bootstrap 5, SCSS, JavaScript (ES Modules)
- **Game:** Vanilla JS com sistema de canos, power-ups e vidas

## Como Rodar

### 1. Clonar e instalar

```bash
git clone <url-do-repositorio>
cd Bird_Runner_Project
npm install
```

### 2. Configurar banco de dados

#### Com Docker

```bash
docker compose up -d
```

Sobe o MariaDB (porta 3306) e phpMyAdmin (porta 8080).
Acesse phpMyAdmin em `http://localhost:8080` para gerenciar o banco.

#### Sem Docker

Instale o MariaDB localmente e crie o banco e usuario manualmente.

### 3. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

O `.env.example` ja vem configurado para Docker. Se usar Docker, basta manter os valores padroes:

```
DATABASE_URL="mysql://projectuser:projectpass@localhost:3306/projectdb"
SESSION_SECRET="qualquer_senha_aqui"
```

### 4. Rodar migrations

```bash
npx prisma migrate dev
```

### 5. Compilar o SCSS

```bash
npm run sass:build
```

### 6. Iniciar o servidor

```bash
npm start
```

O servidor inicia em `http://localhost:3467`.

### 7. Acessar no navegador

- **Cadastro:** `http://localhost:3467/register`
- **Login:** `http://localhost:3467/login`
- **Jogar:** `http://localhost:3467/` (requer login)
- **Ranking:** `http://localhost:3467/ranking` (requer login)
- **Sobre:** `http://localhost:3467/about`
- **Lorem:** `http://localhost:3467/lorem/3`

