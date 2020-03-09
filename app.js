let online = window.navigator.onLine;

window.addEventListener('load', e => {
  
  if('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
      console.log(`SW registered`)
    } catch (error) {
      console.log(`SW registration failed`);
    }
  }
  
  if (!window.indexedDB) {
    console.log("Your browser does not support IndexedDB");
  }else{
    console.log("Your browser supports IndexedDB")
  }
  
  loadShowcases();

  if (navigator.onLine) {
    console.log("online");
    fetch("https://cmgt.hr.nl:8000/api/projects/tags")
      .then(res => {
        return res.json();
      })
      .then(data => {
        var text = "";

        for (let i = 0; i < data.tags.length; i++) {
          text += `<div class="tag">
                    <span class="tag-text">${data.tags[i]}</span>
                   </div>`;
        }
        document.querySelector(".status-tags").innerHTML = text;
      });
  } else {
    console.log("offline");
    document.querySelector(".status-tags").innerHTML = "It seems the app is offline, sadlife";
  }

});

async function loadShowcases() {
  const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/`);
  const json = await res.json();

  json.projects.map(createProject);
  json.projects.forEach((project) => {
    localforage.setItem(project._id, project).catch((err) =>{
      console.log(err);
    });
  });
}

function createProject(project) {
  localforage
  .getItem(project._id)
  .then(() => {
    document.querySelector("main").insertAdjacentHTML(
      "afterbegin",
      `<div class="container">
        <div class="card-panel recipe white row">
          <div class="project">
            <div>
              <h2>${project.title}</h2>
              <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
              <p>${project.description}</p>
              <hr/>
              <p class="blue-text">${project.tags}</p>
            </div>
          </div>
        </div>
      </div>`
    );
  })
  .catch((err) => {
    console.log(err);
  });
}