interface Prof {
  nome: string;
  sala: number;
}

interface Technology {
  name: string;
  type: string;
  poweredByNodejs: boolean;
}

function listProfs(profs: Prof[]) {
  const list = profs
    .map((p) => `<li>${p.nome} - Sala ${p.sala}</li>`)
    .join("\n");
  return `<ul>${list}</ul>`;
}

function listTechnologies(technologies: Technology[]) {
  const filtered = technologies.filter((t) => t.poweredByNodejs);
  const list = filtered.map((t) => `<li>${t.name} (${t.type})</li>`).join("\n");
  return `<ul>${list}</ul>`;
}

export default {
  listProfs,
  listTechnologies,
};
