const farm = document.getElementById('farm');
const digButton = document.getElementById('dig-button');
const plantButton = document.getElementById('plant-button');
const harvestButton = document.getElementById('harvest-button');
const seedSelect = document.getElementById('seed-select');
const moneyDisplay = document.getElementById('money');
const seasonDisplay = document.getElementById('season');

// Create dig effect element
const digEffect = document.createElement('div');
digEffect.id = 'dig-effect';
document.body.appendChild(digEffect);

// Define the size of the farm
const farmSize = 6; // 6x6 grid

const crops = {
    wheat: { cost: 10, stages: ['🌱', '🌿', '🌾'], growthTime: [3000, 3000] },
    corn: { cost: 15, stages: ['🌱', '🌿', '🌽'], growthTime: [4000, 4000] },
    carrot: { cost: 20, stages: ['🌱', '🌿', '🥕'], growthTime: [5000, 5000] },
    tomato: { cost: 25, stages: ['🌱', '🌿', '🍅'], growthTime: [6000, 6000] },
    pumpkin: { cost: 30, stages: ['🌱', '🌿', '🎃'], growthTime: [7000, 7000] },
    strawberry: { cost: 35, stages: ['🌱', '🌿', '🍓'], growthTime: [8000, 8000] }
};

let selectedTile = null;
let money = 100;
let season = 'Spring';
const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

// Create farm tiles
for (let i = 0; i < farmSize * farmSize; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.planted = 'false';
    tile.dataset.dug = 'false';
    tile.dataset.stage = '0';

    tile.addEventListener('click', () => selectTile(tile));
    farm.appendChild(tile);
}

function selectTile(tile) {
    if (selectedTile) {
        selectedTile.style.border = '1px solid #000';
    }
    selectedTile = tile;
    selectedTile.style.border = '2px solid yellow';
}

digButton.addEventListener('click', dig);
plantButton.addEventListener('click', plant);
harvestButton.addEventListener('click', harvest);

function dig() {
    if (selectedTile && selectedTile.dataset.dug === 'false') {
        selectedTile.dataset.dug = 'true';
        selectedTile.classList.add('dug'); // Add class for dug tiles

        // Show dig effect
        showDigEffect(selectedTile);
    }
}

function showDigEffect(tile) {
    const tileRect = tile.getBoundingClientRect();
    const digRect = digEffect.getBoundingClientRect();

    // Position the dig effect on the tile
    digEffect.style.left = `${tileRect.left + window.scrollX}px`;
    digEffect.style.top = `${tileRect.top + window.scrollY}px`;
    digEffect.style.display = 'block';

    // Hide the dig effect after animation
    setTimeout(() => {
        digEffect.style.display = 'none';
    }, 1000);
}

function plant() {
    const selectedSeed = seedSelect.value;
    const seedCost = crops[selectedSeed].cost;

    if (selectedTile && selectedTile.dataset.dug === 'true' && selectedTile.dataset.planted === 'false' && money >= seedCost) {
        money -= seedCost;
        updateMoneyDisplay();
        selectedTile.dataset.planted = 'true';
        selectedTile.dataset.stage = '1';
        selectedTile.dataset.crop = selectedSeed;
        selectedTile.textContent = crops[selectedSeed].stages[0];
        growPlant(selectedTile);
    }
}

function growPlant(tile) {
    const crop = crops[tile.dataset.crop];
    const stages = crop.stages;
    const growthTime = crop.growthTime;

    let stage = parseInt(tile.dataset.stage);
    if (stage < stages.length - 1) {
        setTimeout(() => {
            stage += 1;
            tile.dataset.stage = stage;
            tile.textContent = stages[stage];
            growPlant(tile);
        }, growthTime[stage - 1]);
    }
}

function harvest() {
    if (selectedTile && selectedTile.dataset.planted === 'true' && selectedTile.dataset.stage === '2') {
        const crop = selectedTile.dataset.crop;
        const cropValue = crops[crop].cost * 2; // Double the cost as reward
        money += cropValue;
        updateMoneyDisplay();
        showCoinEffect(selectedTile); // Show coin effect

        selectedTile.dataset.planted = 'false';
        selectedTile.dataset.stage = '0';
        selectedTile.dataset.dug = 'false';
        selectedTile.textContent = '';
        selectedTile.classList.remove('dug'); // Reset to original state
    }
}

function showCoinEffect(tile) {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.textContent = '💰';
    document.body.appendChild(coin);

    // Position the coin above the tile
    const tileRect = tile.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();
    coin.style.left = `${tileRect.left + tileRect.width / 2 - coinRect.width / 2}px`;
    coin.style.top = `${tileRect.top - coinRect.height}px`;

    // Remove the coin element after the animation
    setTimeout(() => {
        document.body.removeChild(coin);
    }, 1000);
}

function updateMoneyDisplay() {
    moneyDisplay.textContent = `Money: $${money}`;
}

function updateSeasonDisplay() {
    seasonDisplay.textContent = `Season: ${season}`;
}

function changeSeason() {
    const currentSeasonIndex = seasons.indexOf(season);
    const nextSeasonIndex = (currentSeasonIndex + 1) % seasons.length;
    season = seasons[nextSeasonIndex];
    updateSeasonDisplay();
}

setInterval(changeSeason, 10000); // Change season every 10 seconds

updateMoneyDisplay();
updateSeasonDisplay();
