/**
 * PROJECTS配列からプロダクトカードのHTMLを生成する共通処理。
 * Home（注目プロダクト）とProjects（一覧）の両方から呼び出す。
 */
function createProjectCard(project, { showDescription = false } = {}) {
  const card = document.createElement(project.links.detail ? "a" : "div");
  card.className = "project-card";
  if (project.links.detail) {
    card.href = project.links.detail;
  }

  const thumb = document.createElement("div");
  thumb.className = "project-card__thumb";
  if (project.image) {
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = `${project.name} のスクリーンショット`;
    thumb.appendChild(img);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "project-card__placeholder";
    placeholder.textContent = project.name.charAt(0);
    thumb.appendChild(placeholder);
  }
  card.appendChild(thumb);

  const body = document.createElement("div");
  body.className = "project-card__body";

  const name = document.createElement("h3");
  name.textContent = project.name;
  body.appendChild(name);

  const tagline = document.createElement("p");
  tagline.className = "project-card__tagline";
  tagline.textContent = project.tagline;
  body.appendChild(tagline);

  if (showDescription && project.description) {
    const desc = document.createElement("p");
    desc.className = "project-card__description";
    desc.textContent = project.description;
    body.appendChild(desc);
  }

  if (project.status) {
    const status = document.createElement("span");
    status.className = "project-card__status";
    status.textContent = project.status;
    body.appendChild(status);
  }

  card.appendChild(body);
  return card;
}

function renderProjectList(containerSelector, options) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  PROJECTS.forEach((project) => {
    container.appendChild(createProjectCard(project, options));
  });
}
