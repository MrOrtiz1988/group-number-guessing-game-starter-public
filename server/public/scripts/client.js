$(document).ready(handleReady);

function handleReady() {
  $('#submit-button').on('click', handleSubmit);
}

function handleSubmit(event){
  event.preventDefault();

  const player1Guess = Number($('#player1-guess').val());
  const player2Guess = Number($('#player2-guess').val());

  const guesses = {
    player1: player1Guess,
    player2: player2Guess
  }

  $('#player1-guess').val('');
  $('#player2-guess').val('');

  $.ajax({
    method: 'POST',
    url: '/guess',
    data: guesses
  }).then(response => {
    console.log('POST response:', response);

    $.ajax({
      method: 'GET',
      url: '/guess'
    }).then(response => {
      console.log('GET response:', response);
      // if player1 won or player2 won
      //    then append reset button
      //    tell server to pick new random number
      $('#result').text(response.winner);
      $('#rounds').text(response.totalGuesses);
      $('#history').empty();
      for(const index in response.guesses) {
        $('#history').append(`
        <tr>
          <td>${Number(index) + 1}</td>
          <td>${response.guesses[index].player1} ${response.differences[index].player1}</td>
          <td>${response.guesses[index].player2} ${response.differences[index].player2}</td>
        </tr>
        `)
      }

      if (
        response.differences[response.differences.length - 1].player1 === 'winner' ||
        response.differences[response.differences.length - 1].player2 === 'winner'
      ) {
        $('#reset-button').removeAttr('disabled');
      }


      // new
      // for (const [index, guess] of response.guesses.entries()) {
      //   $('#history').append(`
      //   <tr>
      //     <td>${index + 1}</td>
      //     <td>${guess.player1} ${response.difference.player1}</td>
      //     <td>${guess.player2} ${response.difference.player2}</td>
      //   </tr>
      //   `)
      // }
    });
  });
}
