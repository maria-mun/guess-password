const body = document.querySelector("body");
const main = document.querySelector(".main");
const grid = document.querySelector(".grid");
const hints = document.querySelector(".hints");
const startBtn = document.querySelector(".start-btn");
let password = document.querySelector(".password");
const resultMessage = document.querySelector(".result");
let enterDisabled = true; 

let tryNumber = document.querySelector(".try-selection").value;
let circleNumber = document.querySelector(".number-selection").value;
makeGrid(tryNumber, circleNumber);


startBtn.addEventListener ("click", () => {
    startBtn.textContent = "Заново";
    enterDisabled = false; 
    deleteGrid ();  
    resultMessage.textContent = "";
    
    tryNumber = document.querySelector(".try-selection").value;
    circleNumber = document.querySelector(".number-selection").value;
    makeGrid(tryNumber, circleNumber);

    password.textContent = generatePassword(circleNumber).join("");
    password.style.visibility = "hidden";

    focusFirstTry();
    shiftFocus();
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !enterDisabled) {         
        let passwordInput = extractPasswordInput();                                
        let password = document.querySelector(".password").textContent.split("");   
        
        let correctHint = document.querySelector(".active.correct-hint");
        correctHint.textContent = showCorrectHint(password, passwordInput);
        let containsHint = document.querySelector(".active.contains-hint");
        containsHint.textContent = showContainsHint(password, passwordInput);
        
        if (focusNextTry() === false || isEqual(password, passwordInput) === true)  {
            showResult(passwordInput);
        };  
        
        shiftFocus();
    }
});


function shiftFocus () {
    let length = document.querySelector(".password").textContent.length;
    let inputs = document.querySelectorAll('input.active');

    if (inputs[0]) {inputs[0].focus();}
       
    inputs.forEach((input) => {
        input.addEventListener('keydown', (event) => {
            let currentIndex = Array.from(inputs).indexOf(input);
            
            if (event.key === "ArrowRight") {                 
                event.preventDefault();                              
                let nextIndex = currentIndex + 1;
                if (nextIndex >= 0 && nextIndex < length) {inputs[nextIndex].focus();};
            };

            if (event.key === "ArrowLeft" ) {
                event.preventDefault();                               
                let nextIndex = currentIndex - 1;
                if (nextIndex >= 0 && nextIndex < length) {inputs[nextIndex].focus();};
            }
        });
    });
}


function isEqual (arr1, arr2) {
    for (let i=0; i<arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        };
    };  
    return true; 
};


function showCorrectHint (arr1, arr2) {
    let number = 0;
    for (let i=0; i<arr1.length; i++) {
        if (arr1[i] === arr2[i]) {number += 1}
    }
    return number;
};


function showContainsHint (arr1, arr2) {
    let number = 0;
    for (let j=0; j<arr1.length; j++) {
        if (arr2.includes(arr1[j]) && arr1[j] !== arr2[j]) {number += 1}
    }
    return number;
};


function showResult (passwordInput) {
    enterDisabled = true; 
    password.style.visibility = "visible";
    if (passwordInput.join("") == password.textContent) {
        resultMessage.textContent = "Вітаю! Ви вгадали пароль!"
        resultMessage.style.color = "darkGreen";
    } else {
        resultMessage.textContent = "На жаль, ваші спроби закінчилися!"
        resultMessage.style.color = "darkRed";
    }

    let activeCircles = document.querySelectorAll(".active");
    activeCircles.forEach(activeCircle => {
        activeCircle.setAttribute("disabled", "disabled");
        activeCircle.classList.remove("active");
    });    
}


function focusFirstTry () {    
    let childrenOfFirstTry = grid.querySelectorAll(":first-child > *");
    childrenOfFirstTry.forEach(child => {
        child.removeAttribute("disabled");
        child.classList.add("active");
    });
    
    let childrenOfFirstHint = hints.querySelectorAll(":first-child > *");
    childrenOfFirstHint.forEach(child => {
        child.classList.add("active");
    });
}


function focusNextTry () {
    let currentHintCircles = document.querySelectorAll(".hint .active");
    currentHintCircles.forEach(currentHintCircle => {
        currentHintCircle.classList.remove("active");
    });
    let currentHint = currentHintCircles[0].parentNode;
    if (currentHint.nextElementSibling !== null) {
        let nextHint = currentHint.nextElementSibling;
        let nextHintCircles = nextHint.querySelectorAll("*");
        nextHintCircles.forEach(nextHintCircle => {
            nextHintCircle.classList.add("active");
        });
    } 
    

    let currentCircles = document.querySelectorAll(".try .active");
    currentCircles.forEach(currentCircle => {
        currentCircle.setAttribute("disabled", "disabled");
        currentCircle.classList.remove("active");
    });
    let currentTry = currentCircles[0].parentNode;
    
    if (currentTry.nextElementSibling !== null) {
        let nextTry = currentTry.nextElementSibling;
        let nextCircles = nextTry.querySelectorAll("*");
        nextCircles.forEach(nextCircle => {
            nextCircle.removeAttribute("disabled");
            nextCircle.classList.add("active");
        });
        nextCircles[0].focus();
    } else {
        enterDisabled = true; //checkBtn.setAttribute("disabled", "disabled");
        return false;
    }
};


function extractPasswordInput () {
    let numbers = document.querySelectorAll(".try .active");
    let array = [];
    numbers.forEach(number => {
        array.push(number.value);
    })
    return array;
};


function generatePassword (circleNumber) {
    let password = [];
    while (password.length < circleNumber) {
        let randomNumber = Math.floor(Math.random()*10);
        if (!password.includes(randomNumber)) {password.push(randomNumber)}; 
    };
    return password;
};


function deleteGrid() {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    while (hints.firstChild) {
        hints.removeChild(hints.firstChild);
    }
};


function makeGrid () {
    for (let i=0; i<tryNumber; i++) {
        let tRy = document.createElement("div");
        tRy.classList.add("try");
        for (let j=0; j<circleNumber; j++) {
            let circle = document.createElement("input");
            circle.classList.add("circle");
            circle.setAttribute("type", "text");
            circle.setAttribute("disabled", "disabled");
            circle.setAttribute("maxlength", "1");
            tRy.appendChild(circle);
        }
        grid.appendChild(tRy);
    };

    for (let a=0; a<tryNumber; a++) {
        let hint = document.createElement("div");
        hint.classList.add("hint");

        let correctHint = document.createElement("div");
        correctHint.classList.add("correct-hint", "circle");
        correctHint.style.backgroundColor = "lightgreen";         

        let containsHint = document.createElement("div");
        containsHint.classList.add("contains-hint", "circle");
        containsHint.style.backgroundColor = "gold";             

        hint.appendChild(correctHint);
        hint.appendChild(containsHint);
        hints.appendChild(hint);
    }
};