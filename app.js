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

  var db = window.indexedDB.open("showcaseDB", 1);
  db.onerror = function(event){
      console.log('error');
  }
  db.oncomplete = function(){
      console.log('complete');
  }
  db.onsuccess = function(){
      console.log('succes');
      console.log(db);
  }
  db.onupgradeneeded = function(event){
    console.log('upgrade!');
    console.log(event.target);
    // let objectStore = db.createObjectStore("project", { keyPath: "id" });

    //   for (let i in jsonData) {
    //       objectStore.add(jsonData.projects[i]);
    //   }
  }
}

function createProject(project) {
  return `
  <div class="container">
    <div class="card-panel recipe white row">
      <div class="project">
        <a href="https://cmgt.hr.nl:8000/api/project/${project.title}">
          <h2>${project.title}</h2>
          <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
          <p>${project.description}</p>
        </a>
      </div>
    </div>
  </div>
  `;
}