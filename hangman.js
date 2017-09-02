// step 1: choose a random word
//create a text box in mustache for guessing a letter
//submit button/ post request for submitting guesses
//purpose of submitting the guess: decrease number of guesses left and reveal all instances of the letter & keept track of the letter they guess
//display winner or loser at the end
const fs = require('fs');


let textBox = "textBox";
let submitButton = "submitButton";


const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const express = require('express');
const session = require('express-session');

const app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({ extended: true }));

function displayUnderscores (word, wordArray) {
  for (let i=0; i < word.length; i++){
    wordArray.push('_');
}
return wordArray;
}


app.get('/', function (req, res) {
  // pick a new random word
  if (req.session.answerWord === undefined) {
    // store the array version of that random word in session
    let randomWord = words[Math.floor(Math.random() * words.length)];
    req.session.answerWord = randomWord.split("");
    // req.session.answerWord = ["t", "i", "t", "a", "n"]
    req.session.display = [];
    req.session.guessed = [];

    displayUnderscores(randomWord, req.session.display);
  }

  res.render('index', { chosenWord: req.session.display,
  });
})


app.post('/index', function (req, res) {
  for (let i=0; i < req.session.answerWord.length; i++) {
    if (req.body.guess === req.session.answerWord[i]){
      req.session.display[i] = req.body.guess;
    }
  }

  // if
  req.session.guessed.push(req.body.guess);

  // res.render('index', {})
  res.redirect('/');
});


app.listen(3000, function () {
  console.log('Successfully started express application!')
});
