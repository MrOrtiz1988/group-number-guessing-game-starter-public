const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = process.env.PORT || 5000;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}

let randomNumber = generateRandomNumber(1, 25);
const guesses = [];

console.log(randomNumber);

function calculate() {
  const differences = [];
  for (const guess of guesses) {
    const difference = {
      player1: 'winner',
      player2: 'winner'
    };
    if (Number(guess.player1) > randomNumber) {
      difference.player1 = 'too high';
    } else if (Number(guess.player1) < randomNumber) {
      difference.player1 = 'too low';
    }

    if (Number(guess.player2) > randomNumber) {
      difference.player2 = 'too high';
    } else if (Number(guess.player2) < randomNumber) {
      difference.player2 = 'too low';
    }

    differences.push(difference);
  }

  return differences;
}

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

// GET & POST Routes go here
app.post('/guess', (req, res) => {
  const guess = req.body;
  guesses.push(guess);
  console.log(guess);
  res.sendStatus(201);
});

app.get('/guess', (req, res) => {
  if (guesses.length === 0) {
    res.send('No guesses');
    return;
  }

  let winner;

  const lastGuess = guesses[guesses.length - 1];
  if (Number(lastGuess.player1) === randomNumber) {
    winner = 'Player 1 won!';
  } else if (Number(lastGuess.player2) === randomNumber) {
    winner = 'Player 2 won!';
  } else {
    winner = 'No winner';
  }

  res.send({
    winner,
    totalGuesses: guesses.length,
    guesses: guesses,
    differences: calculate()
  });
});

app.listen(PORT, () => {
  console.log (`Server is running at http://localhost:${PORT}`)
})
