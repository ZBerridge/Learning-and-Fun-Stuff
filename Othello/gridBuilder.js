$(document).ready(function(){
	Othello = new othello_game();
	Othello.init();
});

var othello_game = function(){
	this.playerColor;
	this.oppColor;
	this.gameArray = new Array(8);
	this.playerOneScore = 0;
	this.playerTwoScore = 0;
	this.madeMove = false;
	this.justChecking;
	this.hasValid;
	this.validCount;
	this.gameOver = false;
	this.snd = new Audio("flip.wav");
	this.that = this;
}

othello_game.prototype.init = function() {
	var cur_obj = this.that;
	document.getElementById("othelloGame").innerHTML = cur_obj.drawGrid(cur_obj);
	cur_obj.addPlayerTurns(cur_obj);
	document.getElementById("scoreBoard").innerHTML = cur_obj.drawScoreBoard();
	document.getElementById("newGame").onclick = function() {cur_obj.newGame(cur_obj);};
	cur_obj.gridArray(cur_obj);
	cur_obj.playerColor = "white";
	cur_obj.refreshGrid(cur_obj);
}

othello_game.prototype.gridArray = function(cur_obj) {
	// creates game board's array.  
	for (var i = 0; i <cur_obj.gameArray.length; i++) {
		cur_obj.gameArray[i] = new Array(8);
	}
	
	for (var row = 0; row < cur_obj.gameArray.length; row++) {
		for (var col = 0; col < cur_obj.gameArray[row].length; col++) {
			cur_obj.gameArray[row][col] = "green";
		}
	}
}

othello_game.prototype.drawGrid = function(cur_obj){
	// writes table, returns a large string that is, in essence, the gameboard table
	var htmlString = "<table id='othelloGrid'><tr>";
		for (var i = 0; i < 8; i++) {
			htmlString += "<th>" + i + "</th>";
		}
		htmlString += "</tr>";
		for (var j = 0; j < 8; j++) {
			htmlString += "<tr>";
				for (var x = 0; x < 8; x++) {
					htmlString += "<td></td>";
				}
			htmlString += "</tr>";
		}
	htmlString += "</table>";
	
	return htmlString;
}

othello_game.prototype.addPlayerTurns = function(cur_obj){
	//var grid = document.getElementById("othelloGrid");
	var x = 0;
	var y = 0;

	$("#othelloGrid td").each(function(){
		var i = x;
		var j = y;
			$(this).click(function(){
				cur_obj.playerTurn(i, j, cur_obj);
			});
			y++;
			if (y == 8){
				y = 0;
				x++;
				if (x == 8){
					x = 0;
				}
			}
	});
}

othello_game.prototype.refreshGrid = function(cur_obj) {
	// passes through table, matching class of each 'td' element to value of corresponding position in 
	// gameArray.
	var table = document.getElementById("othelloGrid");
	cur_obj.playerOneScore = 0;
	cur_obj.playerTwoScore = 0;
	for (var i = 0, row; row = table.rows[i + 1]; i++){
		for (var j = 0, col; col = row.cells[j]; j++){
			col.className = cur_obj.gameArray[i][j];
			if (cur_obj.gameArray[i][j] == "white") {
				cur_obj.playerOneScore++;
			}
			else if (cur_obj.gameArray[i][j] == "black") {
				cur_obj.playerTwoScore++;
			}
		}
	}	

	document.getElementById("player1").innerHTML = cur_obj.playerOneScore;
	document.getElementById("player2").innerHTML = cur_obj.playerTwoScore;
	document.getElementById("skipTurn").innerHTML = cur_obj.playerColor;
	document.getElementById("skipTurn").className = cur_obj.playerColor;
	
	if ((cur_obj.playerOneScore + cur_obj.playerTwoScore == 64) || (cur_obj.validCount == 2)) {
		cur_obj.gameOver = true;
		cur_obj.declareWinner(cur_obj);
	}
}

othello_game.prototype.newGame = function(cur_obj) {
	// intializes game board, setting colors for game start
	cur_obj.gridArray(cur_obj);
	cur_obj.initGameVariables(cur_obj);
	cur_obj.gameArray[3][3] = "white";
	cur_obj.gameArray[3][4] = "black";
	cur_obj.gameArray[4][3] = "black";
	cur_obj.gameArray[4][4] = "white";

	// sets intitial player scores (0's), sets first player to 'white' as per Othello rules
	cur_obj.refreshGrid(cur_obj);
}

othello_game.prototype.playerTurn = function(x, y, cur_obj) {
	if (cur_obj.gameArray[x][y] == "green") {
		justChecking = 0;
		xOrigin = eval("x");
		yOrigin = eval("y");
		counter = 0;
		//passes through the cardinal points of the compass to determine if the player's
		//selection results in any changes.
		cur_obj.cardinalPointCheck(x, y, xOrigin, yOrigin, counter, justChecking, cur_obj);
	}
	if ((cur_obj.madeMove) && (cur_obj.gameOver == false)){
	cur_obj.nextTurn(cur_obj);
	}

}


