
//this part is for letters
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var interval = null;
window.onload = event => {
  var x = document.querySelector("h1");

  clearInterval(interval);
  var iteration = 0;
  interval = setInterval(() => {
    x.innerText = x.innerText.split("").map((letter, index) => {
      if (index < iteration) {
        return x.dataset.value[index];
      }

      return letters[Math.floor(Math.random() * 26)]
    })
      .join("");

    if (iteration >= x.dataset.value.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 15);
}

//This part builds buttons for difficulty choices and animatees them dinamically

vplaybutton = document.getElementById('playbutton');
vdif = document.getElementById('difficulty');
vplaybutton.addEventListener('click', function () {
  vplaybutton.style.display = 'none';

  vdif.style.visibility = 'initial';
  document.getElementById('easy').classList.add('positioned');
  document.getElementById('hard').classList.add('positioned');

})
var time = false
var timerElement = document.getElementById('timer');

document.getElementById('difficulty').addEventListener('click', function (e) { //Starting the game on easy difficulty
  e.preventDefault();
  e.stopPropagation();
  if (e.target.tagName != 'BUTTON') return;

  if (e.target.id == 'medium') {
    time = new Date(0, 0, 0, 0, 0, 0, 0);
    time.setSeconds(90);
  }
  else if (e.target.id == 'hard') {
    time = new Date(0, 0, 0, 0, 0, 0, 0);
    time.setSeconds(15);
  }
  vdif.style.visibility = 'hidden'; // Hide difficulty buttons

  // Show tables
  var tables = document.getElementsByClassName('game');
  for (i of tables) i.style.visibility = 'initial';
})

//this part is for numbers 

const numbers = "123456789";
let numbersinterval = null;
var timer = "";
function endGame() {
  document.querySelectorAll("#drag-table td").forEach(td => {
    td.removeAttribute("draggable");
  });
  document.querySelectorAll("#drop-table td").forEach(td => {
    td.removeAttribute("draggable");
  });
  document.getElementById("check").setAttribute("disabled", "true");
  clearInterval(timer);
}

document.getElementById("start").addEventListener('click', (e) => {
  const table = document.getElementById("start").parentNode.firstElementChild;
  const cells = table.querySelectorAll('td');

  const digits = generateUniqueRandomDigits(1, 9, cells.length);

  cells.forEach((cell, index) => {
    cell.textContent = digits[index];
    cell.id = "drag" + index;
  });
  clearInterval(numbersinterval);
  var iteration = 0;
  numbersinterval = setInterval(() => {
    var temp = [];
    cells.forEach((cell, index) => {
      var notRand = true;
      if (index < iteration) {
        cell.textContent = digits[index];
      }
      else {
        while (notRand) {
          randIndex = Math.floor(Math.random() * 9);
          if (!temp.includes(numbers[randIndex])) notRand = false;
        }
        cell.textContent = numbers[randIndex];
        temp.push(numbers[randIndex]);
      }
    })

    if (iteration >= cells.length) {
      clearInterval(numbersinterval);
    }

    iteration += 1 / 3;
  }, 50);

  // Wait until numbers are shown to enable dragging
  setTimeout(() => {
    document.querySelectorAll("#drag-table td").forEach(td => {
      td.setAttribute("draggable", "true");
    })
  }, 1350);

  timer = setInterval(() => {
    var fmtTime = time.getMinutes() + ((time.getSeconds() < 10) ? ':0' : ':') + time.getSeconds();

    // Stop when out of time
    if (time.getSeconds() == 0 && time.getMinutes() == 0) {
      clearInterval(timer);
      endGame();
      document.querySelector(".welcome .word").textContent = "You Ran Out of Time!";
    }
    //console.log(fmtTime); 
    timerElement.innerHTML = "TIME<br>" + fmtTime; // Add time to page

    if (time.getSeconds() == 5 && time.getMinutes() == 0) { // Initiate low time mode
      timerElement.style.color = "red";
    }


    time.setSeconds(time.getSeconds() - 1);
  }, 1000);
  if (time) timerElement.style.display = "inherit";
  e.target.setAttribute("disabled", true);
})

function generateUniqueRandomDigits(min, max, count) {
  const digits = [];
  const allDigits = numbers.split('');

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allDigits.length);
    digits.push(allDigits[randomIndex]);
    allDigits.splice(randomIndex, 1);
  }

  return digits;
}

document.getElementById("drag-table").addEventListener("dragstart", function (e) {
  e.dataTransfer.setData("text", e.target.id);
})
document.getElementById("drop-table").addEventListener("dragstart", function (e) {
  e.dataTransfer.setData("text", e.target.id);
})
document.getElementById("drop-table").addEventListener("dragover", function (e) {
  e.preventDefault();
})
document.getElementById("drop-table").addEventListener("dragenter", function (e) {
  e.preventDefault();
})
document.getElementById("drop-table").addEventListener("drop", function (e) {
  e.preventDefault();
  if (e.target.tagName != "TD") return;
  draggedId = e.dataTransfer.getData("text");
  draggedElement = document.getElementById(draggedId);
  if (e.target.textContent) { // Swap if non-empty target
    [e.target.textContent, draggedElement.textContent] = [draggedElement.textContent, e.target.textContent];
  }
  else { // Normal case
    e.target.textContent = draggedElement.textContent;
    draggedElement.textContent = "";
    e.target.setAttribute("draggable", "true");
  }
})

var isCorrect = true;
var isDone = true;
var mistakes = 0;
document.getElementById("check").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelectorAll("#drop-table td").forEach(td => {
    if (td.textContent == "") {
      isDone = false;
    }
  })
  if (isDone) {
    document.querySelectorAll("#drop-table td").forEach(td => {
      if (td.textContent != Number(td.id.charAt(4)) + 1) {
        isCorrect = false;
        mistakes++;
      }
    })
    message = document.querySelector(".welcome .word");
    if (isCorrect) {
      message.textContent = "You Win! Well Done!";
      message.style.color = "green";
    }
    else {
      message.textContent = "You Lose!\n" + mistakes + " Mistakes";
      message.style.color = "red";
    }
    timerElement.style.opacity = 0;
    endGame();
  }
});