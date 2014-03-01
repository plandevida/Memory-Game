MemoryGame.estados = new Array("bocaabajo", "bocaarriba", "encontrada");

function MemoryGame(gs) {

	this.sprites = new Array("8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin");
	var cartas = new Array();
	this.estado = "";
	this.gs = gs;
	this.contadorCartasLevantadas = 0;
	this.contadorDeCartasComparandose = 0;
	// Representa la carta actualmente levantada
	// que será comparada con la siguiente pulsada
	this.cartaComparada = null;

	this.initGame = function() {

		for ( var a = 0; a < 16; a++) {
			cartas[a] = null;
		}

		this.estado = "Memory Game";

		var cont = 0;
		var spriteIndex = 0;

		while ( spriteIndex < 8 ) {
			var i = Math.floor(Math.random() * 16);

			if ( i in cartas && cartas[i] == null ) {
				
				cartas[i] = new Card(this.sprites[spriteIndex], MemoryGame.estados[0], i);

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

		var self = this;

		setInterval(function() { self.draw(); }, 16);
	};

	this.onClick = function(cardId) {

		var carta = cartas[cardId];
		var firstCard = true;
		var matchFound = false;

		if ( this.contadorDeCartasComparandose < 2 && carta.estadoSprite == MemoryGame.estados[0]) {
			carta.flip();

			this.contadorDeCartasComparandose++;

			if ( this.cartaComparada == null) {
				this.cartaComparada = carta;
			}
			else {
				firstCard = false;

				if ( carta.comprateTo(this.cartaComparada) ) {

					matchFound = true;
				}
			}

			if ( matchFound ) {

				carta.found();
				this.cartaComparada.found();
				this.contadorDeCartasComparandose = 0;
				this.contadorCartasLevantadas += 2;
				this.cartaComparada = null;
				this.estado = "Match found";
			}
			else if ( firstCard == false && carta.estadoSprite == MemoryGame.estados[1]) {

				var self = this;

				setTimeout(function() {
					carta.flip();
					self.contadorDeCartasComparandose--;

					self.cartaComparada.flip();
					self.contadorDeCartasComparandose--;

					self.cartaComparada = null;

					self.estado = "Try again";
				}, 1000);
			}

			if ( this.contadorCartasLevantadas == 16) {
				this.estado = "You Win";
			}
		}
		
	};

	var Card = function(nombreSprite, estadoSprite, pos) {

		this.nombreSprite = nombreSprite;
		this.estadoSprite = estadoSprite;

		this.flip = function() {
			// solo se cambia el estado de la carta
			// cuando no ha sido encontrada ya
			if ( this.estadoSprite != MemoryGame.estados[2] ) {

				// si estaba boca abajo se pone boca arriba
				if ( this.estadoSprite == MemoryGame.estados[0]) {
					this.estadoSprite = MemoryGame.estados[1];
				}
				// si estaba boca arriba se pone boca abajo
				else if ( this.estadoSprite == MemoryGame.estados[1]) {
					this.estadoSprite = MemoryGame.estados[0];
				}
			}
		};

		this.found = function() {
			this.estadoSprite = MemoryGame.estados[2];
		};

		this.comprateTo = function(otherCard) {
			return this.nombreSprite == otherCard.nombreSprite;
		};

		this.draw = function(gs, pos) {
			if ( this.estadoSprite == MemoryGame.estados[0]) {
				gs.draw("back", pos);
			}
			else {
				gs.draw(nombreSprite, pos);
			}
		};
	};
}
