/*
 * Create a list that holds all of your cards
 *
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var revealedCards = [];
var moves = 0;
var disabledCards = false;
var timerId;

function revealCard(card) {
    card.addClass("open show");
    revealedCards.push(card);
    if (revealedCards.length % 2 == 0) {
        testMatch();
        moves++;
        updateMoves();
    }
}

function concealCards() {
    revealedCards.splice(-2, 2).forEach(function (card) {
        card.removeClass("open show");
    });
}

function resetGame() {
    stopTimer();
    $(".card").removeClass("match");
    moves = 0;
    updateMoves();
    while (revealedCards.length > 0) {
        concealCards();
    }
    updateTimer(0);
    shuffleCards();
}

function shuffleCards() {
    var cards = $(".card");
    var cards = shuffle(cards);
    $(".deck").html(cards);
}

function startTimer() {
    stopTimer();
    var startTime = new Date();
    timerId = setInterval(function () {
        var currentTime = new Date();
        var elapsedTime = currentTime - startTime;
        updateTimer(elapsedTime);
    });
}

function updateTimer(elapsedTime) {
    var minutes = Math.floor(elapsedTime / 60000);
    var seconds = Math.floor((elapsedTime % 60000) / 1000);
    var miliseconds = elapsedTime % 1000;
    var formattedTimer = minutes + ":" + seconds + ":" + miliseconds;
    $(".timer-output").text(formattedTimer);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = undefined;
}

function winGame() {
    stopTimer();
    window.setTimeout(function () {
        var restart = confirm("You win! Do you want to play again.");
        if (restart) {
            resetGame();
        }
    });
}

function updateMoves() {
    $( ".moves" ).text(moves);
    updateStars();
}

function updateStars() {
    var stars;
    if (moves <= 8) {
        stars = 3;
    } else if (moves <= 15) {
        stars = 2;
    } else {
        stars = 1;
    }
    $(".stars").html("");
    for (var i = 0; i < 3; i++) {
        if (i+1 > stars) {
            $(".stars").append('<li><i class="fa fa-star-o"></i></li>');
        } else {
            $(".stars").append('<li><i class="fa fa-star"></i></li>');
        }
    }
}

function confirmMatch() {
    var lastCards = revealedCards.slice(-2);
    lastCards.forEach(function (card) {
        card.removeClass("open show");
        card.addClass("match");
    });
}

function testMatch() {
    var lastCard = revealedCards[revealedCards.length - 1];
    var penultimateCard = revealedCards[revealedCards.length - 2];
    if (lastCard.find("i").attr("class") === penultimateCard.find("i").attr("class")){
        confirmMatch();
        if (revealedCards.length === 16) {
            winGame();
        }
    } else {
        disableFlippingCards();
        window.setTimeout(function () {
            concealCards();
            enableFlippingCards();
        }, 500);
    }
}

function enableFlippingCards() {
    disabledCards = false;
}

function disableFlippingCards() {
    disabledCards = true;
}

function ensureGameStarted() {
    if (timerId === undefined) {
        startTimer(); //when first card is clicked
    }
}

$(function () {
    $(".deck").on("click", ".card", function () {
        if (disabledCards){
            return;
        }
        ensureGameStarted();
        revealCard($(this));
    });
    $(".restart").on("click", function () {
        resetGame();
    });
    resetGame();
});

