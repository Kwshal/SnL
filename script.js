
let squares = [...document.querySelectorAll(".square")];

class Token {
     constructor(color) {
          this.color = color;
          this.token = document.createElement("div");
          this.token.classList.add("token", color);
          this.token.id = color;
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
     document.getElementById("current-player").innerText = `Current Player: ${currentPlayer.color}`;
}
init();

function rollDice() {
     let dice = Math.floor(Math.random() * 6) + 1;
     document.querySelector(".dice").innerText = `Rolled: ${dice}`;
     moveToken(dice);
}

function moveToken(dice) {
     let token = currentPlayer.token;
     token.classList.add("active");
     let squareIndex = +token.parentElement.getAttribute("place-index");
     let newSquareIndex = (squareIndex + dice > squares.length) ? squareIndex: squareIndex + dice ;
     let newSquare = document.querySelector(`div[place-index='${newSquareIndex}']`);
     newSquare.appendChild(token);
     stackTokens([squareIndex, newSquareIndex]);
     checkWin(newSquareIndex);
}

function checkWin(squareIndex) {
     if (squareIndex === squares.length) {
          
          document.getElementById("winner").innerText = `${currentPlayer.color} wins!`;
          currentPlayer.token.classList.remove("active");
          let crown = document.createElement("img");
          crown.id = "crown";
          currentPlayer.token.appendChild(crown);
          document.getElementById("crown").src = "https://Kwshal.github.io/SnL/img/win.png"; 
     } else {
          // nextPlayer();
     }
}

function resetGame() {
     squares.forEach(square => {
          square.innerHTML = "";
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

function criticalSquares(squareIndexes, type, scale = 1, direction = 0) {
     squareIndexes.forEach(index => {
          let square = document.querySelector(`div[place-index='${index}']`);
          let special = document.createElement("img");
          special.src = `https://Kwshal.github.io/SnL/img/${type}.png`;
          special.id = type;
          special.classList.add("special");
          special.style.transform = `rotate(${direction}deg) scale(${scale})`;
          square.appendChild(special);
     });
}

criticalSquares([83], "swapper", 1.1);
criticalSquares([3,88], "doubler", 1);
criticalSquares([10,60], "jumper", 1);
criticalSquares([27], "twicer", 0.9);
criticalSquares([76], "twicer", 0.9, 180);
criticalSquares([97,85,75,67], "climber", 1, 45);
criticalSquares([5,15,52,34,48], "climber", 1, -45);
criticalSquares([37,44,57,64], "climber", 1, 90);
criticalSquares([22,40], "climber", 1, -135);
     









