const state={
    score: {
        playerScore: 0,
        computerScore: 0,
        scorebox: document.getElementById("score_points"),
    },
    cardSprites: {
      avatar: document.getElementById("card_image"),
      name: document.getElementById("card_name"),
      type: document.getElementById("card_type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions:{
            button:document.getElementById("next-duel"),
    }
};
const playersSide={
    player1: "player-cards",
    playerBox: document.getElementById("player-cards"),
    computer: "computer-cards",
    computerBox: document.getElementById("computer-cards"),


}
const cardData=[
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        image: "src/assets/icons/dragon.png",
        WinOff:[1],
        LoseOff:[2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        image: "src/assets/icons/magician.png",
        WinOff:[2],
        LoseOff:[0],
    },
    {
        id: 2,
        name: "Exodia the Forbidden One",
        type: "Scissors",
        image: "src/assets/icons/exodia.png",
        WinOff:[0],
        LoseOff:[1],
    }
];
async function drawSelectedCard(id) {
    const card = cardData[id];
    state.cardSprites.avatar.setAttribute("src", card.image);
    state.cardSprites.name.innerText = card.name;
    state.cardSprites.type.innerText = "Atribute: " + card.type;

}
async function removeAllCards() {
    let imgs = playersSide.computerBox.querySelectorAll("img");
    imgs.forEach((img) => {
        img.remove();
    });
    imgs = playersSide.playerBox.querySelectorAll("img");
    imgs.forEach((img) => {
        img.remove();
    });
}
async function setCardsField(id) {
    await removeAllCards();
    let computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display="block"
    state.fieldCards.computer.style.display="block"
    state.fieldCards.player.setAttribute("src", cardData[id].image);
    state.fieldCards.computer.setAttribute("src", cardData[computerCardId].image);
    let duelResult = await duel(id, computerCardId);
    await updateScore();
    await drawButton(duelResult);

}
async function updateScore() {
    state.score.scorebox.innerText = `WIN: ${state.score.playerScore} - Lose: ${state.score.computerScore}`;
}
async function drawButton(duelResult) {
    state.actions.button.innerText = duelResult;
    state.actions.button.style.display = "block";
    state.actions.button.addEventListener("click", async () => {
        await removeAllCards();
        await drawCard(5, playersSide.player1);
        await drawCard(5, playersSide.computer);
        state.actions.button.style.display = "none";
        state.cardSprites.avatar.removeAttribute("src");
        state.cardSprites.name.innerText = "Selecione";
        state.cardSprites.type.innerText = "Uma carta";
        state.fieldCards.player.style.display="none";
        state.fieldCards.computer.style.display="none";
    });
}

async function duel(id, computerCardId) {
    let result = "Empate";
    let playerCard = cardData[id];
    let computerCard = cardData[computerCardId];
    if (playerCard.WinOff.includes(computerCardId)) {
        result = "Ganaste";
        await playAudio("win");
        state.score.playerScore += 1;
    } else if (playerCard.LoseOff.includes(computerCardId)) {
        result = "Perdiste";
        await playAudio("lose");
        state.score.computerScore += 1;
    }
    return result;
}
async function getRandomCardId() {
    const randomId = Math.floor(Math.random() * cardData.length);
    return cardData[randomId].id;
}
async function createCardImage(id, player) {
    const card = cardData[id];
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", id);
    cardImage.classList.add("card");
    if(player===playersSide.player1){
        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover", () => {
       drawSelectedCard(cardImage.getAttribute("data-id"));
    });
    }
    
    return cardImage;
}
async function drawCard(num, player) {
    for (let i = 0; i < num; i++) {
        const randomId = await getRandomCardId();
        const cardImage = await createCardImage(randomId, player);
        document.getElementById(player).appendChild(cardImage);
    }
}
async function playAudio(status){
    let audio = new Audio(`src/assets/audios/${status}.mp3`);
    if(status!=='egyptian_duel'){
        audio= new Audio(`src/assets/audios/${status}.wav`);
    }
    audio.play();
}
function initGame() {
    drawCard(5, playersSide.player1);
    drawCard(5, playersSide.computer);
    playAudio("egyptian_duel");
}
initGame();


