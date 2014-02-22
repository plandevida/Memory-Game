function MemoryGame(gs) {

	this.sprites = new Array("8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin");
	var estados = new Array("bocaabajo", "bocaarriba", "encontrada");
	var cartas = new Array();

	for ( var a = 0; a < 16; a++) {
		cartas[a] = null;
	}

	this.estado = "";

	this.gs = gs;

	this.initGame = function() {

		this.estado = "Memory Game";

		var cont = 0;
		var spriteIndex = 0;

		while ( spriteIndex < 16 ) {
			var i = Math.floor(Math.random() * 16);

			if ( i in cartas && cartas[i] == null ) {
				
				cartas[i] = new Card(
										this.sprites[spriteIndex], 
										estados[0]
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
		for ( var i = 0; i < cartas.length; i++) {
			cartas[i].draw(this.gs, i);
		}
	};

	this.loop = function() {

	};

	this.onClick = function(cardId) {

		var carta = cartas[cardId];

		for ( var i in cartas) {
			if ( cartas[i].estadoSprite == estados[1] ) {

				var cartaComparada = cartas[i];

				if ( cartaComparada instanceof Card && carta.sprite == cartaComparada.sprite ) {

					carta.found();
					cartaComparada.found();
					this.estado = "Match found";
				}
				else {
					carta.flip();
					cartaComparada.flip();
					this.estado = "Try again";
				}
			}
		}
	};

	var Card = function(nombreSprite, estadoSprite) {

		this.nombreSprite = nombreSprite;
		this.estadoSprite = estadoSprite;

		this.flip = function() {
			// solo se cambia el estado de la carta
			// cuando no ha sido encontrada ya
			if ( estadoSprite != estados[2] ) {

				// si estaba boca abajo se pone boca arriba
				if ( estadoSprite == estados[0]) {
					this.estadoSprite = estados[1];
				}
				// si estaba boca arriba se pone boca abajo
				else if ( estadoSprite == estados[1]) {
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
			gs.draw(nombreSprite, pos);
		};
	};
}