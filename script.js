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

// Event listeners
submit.addEventListener("submit", searchDrink);
