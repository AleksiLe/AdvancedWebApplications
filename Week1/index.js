const contain = document.querySelector('.container')

const breeds = ["keeshond", "beagle", "basenji", "tervuren","kelpie"]
function initializeCode() {
  createWikiItem(1)
  createWikiItem(2)
  createWikiItem(3)
  createWikiItem(4)
  createWikiItem(0)
}

async function fetchRandomDog(breed) {
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
  const data = await res.json();
  return data;
}

async function fetchDogSummary(breed) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${breed}`
  );
  const data = await res.json();
  return data;
}

async function createWikiItem(i) {
  const dog = await fetchRandomDog(breeds[i]);
  const dogSummary = await fetchDogSummary(breeds[i]);
  let item = document.createElement("div");
  item.className = "wiki-item";
  let header = document.createElement("h1");
  header.className = "wiki-header";
  let content = document.createElement("div");
  content.className = "wiki-content";
  let text = document.createElement("p");
  text.className = "wiki-text";
  text.innerText = dogSummary.extract;
  let container = document.createElement("div");
  container.className = "img-container";
  let img = document.createElement("img");
  img.src = dog.message;
  header.innerText = breeds[i];
  img.className = "wiki-img";
  container.appendChild(img);
  content.appendChild(container);
  content.appendChild(text);
  item.appendChild(header);
  item.appendChild(content);
  contain.appendChild(item);
}

initializeCode();
