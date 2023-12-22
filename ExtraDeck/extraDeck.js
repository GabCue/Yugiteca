window.addEventListener("load", async function() {
    let resultado = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    let data = await resultado.json();
  
    shuffleArray(data.data);
  
    console.log(data);
  
    let div = document.querySelector(".cartas");
  
    function groupByArchetype(cards) {
      const groupedCards = {};
      cards.forEach((card) => {
        if (card.archetype) {
          if (!groupedCards[card.archetype]) {
            groupedCards[card.archetype] = [];
          }
          groupedCards[card.archetype].push(card.name);
        }
      });
      return groupedCards;
    }
  
    const cardsByArchetype = groupByArchetype(data.data);
    function filterMonsters(card) {
        const allowedTypes = ["Fusion Monster", "Synchro Monster", "XYZ Monster", "Link Monster"];
        return (
          card.type &&
          allowedTypes.some((type) => card.type.toLowerCase().includes(type.toLowerCase()))
        );
      }
    
      // Filtra las cartas usando la función personalizada
      const filteredMonsters = data.data.filter(filterMonsters);
    
      // Muestra las cartas filtradas
      displayMonsters(filteredMonsters);
  
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    // Función para mostrar cartas en el contenedor
    function displayMonsters(monsters) {
      div.innerHTML = "";
      monsters.slice(0, 100).forEach(function (data) {
        div.innerHTML += createCardHTML(data);
      });
    }
  
    // Función para crear el HTML de una carta
    function createCardHTML(data) {
      return `<div>
        <div class="card text-bg-dark">
          <div class="card-container">
            <img src="${
              data.card_images[0].image_url_cropped
            }" class="card-img" alt="..." style="width: 330px; height: 360px;">
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
                ${
                  data.atk !== undefined && data.def !== undefined
                    ? `ATK ${data.atk} DEF ${data.def}`
                    : ""
                }
              </p>
              <p class="card-text effect"><small>
                ${data.desc}
              </p>
              ${
                data.archetype
                  ? `
                  <div style="position: relative; display: flex; justify-content: center;">
                    <div style="position: absolute; z-index: 1;">
                      <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                          <h2 class "accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${data.id}" aria-expanded="false" aria-controls="collapse-${data.id}">
                              Archetype ${data.archetype}
                            </button>
                          </h2>
                          <div id="collapse-${data.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div class="accordion-body" style="max-height: 200px; overflow-y: auto;">
                              ${cardsByArchetype[data.archetype].map((card) => `<div>${card}</div>`).join("")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `
                  : ""
              }
            </div>
          </div>
        </div>
      </div>`;
    }
  
  const levelDropdown  = document.getElementById("levelDropdown");
  const attributeDropdown = document.getElementById("attributeDropdown");
  const typeDropdown = document.getElementById("typeDropdown");
  const monsterDropdown = document.getElementById("monsterDropdown");


  const levelFilters = document.querySelectorAll(".level-filter");
  const attributeFilters = document.querySelectorAll(".attribute-filter");
  const raceFilters = document.querySelectorAll(".race-filter");
  const monsterFilters = document.querySelectorAll(".monster-filter");
  
    let selectedLevel = null;
    let selectedAttribute = null;
    let selectedRace = null;
    let selectedMonster = null;
  
    levelFilters.forEach((filter) => {
        filter.addEventListener("click", (event) => {
          event.preventDefault();
          selectedLevel = filter.getAttribute("data-level");
          levelDropdown.textContent = `Level: ${selectedLevel}`;
        filterCards();
        });
      });
  
    attributeFilters.forEach((filter) => {
      filter.addEventListener("click", (event) => {
        event.preventDefault();
        selectedAttribute = filter.getAttribute("data-attribute");
        attributeDropdown.textContent = `Attribute: ${selectedAttribute}`;
      filterCards();
      });
    });
  
    raceFilters.forEach((filter) => {
      filter.addEventListener("click", (event) => {
        event.preventDefault();
        selectedRace = filter.getAttribute("data-race");
        typeDropdown.textContent = `Race: ${selectedRace}`;
        filterCards();
      });
    });

    monsterFilters.forEach((filter) => {
        filter.addEventListener("click", (event) => {
          event.preventDefault();
          selectedMonster = filter.getAttribute("data-monster");
          monsterDropdown.textContent = `Monster: ${selectedMonster}`;
          filterCards();
        });
      });
  
    function filterCards() {
        const filteredByFilters = filteredMonsters.filter((monster) => {
          const levelCondition = !selectedLevel || monster.level == selectedLevel;
          const attributeCondition = !selectedAttribute || monster.attribute == selectedAttribute;
          const raceCondition = !selectedRace || monster.race == selectedRace;
          const typeCondition = !selectedMonster || monster.type == selectedMonster;
    
    
          return levelCondition && attributeCondition && raceCondition && typeCondition;
        });
    
        displayMonsters(filteredByFilters);
      }
      const resetButton = document.getElementById("resetButton");
    
    resetButton.addEventListener("click", () => {
      selectedLevel = null;
      selectedAttribute = null;
      selectedRace = null;
      selectedMonster = null;
    
      levelDropdown.textContent = "Level";
      attributeDropdown.textContent = "Attribute";
      typeDropdown.textContent = "Race";
      monsterDropdown.textContent = "Type";
    
      displayMonsters(filteredMonsters);
    })
  });
  