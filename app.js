const main = document.querySelector('main');

window.addEventListener('load', e => {
  updateShowcases();

  if('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log(`SW registered`);
    } catch (error) {
      console.log(`SW failed`);
    }
  }
});

async function updateShowcases() {
  const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/`);
  const json = await res.json();

  main.innerHTML = json.projects.map(createProject).join('\n');
}

function createProject(project) {
  return `
    <div class="project">
      <a href="${project.url}">
        <h2>${project.title}</h2>
        <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
        <p>${project.description}</p>
      </a>
    </div>
  `;
}