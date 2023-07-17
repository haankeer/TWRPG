let points = 0;
let clickValue = 1;
let upgradeCost = 10;
let passiveIncomeRate = 1;

let passiveUpgradeCost = 50;
let clickUpgradeCost = 20;

const pointsDisplay = document.getElementById("pointsDisplay");
const clickValueDisplay = document.getElementById("clickValueDisplay");
const clickButton = document.getElementById("clickButton");
const passiveUpgradeButton = document.getElementById("passiveUpgradeButton");
const clickUpgradeButton = document.getElementById("clickUpgradeButton");
const passiveIncomeDisplay = document.getElementById("passiveIncomeDisplay");
const exportButton = document.getElementById("exportButton");
const importButton = document.getElementById("importButton");
const importInput = document.getElementById("importInput");

let isUpgradeAvailable = false;
let isClickEnabled = true;

function updatePointsDisplay() {
    pointsDisplay.textContent = `Gold: ${points}`;
}

function updateClickValueDisplay() {
    clickValueDisplay.textContent = clickValue;
}

function updatePassiveUpgradeButton() {
    passiveUpgradeButton.textContent = `Melhorar Ganho Passivo (Custo: ${passiveUpgradeCost})`;
}

function updateClickUpgradeButton() {
    clickUpgradeButton.textContent = `Melhorar Clique (Custo: ${clickUpgradeCost})`;
}

function updateButtonsAvailability() {
    clickButton.disabled = !isClickEnabled;
    passiveUpgradeButton.disabled = points < passiveUpgradeCost;
    clickUpgradeButton.disabled = points < clickUpgradeCost;
}

function handleClick() {
    if (isClickEnabled) {
        points += clickValue;
        updatePointsDisplay();
        updateButtonsAvailability();
    }
}

function handlePassiveUpgradeClick() {
    if (points >= passiveUpgradeCost) {
        points -= passiveUpgradeCost;
        passiveIncomeRate += 2;
        passiveUpgradeCost *= 2;
        updatePointsDisplay();
        updatePassiveUpgradeButton();
        updateButtonsAvailability();
    }
}

function handleClickUpgradeClick() {
    if (points >= clickUpgradeCost) {
        points -= clickUpgradeCost;
        clickValue += 1;
        clickUpgradeCost *= 2;
        updatePointsDisplay();
        updateClickValueDisplay();
        updateClickUpgradeButton();
        updateButtonsAvailability();
    }
}

function passiveIncome() {
    points += passiveIncomeRate;
    updatePointsDisplay();
    isUpgradeAvailable = true;
    updateButtonsAvailability();
}

setInterval(function() {
    passiveIncome();
    updateUpgradeInfo();
    saveGame(); // Salvando o progresso a cada segundo
}, 1000); // Atualiza a cada 1000 ms (1 segundo)

clickButton.addEventListener("click", handleClick);
passiveUpgradeButton.addEventListener("click", handlePassiveUpgradeClick);
clickUpgradeButton.addEventListener("click", handleClickUpgradeClick);

function updateUpgradeInfo() {
    passiveIncomeDisplay.textContent = passiveIncomeRate;
}

function saveGame() {
    const saveData = {
        points: points,
        clickValue: clickValue,
        passiveIncomeRate: passiveIncomeRate,
        passiveUpgradeCost: passiveUpgradeCost,
        clickUpgradeCost: clickUpgradeCost
    };
    localStorage.setItem('medievalClickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const saveData = JSON.parse(localStorage.getItem('medievalClickerSave'));
    if (saveData) {
        points = saveData.points;
        clickValue = saveData.clickValue;
        passiveIncomeRate = saveData.passiveIncomeRate;
        passiveUpgradeCost = saveData.passiveUpgradeCost;
        clickUpgradeCost = saveData.clickUpgradeCost;
    }
}

window.addEventListener('beforeunload', saveGame); // Salva o jogo antes de fechar a página

// Atualização inicial
loadGame();
updatePointsDisplay();
updateClickValueDisplay();
updatePassiveUpgradeButton();
updateClickUpgradeButton();
updateButtonsAvailability();
updateUpgradeInfo();

exportButton.addEventListener("click", exportProgress);

function exportProgress() {
    const saveData = {
        points: points,
        clickValue: clickValue,
        passiveIncomeRate: passiveIncomeRate,
        passiveUpgradeCost: passiveUpgradeCost,
        clickUpgradeCost: clickUpgradeCost
    };

    const jsonString = JSON.stringify(saveData);
    const hash = btoa(jsonString);

    prompt("Copie o código abaixo para exportar o progresso:", hash);
}

importButton.addEventListener("click", importProgress);

function importProgress() {
    const hash = importInput.value.trim();
    if (!hash) {
        alert("Digite o código de importação.");
        return;
    }

    try {
        const jsonString = atob(hash);
        const saveData = JSON.parse(jsonString);

        points = saveData.points;
        clickValue = saveData.clickValue;
        passiveIncomeRate = saveData.passiveIncomeRate;
        passiveUpgradeCost = saveData.passiveUpgradeCost;
        clickUpgradeCost = saveData.clickUpgradeCost;

        updatePointsDisplay();
        updateClickValueDisplay();
        updatePassiveUpgradeButton();
        updateClickUpgradeButton();
        updateButtonsAvailability();
        updateUpgradeInfo();
    } catch (error) {
        alert("Código de importação inválido.");
    }
}
