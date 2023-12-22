window.addEventListener("load",async function(){


    let resultado= await fetch ("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    let data=await  resultado.json()
    
    shuffleArray(data.data);
    
    console.log(data)

   
    let div = document.querySelector(".cartas")

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
    
   
   data.data.slice(0, 200).forEach(function(data){
      div.innerHTML+=`<div>

      <div class="card text-bg-dark">
      <div class="card-container">
  <img src="${data.card_images[0].image_url_cropped}" class="card-img" alt="..." style="width: 330px; height: 360px;">
  <div class="card-img-overlay ima">
  
    <h5 class="card-title">${data.name}</h5>
    <p class="card-text">
    ${data.type || ''} 
    ${data.race || ''}
    ${data.attribute !== undefined ? `Nivel ${data.attribute}` : ''}
    </p>
    <p class="card-text"><small> 
    ${data.level !== undefined ? `Nivel ${data.level}` : ''}
    ${data.scale !== undefined ? `Scale ${data.scale}` : ''}
    ${data.link !== undefined ? `Nivel ${data.link}` : ''}
    ${data.atk !== undefined && data.def !== undefined ? `ATK ${data.atk} DEF ${data.def}` : ''}
    </p>
    <p class="card-text effect"><small>
      ${data.desc}
    </p>
    ${data.archetype ? `
    <div style="position: relative; display: flex; justify-content: center;">
      <div style="position: absolute; z-index: 1;">
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${data.id}" aria-expanded="false" aria-controls="collapse-${data.id}">
                Archetype ${data.archetype}
              </button>
            </h2>
            <div id="collapse-${data.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body" style="max-height: 200px; overflow-y: auto;">
                ${cardsByArchetype[data.archetype].map(card => `<div>${card}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ` : ''}
  
      
    </div>
  `;
})


    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
  })
