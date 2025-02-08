document.addEventListener('DOMContentLoaded', function () {
  const entryForm = document.querySelector('form');
  const searchInput = document.querySelector('#search');
  const searchResults = document.querySelector('#results');
  const searchIcon = document.querySelector('.searchIcon');
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const cuisineFilter = document.querySelector('#cuisine');

  let allRecipes = []; // Store all fetched recipes for filtering

  entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchRecipes();
  });

  searchIcon.addEventListener('click', () => {
      if (searchInput.value.trim() === '') {
          alert('Please enter something to get exciting recipes...');
      } else {
          searchRecipes();
      }
  });

  async function searchRecipes() {
      const searchValue = searchInput.value.trim();
      if (!searchValue) {
          alert("Please enter something to search for recipes!");
          return;
      }
      try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);
          const data = await response.json();
          if (data.meals) {
              allRecipes = data.meals; // Store all recipes for filtering
              displayResults(allRecipes);
          } else {
              searchResults.innerHTML = `<p class="no-recipe">No recipes found. Try another search.</p>`;
          }
      } catch (error) {
          console.error("Error fetching recipes:", error);
          searchResults.innerHTML = `<p class="no-recipe">Failed to fetch recipes. Please try again later.</p>`;
      }
  }

  function displayResults(recipes) {
      if (!recipes.length) {
          searchResults.innerHTML = `<p class="no-recipe">No recipes found.</p>`;
          return;
      }

      let innerHTML = "";
      recipes.forEach((recipe) => {
          innerHTML += `
          <div class="recipe-container">
              <div class="image-container">
                  <div class="javascript">
                      <i class='bx bxl-javascript'></i> <span>Made with JavaScript</span>
                  </div>
                  <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
              </div>
              <div class="recipe-details">
                  <h1>${recipe.strMeal} (${recipe.strCategory})</h1>
                  <h4>Origin: ${recipe.strArea}</h4>
                  <ul>
                      <li>${recipe.strInstructions.substring(0, 150)}...</li>
                  </ul>
                  <a class="view-recipe" href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank">Click here to view full recipe</a>
                  <div class="watch">
                      <h2>Watch on <a href="${recipe.strYoutube}" target="_blank"><i class='bx bxl-youtube'></i></a></h2>
                  </div>
              </div>
          </div>`;
      });
      searchResults.innerHTML = innerHTML;
  }

  // Filter by Cuisine
  cuisineFilter.addEventListener("change", () => {
      const selectedCuisine = cuisineFilter.value.toLowerCase();
      const filteredRecipes = selectedCuisine === "all"
          ? allRecipes
          : allRecipes.filter(recipe => recipe.strArea.toLowerCase() === selectedCuisine);
      displayResults(filteredRecipes);
  });

  // Filter by Category
  filterButtons.forEach(button => {
      button.addEventListener("click", () => {
          const selectedCategory = button.id.replace("filter-", "").toLowerCase();
          const filteredRecipes = selectedCategory === "all"
              ? allRecipes
              : allRecipes.filter(recipe => recipe.strCategory.toLowerCase().includes(selectedCategory));
          displayResults(filteredRecipes);
      });
  });
});
