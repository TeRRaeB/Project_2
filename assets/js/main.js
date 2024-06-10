document.addEventListener('DOMContentLoaded', () => {
    const blenderSections = document.querySelectorAll('.section');
    const mixButton = document.getElementById('mix');
    const clearButton = document.getElementById('clear');
    const ingredientsList = document.getElementById('ingredients-list');
    const sweetnessFill = document.getElementById('sweetness-fill');
    const sournessFill = document.getElementById('sourness-fill');
    const bitternessFill = document.getElementById('bitterness-fill');
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    const popupTitle = document.getElementById('popup-title');
    const popupDescript = document.getElementById('popup-descript');
    const closePopupButton = document.getElementById('close-popup');
    const recipesText = document.getElementById('recipes');
    recipesText.innerText = '';

    /**
     * Alphabetically sort ingredients before display
     */
    ingredients.sort((a, b) => a.name.localeCompare(b.name));

    displayIngredients(ingredients);
    displayRecipes();

    document.getElementById('close-welcome').addEventListener('click', () => {
        document.getElementById('welcome').style.display = 'none';
    });

    function showPopup(message, descript, mixedColor) {
        popupText.innerText = `Congratulations, you have made a ${message}!`;
        popupTitle.innerText = message;
        popupDescript.innerText = descript;
        popup.classList.remove('hidden');
        popup.style.background = mixedColor;
    }

    closePopupButton.addEventListener('click', () => {
        popup.classList.add('hidden');
        clearBlender();
    });


    mixButton.addEventListener('click', mixIngredients);
    clearButton.addEventListener('click', clearBlender);

    /**
     *  Function to display recipes.
     */
    function displayRecipes() {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            const recipeName = document.createElement('h3');
            const recipeIngridientList = document.createElement('ul');
            recipeName.innerText = recipe.name;
            recipe.ingredients.forEach(ingredientId => {
                const ingredient = ingredients.find(ing => ing.id === ingredientId);
                const ingredientItem = document.createElement('li');
                ingredientItem.innerText = ingredient ? ingredient.name : 'Unknown ingredient';
                recipeIngridientList.appendChild(ingredientItem);
            });
            recipeDiv.appendChild(recipeName);
            recipeDiv.appendChild(recipeIngridientList);
            recipesText.appendChild(recipeDiv);
        });
    }

    /**
     *  Function to display ingredients.
     */
    function displayIngredients(ingredients) {
        ingredientsList.innerHTML = '';
        ingredients.forEach(ingredient => {
            const ingredientButton = document.createElement('button');
            ingredientButton.className = 'ingredient';
            ingredientButton.dataset.id = ingredient.id;
            ingredientButton.dataset.color = ingredient.color;
            ingredientButton.dataset.sweetness = ingredient.sweetness;
            ingredientButton.dataset.sourness = ingredient.sourness;
            ingredientButton.dataset.bitterness = ingredient.bitterness;
            ingredientButton.innerText = ingredient.name;
            checkColorTextIngrid(ingredient.color) ? ingredientButton.style.color = 'rgb(0,0,0)' : ingredientButton.style.color = 'rgb(255,255,255)';
            ingredientButton.style.backgroundColor = ingredient.color;
            ingredientButton.addEventListener('click', () => addIngredient(ingredientButton));
            ingredientsList.appendChild(ingredientButton);
        });
    }

    /**
     *  Function to checking the color of the ingredient before display (black or white text color).
     */
    function checkColorTextIngrid(color) {
        let r = 0, g = 0, b = 0;
        const [red, green, blue] = color.match(/\d+/g).map(Number);
        r += red;
        g += green;
        b += blue;

        if (r < 160) {
            if (g < 160) {
                if (b < 160)
                    return false;
            }
            return true;
        }
        return true;
    }

    /**
     * Function to add an ingredient to a "Blender".
     */
    function addIngredient(ingredient) {
        const emptySection = [...blenderSections].find(section => !section.dataset.id);
        if (emptySection) {
            emptySection.dataset.id = ingredient.dataset.id;
            emptySection.dataset.sweetness = ingredient.dataset.sweetness;
            emptySection.dataset.sourness = ingredient.dataset.sourness;
            emptySection.dataset.bitterness = ingredient.dataset.bitterness;
            emptySection.style.backgroundColor = ingredient.dataset.color;
            emptySection.innerHTML = `
                <div class="name">${ingredient.innerText}</div>
                <button class="remove-btn">Delete</button>
            `;
            updateFlavors();

            emptySection.querySelector('.remove-btn').addEventListener('click', () => removeIngredient(emptySection));
        }
    }

    /**
     *  Function for removing one ingredient in a blender.
     */
    function removeIngredient(section) {
        section.innerHTML = '';
        section.style.backgroundColor = '';
        delete section.dataset.id;
        delete section.dataset.sweetness;
        delete section.dataset.sourness;
        delete section.dataset.bitterness;
        updateFlavors();
    }

    /**
     * Some of the code for this function was created using ChatGPT (v3.5) and adapted by me.
     * Function of mixing added ingredients.
     */
    function mixIngredients() {
        const currentIngredients = Array.from(blenderSections)
            .filter(section => section.dataset.id)
            .map(section => parseInt(section.dataset.id, 10));

        const matchedRecipe = recipes.find(recipe =>
            recipe.ingredients.length === currentIngredients.length &&
            recipe.ingredients.every(id => currentIngredients.includes(id))
        );


        const colors = [...blenderSections]
            .filter(section => section.dataset.id)
            .map(section => section.style.backgroundColor);
        let colorPeripe = '';
        if (colors.length) {
            const mixedColor = colorMix(colors);
            blenderSections.forEach(section => {
                if (section.dataset.id) section.style.backgroundColor = mixedColor;
                colorPeripe = mixedColor;
            });
        }
        if (matchedRecipe) {
            showPopup(matchedRecipe.name, matchedRecipe.descript, colorPeripe);
        }

    }

    /**
    *  Function for removing all ingredient in a blender.
    */
    function clearBlender() {
        blenderSections.forEach(section => {
            section.innerHTML = '';
            section.style.backgroundColor = '';
            delete section.dataset.id;
            delete section.dataset.sweetness;
            delete section.dataset.sourness;
            delete section.dataset.bitterness;
        });
        updateFlavors();
    }

    /**
    *  Recalculation of taste properties
    */
    function updateFlavors() {
        let sweetness = 0;
        let sourness = 0;
        let bitterness = 0;

        blenderSections.forEach(section => {
            if (section.dataset.id) {
                sweetness += parseInt(section.dataset.sweetness, 10);
                sourness += parseInt(section.dataset.sourness, 10);
                bitterness += parseInt(section.dataset.bitterness, 10);
            }
        });

        updateScale(sweetnessFill, sweetness);
        updateScale(sournessFill, sourness);
        updateScale(bitternessFill, bitterness);
    }

    /**
     * Recalculation of the flavor property line
     */
    function updateScale(fillElement, value) {
        const percentage = Math.min(value / 30 * 100, 100);
        fillElement.style.width = `${percentage}%`;
    }

    /**
     *  Mixing colors.
     */
    function colorMix(colors) {
        let r = 0, g = 0, b = 0;
        colors.forEach(color => {
            const [red, green, blue] = color.match(/\d+/g).map(Number);
            r += red;
            g += green;
            b += blue;
        });

        r = Math.round(r / colors.length);
        g = Math.round(g / colors.length);
        b = Math.round(b / colors.length);

        return `rgb(${r}, ${g}, ${b})`;
    }
});
