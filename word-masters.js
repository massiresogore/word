var letters = document.querySelectorAll('.scoreboard-letter');
var lodingBar = document.querySelector('.info-bar');
var ANSWER_LENGH = 5;
var done = false;

async function init(){
    let currentGuess = '';
    let currentRow = 0;

    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj =  await res.json();
    const word = resObj.word.toUpperCase();
    const wordPlas = word.split("");
    setLoadind(false);

    console.log(word);

    function addLetter(letter){
        if(currentGuess.length < ANSWER_LENGH){
            currentGuess += letter;
        }else{
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }

        letters[ANSWER_LENGH * currentRow + currentGuess.length -1].innerText = letter;
    }

    async function commit(){
        if(currentGuess.length != ANSWER_LENGH){
            // Do nothing
            return;
        }

        if(currentGuess=== word){
            //win 
            done = true;
            alert('You win!');
            return;
        };

        const guesPart = currentGuess.split(""); 
        const map = makeMap(wordPlas);
        console.log(map);

        for(let i =0; i < ANSWER_LENGH; i++){
            //corect number
            if(guesPart[i] === wordPlas[i]){
                letters[currentRow * ANSWER_LENGH + i].classList.add("correct");
                map[guesPart[i]]--;
            }
        }
        
        for(let i = 0; i < ANSWER_LENGH; i++){
            if(guesPart[i] === wordPlas[i]){
                //Do something
            }else if(wordPlas.includes(guesPart[i] && map[guesPart[i] > 0])){
                //mark as close
                letters[currentRow * ANSWER_LENGH + i].classList.add("close");
                map[guesPart[i]]--;
            }else{
                letters[currentRow * ANSWER_LENGH + i].classList.add("wrong");

            }
        }
        currentRow++;
        currentGuess = '';
    }

    function backspace(){
        currentGuess = currentGuess.substring(0, currentGuess.length -1)
        letters[ANSWER_LENGH * currentRow + currentGuess.length].innerText = '';
    }

    document.addEventListener('keydown',function handleKeyPress(event){
        const action = event.key;


        if(action === 'Enter'){
            commit();
        }else if(action === 'Backspace'){
            backspace();
        }else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }else{
            //do nothing
        };
    });
}
function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}

function setLoadind(isLoading){
    console.log(isLoading);
    lodingBar.classList.toggle('hidden', !isLoading);
}

function makeMap(array){
    const objt = {};
    
    for(let i = 0; i < array.length; i++){
        const letter = array[i];
       if(objt[letter]){
        objt[letter]++
       }else{
        objt[letter]= 1;
       }
    }

    return objt;
}

init();
