
let squares = [...document.querySelectorAll(".square")];
let bots = [...document.querySelectorAll(".bot")];
let botContainer = document.querySelector(".bot-container");
let startReset = document.getElementById("start-reset");

bots.forEach(bot => {
     bot.addEventListener("click", () => {
          bot.innerHTML = "B" ? "" : "B"; //? hereeeeee
          bot.classList.add("bot-active");
     });
});

class Token {
     constructor(color) {
          this.color = color;
          this.token = document.createElement("div");
          this.token.classList.add("token", color);
          this.token.id = color;
          this.bot = false;
     }
}

let red = new Token("red");
let blue = new Token("blue");
let yellow = new Token("yellow");
let green = new Token("green");

let i = Math.floor(Math.random() * 4);
let currentPlayer = [red, blue, yellow, green][i];

function init() {
     let startSquare = document.querySelector("div[place-index='1']");
     [red, blue, yellow, green].forEach(color => {
          startSquare.appendChild(color.token);
     });
     currentPlayer.token.classList.add("active");
     makeBots([red, blue, yellow, green]);
     document.getElementById("current-player").innerText = `Current Player: ${currentPlayer.color}`;
     // document.querySelector(".dice").innerText = `${currentPlayer.color}`;
}

function makeBots(colors) {
     colors.forEach(color => {
          if (color.token.classList.contains("bot-active")) {
               color.token.classList.add("bot");
               color.bot = true;
               color.token.innerText = "B";
               color.token.style.pointerEvents = "none";
          } else {
               color.token.classList.remove("bot");
               color.bot = false;
               color.token.innerText = "";
          }
     });
}

startReset.addEventListener("click", () => {
     if (startReset.innerText === "Start") {
          startReset.innerText = "Reset";
          init();
     } else {
          resetGame();
          startReset.innerText = "Start";
     }
});

function rollDice() {
     let dice = Math.floor(Math.random() * 6) + 1;
     document.querySelector(".dice").innerText = `${currentPlayer.color} ${dice}`;
     moveToken(dice);
}

function moveToken(dice) {
     let token = currentPlayer.token;
     let anotherTurn = false;
     token.classList.add("active");
     token.style.boxShadow = `0 0 10px var(--${token.id})`;
     let squareIndex = +token.parentElement.getAttribute("place-index");
     let currentSquare = document.querySelector(`div[place-index='${squareIndex}']`);
     let newSquareIndex = (squareIndex + dice > squares.length) ? squareIndex : squareIndex + dice;
     let newSquare = document.querySelector(`div[place-index='${newSquareIndex}']`);
     token.style.scale = 0;
     setTimeout(() => {
          newSquare.appendChild(token);
          token.style.scale = 1;
          checkSpecial(currentSquare, newSquare);
          checkWin(newSquareIndex, anotherTurn);
     }, 400);
     // stackTokens([squareIndex, newSquareIndex]);
}

function checkSpecial(currentSquare, square) {
     let special = square.querySelector(".special");
     if (special) {
          let sendTo = special.getAttribute("send-to");
          if (sendTo !== "null") {
               let sendToSquare = document.querySelector(`div[place-index='${sendTo}']`);
               sendToSquare.appendChild(currentPlayer.token);
               // stackTokens([squareIndex, sendTo]);
          } else {
               let specialType = special.id;
               if (specialType === "doubler") {
                    let sendToSquare = document.querySelector(`div[place-index='${+special.getAttribute("send-to") * 2}']`);
                    sendToSquare.appendChild(currentPlayer.token);
               } else if (specialType === "twicer") {
                    return true;
               } else if (specialType === "swapper") {
                    let lastToken = getLastTokenPosition();
                    lastToken.parentElement.appendChild(currentPlayer.token);
                    currentSquare.appendChild(lastToken);
               }
          }
     }
     return false;
}

function getLastTokenPosition() {
     let squaresWithTokens = [...document.querySelectorAll(".square")].filter(square => square.querySelector(".token"));
     let leastNumber = Math.min(...squaresWithTokens.map(square => +square.getAttribute("place-index")));
     let lastTokenParent = document.querySelector(`div[place-index='${leastNumber}']`);
     return lastTokenParent.querySelector(".token");
}

function checkWin(squareIndex, anotherTurn) {
     if (squareIndex === squares.length) {

          document.getElementById("winner").innerText = `${currentPlayer.color} wins!`;
          currentPlayer.token.classList.remove("active");
          // let crown = document.createElement("img");
          // crown.id = "crown";
          // currentPlayer.token.appendChild(crown);
          // document.getElementById("crown").src = "https://Kwshal.github.io/SnL/img/win.png"; 
     } else {
          // updateLastTokenPosition();
          !anotherTurn && nextPlayer();
     }
}

function resetGame() {
     bots.forEach(bot => {
          bot.innerHTML = "";
     });
     init();
}

function nextPlayer() {
     currentPlayer.token.classList.remove("active");
     i = (i + 1) % 4;
     currentPlayer = [red, blue, yellow, green][i];
     document.getElementById("current-player").innerText = `Current Player: ${currentPlayer.color}`;
}

function stackTokens(indexes) {
     indexes.forEach(index => {
          let square = document.querySelector(`div[place-index='${index}']`);
          // square.children.length > 1    ?
     });
}

function generateSpecialSquares(sendTo, squareIndexes, type, scale = 1, direction = 0, inset) {
     squareIndexes.forEach(index => {
          let square = document.querySelector(`div[place-index='${index}']`);
          let special = document.createElement("img");
          special.src = `https://Kwshal.github.io/SnL/img/${type}.png`;
          special.id = type;
          special.classList.add("special");
          special.setAttribute("send-to", sendTo);
          special.style.transform = `rotate(${direction}deg) scale(${scale})`;
          // special.style.inset = `${inset}px`;
          square.appendChild(special);
     });
}

(() => {
     generateSpecialSquares(null, [83], "swapper", 1.1);
     generateSpecialSquares(null, [45], "doubler", .9);
     generateSpecialSquares(null, [93], "doubler", .9, 180);
     generateSpecialSquares(31, [10], "jumper");
     generateSpecialSquares(81, [60], "jumper");

     generateSpecialSquares(null, [28], "twicer", 0.8);
     generateSpecialSquares(null, [76], "twicer", 0.8, 180);
     generateSpecialSquares(68, [96, 86, 74, 68], "declimb", 1, 45);
     generateSpecialSquares(15, [5, 15], "climber", 1, -45);
     generateSpecialSquares(78, [62, 78], "climber", 1, -45);
     generateSpecialSquares(55, [55, 33, 47], "climber", 1, -135);
     generateSpecialSquares(37, [37, 43], "declimb", 1, 45);
     generateSpecialSquares(71, [90, 71], "declimb", 1, 90);
     generateSpecialSquares(40, [22, 40], "climber", 1, -135);
})();










