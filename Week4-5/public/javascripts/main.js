const receptContainer = document.getElementById('recept')

let data = {
    name: "",
    ingredients: [],
    instructions: [],
    categories: []
}

async function fetchRecipes(){
    const res = await fetch('http://localhost:3000/recipe/cheesecake')
    return await res.json()
}

function setRecipe(res){
    receptContainer.innerHTML = `
    <h1>${res.name}</h1>
    <h4>Ingredients</h4>
    <ul>
    ${res.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <h4>Instruction</h4>
    <ol>
    ${res.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
    </ol>
    <div id="images"></div>
    ` 
    renderImages(res.images)
    resetActiceCategory()
}
function pageLoad(){
    initializeCategorySelect()
    fetchRecipes().then(res => {
        setRecipe(res)
    })    
}

function renderImages(images){
    console.log(images)
    fetch(`http://localhost:3000/images/${images}`)
        .then(res => res.json())
        .then(res => {
            const imageContainer = document.getElementById('images')
            const img = document.createElement('img')
            img.src = res.dataUrl
            imageContainer.appendChild(img)
            console.log(res)
        })
}

const nameText = document.getElementById('name-text')
const ingredientsText = document.getElementById('ingredients-text')
const addIngredient = document.getElementById('add-ingredient')
const instructionsText = document.getElementById('instructions-text')
const addInstruction = document.getElementById('add-instruction')
const submit = document.getElementById('submit')
const imageInput = document.getElementById('image-input')

addInstruction.addEventListener('click', () => {
    data.instructions.push(instructionsText.value)
})

addIngredient.addEventListener('click', () => {
    data.ingredients.push(ingredientsText.value)
})

submit.addEventListener('click', () => {
    data.name = nameText.value
    addImagesToList(imageInput.files).then(formData => {
        return fetch('http://localhost:3000/images', {
            method: 'POST',
            body: formData
        })
        }).then(res => res.json())
        .then((response) => {
            data.images = response.imageIds
            console.log(response.imageIds)
            fetch('http://localhost:3000/recipe/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                setRecipe(res)
                data = {
                    name: "",
                    ingredients: [],
                    instructions: [],
                    categories: [],
                    images: []
                }
        })
    })
})

async function addImagesToList(images){
    let formData = new FormData()
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }
    return formData
}

//searchbar
const searchInput = document.getElementById('search-input')
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetch(`http://localhost:3000/recipe/${searchInput.value}`)
        .then(res => res.json())
        .then(res => {
            setRecipe(res)
        })
    }
})

//Category select
const categorySelect = document.getElementById('category-select')
function initializeCategorySelect(){
    fetch('http://localhost:3000/categories')
    .then(res => res.json())
    .then(res => {
        console.log(res)
        res.forEach(category => {
            const a = document.createElement('a')
            a.innerHTML = category.name
            a.classList.add('collection-item')
            a.addEventListener('click', () => {
                if (a.classList.contains('active')){
                    data.categories = data.categories.splice(data.categories.indexOf(category._id), 1)
                    a.classList.remove('active')
                } else {
                    data.categories.push(category._id)
                    a.classList.add('active')
                }
            })
            categorySelect.appendChild(a)
        })
    })
}

//resetting active categories
function resetActiceCategory(){
    const activeCategories = document.querySelectorAll('.active')
    activeCategories.forEach(category => {
        category.classList.remove('active')
    })
}

pageLoad()