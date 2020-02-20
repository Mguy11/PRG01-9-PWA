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

  const dbName = "showcaseDB";
  let dbRequest = indexedDB.open(dbName, 2);

  dbRequest.onerror = function(e) {
    db.onerror = function(e){
      console.log('error'); 
    }
  };

  
  dbRequest.onupgradeneeded = function(e) {
    db = e.target.result;
    console.log(db);
    
    let objectStore = db.createObjectStore("projects", { keyPath: "_id"});
    
    objectStore.createIndex("_id", "_id", { unique: true });
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("author", "author", { unique: false });
    objectStore.createIndex("year", "year", { unique: false });
    objectStore.createIndex("description", "description", { unique: false });

    objectStore.transaction.oncomplete = function(e) {
  
      var projectObjectStore = db.transaction("projects", "readwrite").objectStore("projects");
      json.projects.forEach(function(project) {
        projectObjectStore.add(project);
      });
    };
  };
  
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