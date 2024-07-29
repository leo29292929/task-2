document.addEventListener('DOMContentLoaded', () => {
    // Create and style header and its contents
    const header = document.createElement('header');
    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';
    
    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'Cocktail Search';
    headerTitle.style.marginLeft='40%'

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.maxLength = 1;
    searchInput.placeholder= 'search';
    searchInput.style.border='5px solid red '
    searchInput.style.height='40px'
    searchInput.style.marginLeft='40%'
    searchInput.style.borderRadius='30px'
    searchInput.style.textAlign='center'

 
    const showFavoritesButton = document.createElement('button');
    showFavoritesButton.id = 'showFavorites';
    showFavoritesButton.textContent = 'Show Favorites';
    showFavoritesButton.style.marginLeft='80%'
    showFavoritesButton.style.transform = 'translateY(-60px)';
    showFavoritesButton.style.position='relative'

    headerContent.appendChild(headerTitle);
    headerContent.appendChild(searchInput);
    header.appendChild(headerContent);
    header.appendChild(showFavoritesButton);
    document.body.appendChild(header);

    // Create main container and grid containers
    const container = document.createElement('div');
    container.className = 'container';
    document.body.appendChild(container);

    const cocktailGrid = document.createElement('div');
    cocktailGrid.className = 'cocktail-grid';
    cocktailGrid.id = 'cocktailGrid';
    container.appendChild(cocktailGrid);
   
    // Floating detail block setup
    const floatingBlock = document.createElement('div');
    floatingBlock.className = 'floating-block';
    floatingBlock.id = 'floatingBlock';
    floatingBlock.style.display = 'none';
    
    const floatingBlockContent = document.createElement('div');
    floatingBlockContent.className = 'floating-block-content';
    
    const closeFloatingBlock = document.createElement('span');
    closeFloatingBlock.className = 'close-floating';
    closeFloatingBlock.innerHTML = '&times;';
    
    floatingBlockContent.appendChild(closeFloatingBlock);
    floatingBlockContent.appendChild(document.createElement('div'));
    floatingBlock.appendChild(floatingBlockContent);
    document.body.appendChild(floatingBlock);

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    async function searchCocktail(letter) {
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.drinks || [];
        } catch (error) {
            console.error('Error fetching cocktails:', error);
            return [];
        }
    }

    function displayCocktails(cocktails) {
        cocktailGrid.innerHTML = '';
        cocktails.forEach(cocktail => {
            const cocktailItem = document.createElement('div');
            cocktailItem.className = 'cocktail-item';
            cocktailItem.innerHTML = `
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                <p>${cocktail.strDrink}</p>
                <button class="add-to-favorites">Add to Favorites</button>
            `;
            cocktailItem.querySelector('img').addEventListener('click', () => showFloatingBlock(cocktail));
            cocktailItem.querySelector('.add-to-favorites').addEventListener('click', () => saveToFavorites(cocktail));
            cocktailGrid.appendChild(cocktailItem);
        });
    }

    function showFloatingBlock(cocktail) {
        floatingBlockContent.innerHTML = `
            <span class="close-floating">&times;</span>
            <h2 class="items">${cocktail.strDrink}</h2>
            <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" class="items-img">
            <h3 class="items">Ingredients:</h3>
            <ul class="items">
                ${getIngredients(cocktail).join('')}
            </ul>
            <h3 class="items">Instructions:</h3>
            <p class="items">${cocktail.strInstructions}</p>
            <button id="saveToFavorites" class="items">Add to Favorites</button>
        `;
        floatingBlock.style.display = 'block';
        document.getElementById('saveToFavorites').addEventListener('click', () => saveToFavorites(cocktail));
    }

    function getIngredients(cocktail) {
        let ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`<li>${ingredient} - ${measure}</li>`);
            }
        }
        return ingredients;
    }

    function saveToFavorites(cocktail) {
        if (!favorites.some(fav => fav.idDrink === cocktail.idDrink)) {
            favorites.push(cocktail);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Cocktail saved to favorites!');
        } else {
            alert('Cocktail already saved to favorites!!!!!!');
        }
    }

    function displayFavorites() {
        window.location.href = 'task2-2.html';
    }



    searchInput.addEventListener('keyup', async (e) => {
        const letter = e.target.value.trim().toLowerCase();
        if (letter.length === 1) {
            const cocktails = await searchCocktail(letter);
            displayCocktails(cocktails);
            cocktailGrid.style.display = 'grid';
            favoritesContainer.style.display = 'none';
        }
    });

    floatingBlock.addEventListener('click', (e) => {
        if (e.target === floatingBlock || e.target.classList.contains('close-floating')) {
            floatingBlock.style.display = 'none';
        }
    });

    showFavoritesButton.addEventListener('click', () => {
        displayFavorites();
        favoritesContainer.style.display = 'block';
        cocktailGrid.style.display = 'none';
    });
});
