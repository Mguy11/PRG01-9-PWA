//importScripts("./localforage.js");

const main = document.querySelector('main');
const dbName = "showcaseDB";
const indexedDB = window.indexedDB ||
                  window.webkitIndexedDB ||
                  window.msIndexedDB ||
                  window.mozIndexedDB;
                  
let online = window.navigator.onLine;

window.addEventListener('load', e => {
  loadShowcases();

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

  // if(online) {
  //   fetch(`https://cmgt.hr.nl:8000/api/projects/tags`)
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then(data => {
  //     var text = "";

  //     for(let i = 0; i < data.tags.length; i++) {
  //       text += data.tags[i] + "<br>";
  //     }
  //     console.log(text)
  //     //document.querySelector('.status').innerHTML = text;
  //   })
  // } else {
  //   document.querySelector('.status').innerHTML = "The app is currently offline";
  // }
});

async function loadShowcases() {
  console.log("meme")
  const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/`);
  const json = await res.json();
  console.log(json)
  // let request = indexedDB.open(dbName, 1),
  // db,
  // tx,
  // store,
  // index;

  json.projects.map(createProject);

  json.projects.forEach((project) => {
    localforage.setItem(project._id, project).catch((err) =>{
      console.log(err);
    });
  });

  // request.onupgradeneeded = function(e) {
  //   let db = request.result,
  //       store = db.createObjectStore("projectsStore", { keyPath: "_id"}),
  //       index = store.createIndex("_id", "_id", { unique: true });
  // };
  // console.log("test1");

  // request.onerror = function(e) {
  //   console.log("There was an error: " + e.target.errorCode);
  // };

  // request.onsuccess = function(e) {
  //   console.log("test2");
  //   db = request.result;
  //   tx = db.transaction("projectsStore", "readwrite");
  //   store = tx.objectStore("projectsStore");
  //   index = store.index("_id");

  //   //get all errors when working with the database
  //   db.onerror = function(e) {
  //     console.log("ERROR" + e.target.errorCode);
  //   }

  //   console.log(json)
  //   //store all objects
  //   for (let project in json.projects) {
  //     store.put(json.projects[project]);
  //   }
  //   console.log("Added all projects to IndexedDB")
  //   //close db
  //   tx.oncomplete = function() {
  //     db.close();
  //     console.log("Close Database");
  //   }
  // }
}

function createProject(project) {
  // return `;
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