const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const drinksEl = document.getElementById("drinks");
const resultHeading = document.getElementById("result-heading");
const single_drinkEl = document.getElementById("single-drink");

//Search Meal and fetch from API
function searchDrink(e) {
  e.preventDefault();

  // Clear a single drink
  single_drinkEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for empty value
  if (term.trim()) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search Results for '${term}':<h2>`;

        if (data.drinks === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          drinksEl.innerHTML = data.drinks
            .map(
              (drink) => `
                <div class="drink">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
                    <div class="drink-info" data-drinkID="${drink.idDrink}">
                        <h3>${drink.strDrink}</h3>
                    </div>
                </div>
            `
            )
            .join("");
        }
      });
    // Clear search text
    search.value = "";
  } else {
    alert("Please enter a search term.");
  }
}

// Fetch drink by ID
function getDrinkById(drinkID) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];

      addDrinkToDOM(drink);
    });
}

// Add drink to DOM
function addDrinkToDOM(drink) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (drink[`strIngredient${i}`]) {
      ingredients.push(
        `${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_drinkEl.innerHTML = `
  <div class="single-drink">
    <h1>${drink.strDrink}</h1>
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
    <div class="single-drink-info">
      ${drink.strCategory ? `<p>${drink.strCategory}</p>` : ""}
      ${drink.strArea ? `<p>${drink.strArea}</p>` : ""}
    </div>
    <div class="main">
      <p>${drink.strInstructions}</p>
      <h3>Ingredients</h3>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </div>
  </div>`;
}

// Event listeners
submit.addEventListener("submit", searchDrink);

drinksEl.addEventListener("click", (e) => {
  const drinkInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("drink-info");
    } else {
      return false;
    }
  });

  if (drinkInfo) {
    const drinkID = drinkInfo.getAttribute("data-drinkid");
    getDrinkById(drinkID);
  }
});
