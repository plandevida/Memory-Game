
var estados = new Array("bocaabajo", "bocaarriba", "encontrada");

function MemoryGame(gs) {

	this.sprites = new Array("8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin");
	var cartas = new Array();

	for ( var a = 0; a < 16; a++) {
		cartas[a] = null;
	}

	this.estado = "";

	this.gs = gs;

	this.contadorCartasLevantadas = 0;

	this.initGame = function() {

		this.estado = "Memory Game";

		var cont = 0;
		var spriteIndex = 0;

		while ( spriteIndex < 8 ) {
			var i = Math.floor(Math.random() * 16);

			if ( i in cartas && cartas[i] == null ) {
				
				cartas[i] = new Card(
										this.sprites[spriteIndex], 
										estados[0],
										i
									);

				cont++;
				if ( cont == 2) {
					spriteIndex++;
					cont = 0;
				}
			}
		}

		this.loop();
	};

	this.draw = function() {

		// Pinta el mensaje de estado
		this.gs.drawMessage(this.estado);

		// Dibuja las cartas de juego
		for ( var i in cartas) {
			cartas[i].draw(this.gs, i);
		}
	};

	this.loop = function() {

		setInterval("game.draw()", 16);
	};

	this.onClick = function(cardId) {

		var carta = cartas[cardId];
		var firstCard = true;
		var matchFound = false;
		var cartaComparada = null;

		if ( this.contadorCartasLevantadas < 2 ) {
			carta.flip();

			this.contadorCartasLevantadas++;
			console.log("Contador " + this.contadorCartasLevantadas);

			for ( var i in cartas) {

				if ( cartas[i].position != carta.position && cartas[i].estadoSprite == estados[1] ) {

					firstCard = false;

					cartaComparada = cartas[i];

					if ( cartaComparada instanceof Card && carta.comprateTo(cartaComparada) ) {

						matchFound = true;
						break;
					}
				}
			}

			if ( matchFound ) {

				carta.found();
				cartaComparada.found();
				this.contadorCartasLevantadas = 0;
				this.estado = "Match found";
			}
			else if ( firstCard == false && carta.estadoSprite == estados[1]) {

				setTimeout(function() {
					carta.flip();
					game.contadorCartasLevantadas--;
					console.log("Contador " + game.contadorCartasLevantadas);

					cartaComparada.flip();
					game.contadorCartasLevantadas--;
					console.log("Contador " + game.contadorCartasLevantadas);

					this.estado = "Try again";
				}, 1000);
			}
		}
		
	};

	var Card = function(nombreSprite, estadoSprite, pos) {

		this.nombreSprite = nombreSprite;
		this.estadoSprite = estadoSprite;
		this.position = pos;

		this.flip = function() {
			// solo se cambia el estado de la carta
			// cuando no ha sido encontrada ya
			if ( this.estadoSprite != estados[2] ) {

				// si estaba boca abajo se pone boca arriba
				if ( this.estadoSprite == estados[0]) {
					this.estadoSprite = estados[1];
				}
				// si estaba boca arriba se pone boca abajo
				else if ( this.estadoSprite == estados[1]) {
					this.estadoSprite = estados[0];
				}
			}
		};

		this.found = function() {
			this.estadoSprite = estados[2];
		};

		this.comprateTo = function(otherCard) {
			return this.nombreSprite == otherCard.nombreSprite;
		};

		this.draw = function(gs, pos) {
			if ( this.estadoSprite == estados[0]) {
				gs.draw("back", pos);
			}
			else {
				gs.draw(nombreSprite, pos);
			}
		};
	};
}
