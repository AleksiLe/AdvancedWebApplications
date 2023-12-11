const receptContainer = document.getElementById('recept')

let data = {
    name: "",
    ingredients: [],
    instructions: []
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
    <h2>Instruction</h2>
    <ol>
    ${res.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
    </ol>
    ` 
}
function pageLoad(){
    fetchRecipes().then(res => {
        setRecipe(res)
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
    console.log(instructionsText.value)
})

addIngredient.addEventListener('click', () => {
    data.ingredients.push(ingredientsText.value)
})

submit.addEventListener('click', () => {
    data.name = nameText.value
    fetch('http://localhost:3000/recipe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        setRecipe(res)
    })
    const images = imageInput.files
    const formData = new FormData()
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    };
    fetch('http://localhost:3000/images', {
        method: 'POST',
        body: formData
    })

    data = {
        name: "",
        ingredients: [],
        instructions: []
    }
})

pageLoad()