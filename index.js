const main = document.querySelector("main");

const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];
// Exercice est un tableau d'objets qui contient les informations de chaque exercice (image et durée en minutes)
let exerciceArray = [];

// get stored exerciceArray

(() => {
  if (localStorage.exercices) {
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = basicArray;
  }
})();

// Exercice est une classe qui permet de créer des objets qui contiennent les informations de chaque exercice (image et durée en minutes)
class Exercice {
  constructor(pic, min) {
    this.pic = pic;
    this.min = min;
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },

  //   permet de gérer les événements sur les boutons de la page
  handleEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exerciceArray.map((exercice) => {
          if (exercice.pic == e.target.id) {
            exercice.min = parseInt(e.target.value);
            this.store();
          }
        });
      });
    });
  },

  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exercice) => {
          if (exercice.pic == e.target.dataset.pic && position !== 0) {
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            page.lobby();
            this.store();
          } else {
            position++;
            console.log(position);
          }
        });
      });
    });
  },
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", (e) => {
        let newArray = [];
        exerciceArray.map((exercice) => {
          if (exercice.pic != e.target.dataset.pic) {
            newArray.push(exercice);
          }
        });
        exerciceArray = newArray;
        page.lobby();
        this.store();
        console.log(exerciceArray);
      });
    });
  },

  reboot: function () {
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },
  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
};

// Page est un objet qui contient des méthodes qui permettent de générer le contenu de la page en fonction de l'état de l'application (lobby, routine, finish) et de l'interaction de l'utilisateur (click sur le bouton start, reboot, etc.)
const page = {
  lobby: function () {
    let mapArray = exerciceArray
      .map(
        (exercice) =>
          `
            <li>
               <div class="card-header">
                <input type="number" id=${exercice.pic} value=${exercice.min} min="1" max="10">
                <span>min</span>
               </div>
               <img src="img/${exercice.pic}.png" alt="exercice ${exercice.pic}">
               <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exercice.pic} ></i>
               <i class="fas fa-times-circle deleteBtn" data-pic=${exercice.pic} ></i>
            </li>        
        `
      )
      .join("");
    utils.pageContent(
      "Paramétage <i id='reboot' class='fas fa-undo'></i>",
      `<ul>${mapArray}</ul>`,
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );
    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
  },
  routine: function () {
    utils.pageContent(
      "Routine <i id='reboot' class='fas fa-undo'></i>",
      "Exercice avec chrono",
      null
    );
  },

  finish: function () {
    utils.pageContent(
      "C'est fini !",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinitialiser<i class='fas fa-times-circle'></i></button>"
    );
  },
};

page.lobby();
