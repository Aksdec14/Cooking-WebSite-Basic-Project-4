// Select the necessary DOM elements
const searchControl = document.querySelector('.search-control');
const searchButton = document.querySelector('.search-btn');
const mealContainer = document.getElementById('meal');
const mealDetails = document.querySelector('.meal-details');

// Function to fetch meals based on the search query
async function fetchMeals(query) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await res.json();
        return data.meals || [];
    } catch (error) {
        console.error("Error fetching meals:", error);
        return [];
    }
}

// Function to display meal results
function displayMeals(meals) {
    mealContainer.innerHTML = '';
    if (meals.length === 0) {
        mealContainer.innerHTML = `<div class="notFound">No meals found</div>`;
        return;
    }

    meals.forEach(meal => {
        const mealItem = document.createElement('div');
        mealItem.classList.add('meal-item');
        mealItem.innerHTML = `
            <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <a href="#" class="recipe-btn" data-id="${meal.idMeal}">View Recipe</a>
            </div>
        `;
        mealContainer.appendChild(mealItem);
    });

    // Add event listeners for recipe buttons
    addRecipeEventListeners();
}

// Function to display meal details
async function displayMealDetails(mealId) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await res.json();
        const meal = data.meals[0];

        mealDetails.innerHTML = `
            <button class="recipe-close-btn">X</button>
            <div class="meal-details-content">
                <h2 class="recipe-title">${meal.strMeal}</h2>
                <p class="recipe-category">${meal.strCategory}</p>
                <div class="recipe-meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <p class="recipe-instruct">${meal.strInstructions}</p>
                <div class="recipe-link">
                    <a href="${meal.strSource}" target="_blank">View Full Recipe</a>
                </div>
            </div>
        `;
        mealDetails.classList.add('showRecipe');

        // Close the recipe details when the close button is clicked
        const recipeCloseBtn = document.querySelector('.recipe-close-btn'); // Re-select button inside dynamically added content
        recipeCloseBtn.addEventListener('click', () => {
            mealDetails.classList.remove('showRecipe');
        });
    } catch (error) {
        console.error("Error fetching meal details:", error);
    }
}

// Function to add event listeners to "View Recipe" buttons
function addRecipeEventListeners() {
    const recipeBtns = document.querySelectorAll('.recipe-btn');
    recipeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const mealId = btn.getAttribute('data-id');
            displayMealDetails(mealId);
        });
    });
}

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const query = searchControl.value.trim();
    if (query) {
        const meals = await fetchMeals(query);
        displayMeals(meals);
    }
});

// Event listener for Enter key on search input
searchControl.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const query = searchControl.value.trim();
        if (query) {
            const meals = await fetchMeals(query);
            displayMeals(meals);
        }
    }
});
