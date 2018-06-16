/*
 * Create a list that holds all of your cards
 */


/*
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
var clicks = 0;
var disabledCards = false;

function revealCard(card) {
    card.addClass("open show");
    revealedCards.push(card);
    if (revealedCards.length % 2 == 0) {
        testMatch();
        clicks++;
        $( ".moves" ).text(clicks);
    }
}

function concealCards() {
    revealedCards.splice(-2, 2).forEach(function (card) {
        card.removeClass("open show");
    });
}

function startGame() {
    $(".card").removeClass("match");
    clicks = 0;
    $( ".moves" ).text(clicks);
    while (revealedCards.length > 0) {
        concealCards();
    }
}

function confirmMatch() {
    revealedCards.splice(-2, 2).forEach(function (card) {
        card.removeClass("open show");
        card.addClass("match");
    });
}

function testMatch() {
    var lastCard = revealedCards[revealedCards.length - 1];
    var penultimateCard = revealedCards[revealedCards.length - 2];
    if (lastCard.find("i").attr("class") === penultimateCard.find("i").attr("class")){
        confirmMatch();
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

$(function () {
    $("li.card").on("click", function () {
        if (disabledCards){
            return;
        }
        revealCard($(this));
    });
    $(".restart").on("click", function() {
        startGame();
    });
});