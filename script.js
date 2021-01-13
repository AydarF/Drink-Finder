const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const drinksEl = document.getElementById("drinks");
const resultHeading = document.getElementById("result-heading");
const single_drinkEl = document.getElementById("single-drink");
const btnScrollUp = document.getElementById("btnScrollUp");

//Search Meal and fetch from API
function searchDrink(e) {
  e.preventDefault();

  // Clear a single drink
  // Also helps keep displaying a random drink after
  // you click a search button with an empty input
  if (!drinksEl.innerHTML == "") {
    single_drinkEl.innerHTML = "";
  }

  // Get search term
  const term = search.value;

  // Check for empty value
  if (term.trim()) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h3>Search Results for '${term}':<h3>`;

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
    if (!resultHeading.innerHTML == "") {
      const resultHeadingSave = resultHeading.innerHTML;
      resultHeading.innerHTML =
        "<h3>Please don't leave the search box empty</h3>";
      setTimeout(() => {
        resultHeading.innerHTML = resultHeadingSave;
      }, 2000);
    } else {
      resultHeading.innerHTML =
        "<h3>Please don't leave the search box empty</h3>";
      setTimeout(() => {
        resultHeading.innerHTML = "";
      }, 2000);
    }
  }
}

// Fetch drink by ID
function getDrinkById(drinkID) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
    .then((res) => res.json())
    .then((data) => {
      const drink = data.drinks[0];

      addDrinkToDOM(drink);
      scrollDown();
    });
}

// Fetch random drink from API
function getRandomDrink() {
  // Clear drinks and heading
  drinksEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
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
    <h3>${drink.strDrink}</h3>
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
    <div class="single-drink-info">
      ${drink.strCategory ? `<p>${drink.strCategory}</p>` : ""}
      ${drink.strArea ? `<p>${drink.strArea}</p>` : ""}
    </div>
    <div class="main">
      <p>${drink.strInstructions}</p>
      <h4>Ingredients</h4>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </div>
  </div>`;
}

// Scroll down to the drink info
function scrollDown() {
  single_drinkEl.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  single_drinkEl.scrollBottom += 16;
}

// Scroll to the top of the page
function scrollUp() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

// Event listeners
submit.addEventListener("submit", searchDrink);
random.addEventListener("click", getRandomDrink);
btnScrollUp.addEventListener("click", scrollUp);

drinksEl.addEventListener("click", (e) => {
  e.preventDefault();
  const xpath = e.path || (e.composedPath && e.composedPath());
  const drinkInfo = xpath.find((item) => {
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
