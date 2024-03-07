window.addEventListener("load", async function() {
  let resultado = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
  let data = await resultado.json();

  shuffleArray(data.data);

  console.log(data);

  let div = document.querySelector(".cartas");

  // Muestra todas las cartas al principio
  displayCards(data.data);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Función para mostrar cartas en el contenedor
  function displayCards(cards) {
    div.innerHTML = "";
    cards.slice(0, 100).forEach(function (data) {
      div.innerHTML += createCardHTML(data);
    });
  }

  // Función para crear el HTML de una carta
  function createCardHTML(data) {
    let archetypeButtonHTML = '';
    if (data.archetype) {
      archetypeButtonHTML = `<button class="btn btn-primary archetype-button" data-archetype="${data.archetype}">${data.archetype}</button>`;
    }

    return `<div>
      <div class="card text-bg-dark">
        <div class="card-container">
          <img src="${data.card_images[0].image_url_cropped}" class="card-img" alt="..." style="width: 330px; height: 360px;">
          <div class="card-img-overlay ima">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">
              ${data.type || ""}
              ${data.race || ""}
              ${data.attribute !== undefined ? `Atributo: ${data.attribute}` : ""}
            </p>
            <p class="card-text"><small>
              ${data.level !== undefined ? `Nivel ${data.level}` : ""}
              ${data.scale !== undefined ? `Scale ${data.scale}` : ""}
              ${data.link !== undefined ? `Nivel ${data.link}` : ""}
              ${data.atk !== undefined && data.def !== undefined ? `ATK ${data.atk} DEF ${data.def}` : ""}
            </p>
            <p class="card-text effect"><small>
              ${data.desc}
            </p>
            ${archetypeButtonHTML}
          </div>
        </div>
      </div>
    </div>`;
  }

  // Manejo de clics en los botones de archetype
  div.addEventListener('click', function(event) {
    const target = event.target;
    if (target.matches('.archetype-button')) {
      const archetype = target.getAttribute('data-archetype');
      const filteredCards = data.data.filter(card => card.archetype === archetype);
      displayCards(filteredCards);
    }
  });

  let selectedAttribute = null;
  let selectedLevel = null;
  let selectedRace = null;

  // Filtra las cartas según los filtros seleccionados
  function filterCards() {
    const filteredCards = data.data.filter(card => {
      const attributeCondition = !selectedAttribute || card.attribute === selectedAttribute;
      const levelCondition = !selectedLevel || card.level === selectedLevel;
      const raceCondition = !selectedRace || card.race === selectedRace;
      return attributeCondition && levelCondition && raceCondition;
    });
    displayCards(filteredCards);
  }

  // Manejo de clics en los elementos del dropdown de Attribute
  const attributeDropdownItems = document.querySelectorAll(".dropdown-item[data-attribute]");
  const attributeDropdownButton = document.getElementById("attributeDropdown");
  const levelDropdownButton = document.getElementById("levelDropdown");
  const raceDropdownButton = document.getElementById("raceDropdown");

  attributeDropdownItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      selectedAttribute = item.getAttribute("data-attribute");
      filterCards();
      attributeDropdownButton.textContent = `Attribute: ${selectedAttribute}`;
    });
  });

  // Manejo de clics en los elementos del dropdown de Level
  const levelDropdownItems = document.querySelectorAll(".dropdown-item[data-level]");

  levelDropdownItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      selectedLevel = parseInt(item.getAttribute("data-level")); // Convertimos el nivel a número
      filterCards();
      levelDropdownButton.textContent = `Level: ${selectedLevel}`;
    });
  });
  
  // Manejo de clics en los elementos del dropdown de Race
  const raceDropdownItems = document.querySelectorAll(".dropdown-item[data-race]");

  raceDropdownItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      selectedRace = item.getAttribute("data-race");
      filterCards();
      raceDropdownButton.textContent = `Race: ${selectedRace}`;
    });
  });

  // Manejo de clics en los elementos del dropdown de Type
  const typeDropdownItems = document.querySelectorAll(".dropdown-item[data-type]");

  typeDropdownItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const selectedType = item.getAttribute("data-type");
      filterCardsByType(selectedType);
      if (selectedType === "spell" || selectedType === "trap") {
        selectedAttribute = null;
        selectedLevel = null;
        selectedRace = null;
        attributeDropdownButton.textContent = "Attribute";
        levelDropdownButton.textContent = "Level";
        raceDropdownButton.textContent = "Race";
      }
    });
  });

  function filterCardsByType(selectedType) {
    const filteredCards = data.data.filter(card => {
      return card.type === selectedType || (selectedType === "spell" && card.type === "Spell Card") || (selectedType === "trap" && card.type === "Trap Card");
    });
    displayCards(filteredCards);
  }

  // Botón de reset
  const resetButton = document.getElementById("resetButton");

  resetButton.addEventListener("click", () => {
    selectedAttribute = null;
    selectedLevel = null;
    selectedRace = null;
    filterCards();
    attributeDropdownButton.textContent = "Attribute";
    levelDropdownButton.textContent = "Level";
    raceDropdownButton.textContent = "Race";
  });
});