othello_game.prototype.validateMove = function(x, y, xMove, yMove, xOrigin, yOrigin, counter, justChecking, cur_obj){
// validateMove takes current coordinates in the array (x, y), the direction indicators (xMove, yMove)
// and retains the initial position in xOrigin and yOrigin, used in fillMove.
	var xCo = eval("x + xMove");
	var yCo = eval("y + yMove");
		if ((xCo <= 7) && (xCo >= 0)) {
			if ((yCo <= 7) && (yCo >= 0)) {
				if (cur_obj.gameArray[xCo][yCo] == cur_obj.oppColor) {
					//counter is necessary so fillMove is not called simply by having the player's
					//selection be next to his/her own color.  
					counter = counter +1;
					cur_obj.validateMove(xCo, yCo, xMove, yMove, xOrigin, yOrigin, counter, justChecking, cur_obj);
				}
				else if ((cur_obj.gameArray[xCo][yCo] == cur_obj.playerColor) && (counter != 0)) {
					if (justChecking == 0){
						cur_obj.fillMove(xOrigin, yOrigin, xCo, yCo, xMove, yMove, cur_obj);
					}
					else if (justChecking == 1) {
						cur_obj.hasValid = 1;
						cur_obj.validCount = 0;
					}
				}
			}
		}
}

othello_game.prototype.fillMove = function(xO, yO, xF, yF, xMove, yMove, cur_obj){
// 'flips' tiles from starting position (xO, yO) to the final position (xF, yF), using
// the direction indicated by xMove and yMove.
	while((xO != xF) || (yO != yF)){
		
		cur_obj.gameArray[xO][yO] = cur_obj.playerColor;
		cur_obj.snd.play();
		xO = xO + xMove;
		yO = yO + yMove;
		cur_obj.madeMove = true;
	}
}

othello_game.prototype.nextTurn = function(cur_obj) {
// swaps player color
	if (cur_obj.playerColor == "white") {
		cur_obj.playerColor = "black";
		cur_obj.oppColor = "white";
	}
	else {
		cur_obj.playerColor = "white";
		cur_obj.oppColor = "black";
	}
// intializes relevant variables for new turn, redraws grid with potential changed values.
	cur_obj.hasValid = 0;
	cur_obj.madeMove = false;
	cur_obj.refreshGrid(cur_obj);
	cur_obj.checkForMoves(cur_obj);

}

othello_game.prototype.drawScoreBoard = function() {
	var htmlString = "<table id='scoreKeep'><tr>";
		htmlString += "<th>White</th>";
		htmlString += "<th>Black</th>";
		htmlString += "</tr>";
		htmlString += "<tr><td id = 'player1'></td>";
		htmlString += "<td id = 'player2'></td></tr>";
		htmlString += "</table>";	
	return htmlString;
}

othello_game.prototype.declareWinner = function(cur_obj) {
	if (cur_obj.playerOneScore == cur_obj.playerTwoScore) {
		alert("I'm not even sure a tie can happen..." + "\n" + cur_obj.playerOneScore + " to " + cur_obj.playerTwoScore);
		cur_obj.newGame(cur_obj);
	}
	if (cur_obj.playerOneScore > cur_obj.playerTwoScore) {
		alert("White wins!" + "\n" + cur_obj.playerOneScore + " to " + cur_obj.playerTwoScore);
		cur_obj.newGame(cur_obj);
	}
	if (cur_obj.playerTwoScore > cur_obj.playerOneScore) {
		alert("Black wins!" + "\n" + cur_obj.playerTwoScore + " to " + cur_obj.playerOneScore);
		cur_obj.newGame(cur_obj);
	}
}

othello_game.prototype.checkForMoves = function(cur_obj) {
	justChecking = 1;
	for (var x = 0; x < cur_obj.gameArray.length; x++){
		for (var y = 0; y < cur_obj.gameArray[x].length; y++){
			if ((cur_obj.gameArray[x][y] == "green") && (cur_obj.hasValid == 0)){

			xOrigin = eval("x + 0");
			yOrigin = eval("y + 0");
			counter = 0;
			//passes through the cardinal points of the compass to determine if the player's
			//selection results in any changes.
			cur_obj.cardinalPointCheck(x, y, xOrigin, yOrigin, counter, justChecking, cur_obj);
			}
			
		}
	}
	if (cur_obj.hasValid == 0) {
		var outputString = cur_obj.capitalizeFirstLetter(cur_obj.playerColor);
		alert(outputString + " has no moves.");
		cur_obj.validCount++;
		if (cur_obj.gameOver == false) {
			cur_obj.nextTurn(cur_obj);
		}
	}
}

othello_game.prototype.initGameVariables = function(cur_obj) {
	cur_obj.playerOneScore = 0;
	cur_obj.playerTwoScore = 0;
	cur_obj.validCount = 0;
	cur_obj.gameOver = false;
	cur_obj.playerColor = "white";
	cur_obj.oppColor = "black";
}

othello_game.prototype.cardinalPointCheck = function(x, y, xOrigin, yOrigin, counter, justChecking, cur_obj) {
	// re-usable bit of code, keeping things as separate as possible.  Used to check for
	// valid moves, and when a player clicks a tile.
		cur_obj.validateMove(x,y,1,0, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,1,-1, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,0,-1, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,-1,-1, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,-1,0, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,-1,1, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,0,1, xOrigin, yOrigin, counter, justChecking, cur_obj);
		cur_obj.validateMove(x,y,1,1, xOrigin, yOrigin, counter, justChecking, cur_obj);
}

othello_game.prototype.capitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}