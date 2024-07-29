document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favoritesContainer');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function displayFavorites() {
        favoritesContainer.innerHTML = '';
        if (favorites.length === 0) {
            const noFavoritesMessage = document.createElement('p');
            noFavoritesMessage.innerHTML = '<b>No favorites</hb>';
            noFavoritesMessage.style.textAlign = 'center';
            noFavoritesMessage.style.fontSize = '1.5rem';
            noFavoritesMessage.style.color = '#732d28';
            favoritesContainer.appendChild(noFavoritesMessage);
        } else {
            favorites.forEach(cocktail => {
                const favoriteItem = document.createElement('div');
                favoriteItem.className = 'favorite-item';
                favoriteItem.innerHTML = `
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                    <p>${cocktail.strDrink}</p>
                    <button class="remove-from-favorites">Remove from Favorites</button>
                    <button class="print-cocktail">Print Cocktail</button>
                `;
                favoriteItem.querySelector('.remove-from-favorites').addEventListener('click', () => removeFromFavorites(cocktail));
                favoriteItem.querySelector('.print-cocktail').addEventListener('click', () => printCocktail(cocktail));
                favoriteItem.querySelector('img').addEventListener('click', () => showCocktailDetails(cocktail));
                favoritesContainer.appendChild(favoriteItem);
            });
        }
    }

    function removeFromFavorites(cocktailToRemove) {
        favorites = favorites.filter(cocktail => cocktail.idDrink !== cocktailToRemove.idDrink);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        alert('Cocktail removed from favorites! ');
    }

    function showCocktailDetails(cocktail) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${cocktail.strDrink}</h2>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                <h3>Ingredients:</h3>
                <ul>
                    ${getIngredients(cocktail).join('')}
                </ul>
                <h3>Instructions:</h3>
                <p>${cocktail.strInstructions}</p>
            </div>
        `;
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        document.body.appendChild(modal);
    }

    function getIngredients(cocktail) {
        let ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`<li>${ingredient} - ${measure ? measure : ''}</li>`);
            }
        }
        return ingredients;
    }

    function printCocktail(cocktail) {
        const printWindow = window.open('', '', 'height=500, width=800');
        printWindow.document.write('<html><head><title>Cocktail</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(`<h2>${cocktail.strDrink}</h2>`);
        printWindow.document.write(`<img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="width:50%; border-radius:10px;">`);
        printWindow.document.write('<h3>Ingredients:</h3>');
        printWindow.document.write('<ul>');
        printWindow.document.write(getIngredients(cocktail).join(''));
        printWindow.document.write('</ul>');
        printWindow.document.write('<h3>Instructions:</h3>');
        printWindow.document.write(`<p>${cocktail.strInstructions}</p>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

      function goBackToTask2() {
        window.location.href = 'index.html';
    }

    document.querySelector('.back-to-task2').addEventListener('click', goBackToTask2);

    displayFavorites();
});
