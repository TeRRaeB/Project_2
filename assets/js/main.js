document.addEventListener('DOMContentLoaded', () => {
    const blenderSections = document.querySelectorAll('.section');
    const ingredients = document.querySelectorAll('.ingredient');
    const mixButton = document.getElementById('mix');
    const clearButton = document.getElementById('clear');
    const sweetnessScale = document.getElementById('sweetness-scale');
    const acidityScale = document.getElementById('acidity-scale');
    const bitternessScale = document.getElementById('bitterness-scale');

    ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', () => {
            addIngredient(ingredient);
        });
    });

    mixButton.addEventListener('click', () => {
        mixIngredients();
    });

    clearButton.addEventListener('click', () => {
        clearBlender();
    });

    function addIngredient(ingredient) {
        const emptySection = Array.from(blenderSections).find(section => !section.dataset.id);
        if (emptySection) {
            emptySection.dataset.id = ingredient.dataset.id;
            emptySection.dataset.sweetness = ingredient.dataset.sweetness;
            emptySection.dataset.acidity = ingredient.dataset.acidity;
            emptySection.dataset.bitterness = ingredient.dataset.bitterness;
            emptySection.style.backgroundColor = ingredient.dataset.color;
            emptySection.innerHTML = `
                <div>${ingredient.innerText}</div>
                <button class="remove-btn">Delete</button>
            `;
            updateFlavors(); 
            emptySection.querySelector('.remove-btn').addEventListener('click', () => {
                removeIngredient(emptySection);
            });
        }
    }

    function removeIngredient(section) {
        section.innerHTML = '';
        section.style.backgroundColor = '';
        delete section.dataset.id;
        delete section.dataset.sweetness;
        delete section.dataset.acidity;
        delete section.dataset.bitterness;
        updateFlavors();
    }

    function mixIngredients() {
        const colors = Array.from(blenderSections)
            .filter(section => section.dataset.id)
            .map(section => section.style.backgroundColor);
        
        if (colors.length > 0) {
            const mixedColor = colorMix(colors);
            blenderSections.forEach(section => {
                if (section.dataset.id) {
                    section.style.backgroundColor = mixedColor;
                }
            });
        }
    }

    function clearBlender() {
        blenderSections.forEach(section => {
            section.innerHTML = '';
            section.style.backgroundColor = '';
            delete section.dataset.id;
            delete section.dataset.sweetness;
            delete section.dataset.acidity;
            delete section.dataset.bitterness;
        });
        updateFlavors();
    }

    function updateFlavors() {
        let sweetness = 0;
        let acidity = 0;
        let bitterness = 0;

        blenderSections.forEach(section => {
            if (section.dataset.id) {
                sweetness += parseInt(section.dataset.sweetness, 10);
                acidity += parseInt(section.dataset.acidity, 10);
                bitterness += parseInt(section.dataset.bitterness, 10);
            }
        });

        updateScale(sweetnessScale, sweetness);
        updateScale(acidityScale, acidity);
        updateScale(bitternessScale, bitterness);
    }

    function updateScale(scale, value) {
        scale.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const cell = document.createElement('div');
            if (i < value) {
                cell.style.backgroundColor = '#f00';  
            }
            scale.appendChild(cell);
        }
    }

    function colorMix(colors) {
        let r = 0, g = 0, b = 0;
        colors.forEach(color => {
            const rgb = color.match(/\d+/g).map(Number);
            r += rgb[0];
            g += rgb[1];
            b += rgb[2];
        });

        r = Math.round(r / colors.length);
        g = Math.round(g / colors.length);
        b = Math.round(b / colors.length);

        return `rgb(${r}, ${g}, ${b})`;
    }
});
