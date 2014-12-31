var game = {
	xRange: 10,
	yRange: 10,
	boardWithValues: [],
	minesToMark: 0,

	startGame: function() {
		var blankBoard = this.initializeBoard();
		var boardWithMines = this.insertMines(blankBoard);
		this.boardWithValues = this.determineAdjacentMines(boardWithMines);
		this.writeMineLabel();
		this.writeBoardWithButtons(this.boardWithValues);
	},

	endGame: function() {
		var minesLeftText = document.getElementById("minesLeftText");
		document.body.removeChild(minesLeftText);
		var minesLeft = document.getElementById("minesLeft");
		document.body.removeChild(minesLeft);
		var board = document.getElementById("board");
		document.body.removeChild(board);
	},

	restartGame: function(){
		this.endGame();
		this.startGame();
	},

	initializeBoard: function(){  
	  this.minesToMark = 0;	
	  var board = [];
	  for(var i = 0; i < this.xRange; i++){
		  board.push([]);
		  for(var j = 0; j < this.yRange; j++){
			  var square = {
				  xCoord: i,
				  yCoord: j,
				  mine: false,
				  adjacentMines: 0,
				  revealed: false
			  };
			  board[i].push(square);
		  }
	  }
	  
	  return board;
	},

	insertMines: function(board) {
		for(var i = 0; i < this.xRange; i++){
			for(var j = 0; j < this.yRange; j++){
				if(Math.random() < 0.10){
					board[i][j].mine = true;
					this.minesToMark++;
				}
			}
		} 
		return board;
	},

	determineAdjacentMines: function(board){
	  for(var i = 0; i < this.xRange; i++){
		  for(var j = 0; j < this.yRange; j++){
			  board[i][j].adjacentMines = this.getNumberOfMines(board, i, j);
		  }
	  }
	  return board;
	},

	getNumberOfMines: function(board, xPos, yPos){
		return this.getMine(board, xPos - 1, yPos - 1)
			+ this.getMine(board, xPos, yPos - 1)
			+ this.getMine(board, xPos + 1, yPos - 1)
			+ this.getMine(board, xPos - 1, yPos)
			+ this.getMine(board, xPos + 1, yPos)
			+ this.getMine(board, xPos - 1, yPos + 1)
			+ this.getMine(board, xPos, yPos + 1)
			+ this.getMine(board, xPos + 1, yPos + 1);
	},

	getMine: function(board, xPos, yPos){
		if(xPos < 0 || xPos >= this.xRange || yPos < 0 || yPos >= this.yRange){
			return 0;
		}
		return board[xPos][yPos].mine ? 1 : 0;
	},

	writeBoardWithButtons: function(boardValues){
		var board = document.createElement("table");
		board.id = "board";
		board.setAttribute("style", "border: 1px solid black;");

		for(var i = 0; i < this.xRange; i++){
			var row = document.createElement("tr");

			for(var j = 0; j < this.yRange; j++){
				var cell= document.createElement("td");

				var square = document.createElement("label");
				square.id = "row" + i + "col" + j;
				square.setAttribute("class", "unmarked-square");
				square.setAttribute("onclick", "game.reveal(" + i + ", " + j + ");");
				square.setAttribute("oncontextmenu", "game.markAsMine(" + i + ", " + j + "); return false;");
				cell.appendChild(square);
				row.appendChild(cell);
			}
			board.appendChild(row);
		}

		document.body.appendChild(board);
	},

	reveal: function(xCoord, yCoord){
		if(xCoord >= 0 && xCoord < this.xRange && yCoord >= 0 && yCoord < this.yRange){
			var clickedButton = document.getElementById("row" + xCoord + "col" + yCoord);
			var cell = this.boardWithValues[xCoord][yCoord];

			if(clickedButton.className === "marked-square"){
				this.markAsDefault(xCoord, yCoord);
				this.minesToMark++;	
			}

			if(cell.revealed) return;
			cell.revealed = true;

			if(cell.mine){
				clickedButton.innerHTML = "X";
				clickedButton.setAttribute("class", "mine-square");

				for(var i = 0; i < this.xRange; i++){
					for(var j = 0; j < this.yRange; j++){
						this.reveal(i,j);
					}
				}
			}
			else if(cell.adjacentMines > 0){
				clickedButton.innerHTML = cell.adjacentMines;
			}
			else{
				clickedButton.innerHTML = ".";
				this.reveal(xCoord, yCoord - 1);
				this.reveal(xCoord, yCoord + 1);
				this.reveal(xCoord - 1, yCoord - 1);
				this.reveal(xCoord - 1, yCoord);
				this.reveal(xCoord - 1, yCoord + 1);
				this.reveal(xCoord + 1, yCoord - 1);
				this.reveal(xCoord + 1, yCoord);
				this.reveal(xCoord + 1, yCoord + 1);
			}

			clickedButton.removeAttribute("onclick");
		}
	},

	markAsMine: function(xCoord, yCoord){
		if(this.boardWithValues[xCoord][yCoord].revealed) return;
		if(this.minesToMark === 0) return;

		var squareToMark = document.getElementById("row" + xCoord + "col" + yCoord);
		squareToMark.setAttribute("class", "marked-square");
		//todo: research/ask on SO: why must I call setAttribute for onclick with a blank string instead of just setting it to null?
		//ex: squareToMark.setAttribute = null;
		squareToMark.setAttribute("onclick", "");
		squareToMark.setAttribute("oncontextmenu", "game.markAsDefault(" + xCoord + ", " + yCoord + "); return false;");
		this.minesToMark--;
		this.updateMinesLeft();
		this.checkForWinCondition();
	},

	markAsDefault: function(xCoord, yCoord){
		if(this.boardWithValues[xCoord][yCoord].revealed) return;

		var squareToMark = document.getElementById("row" + xCoord + "col" + yCoord);
		squareToMark.setAttribute("class", "unmarked-square");
		squareToMark.setAttribute("onclick", "game.reveal(" + xCoord + ", " + yCoord + ");");
		squareToMark.setAttribute("oncontextmenu", "game.markAsMine(" + xCoord + ", " + yCoord + "); return false;");

		this.minesToMark++;
		this.updateMinesLeft();
	},

	checkForWinCondition: function(){
		var win = true;
		for(var i = 0; i < this.xRange; i++){
			for(var j = 0; j < this.yRange; j++){
				var squareToInspect = document.getElementById("row" + i + "col" + j);
				if(this.boardWithValues[i][j].mine && squareToInspect.className !== "marked-square"){
					win = false;
				}
			}
		}

		if(win){
			var minesLeftLabel = document.getElementById("minesLeftText");
			minesLeftText.innerHTML = "YOU WIN!!"; 

			var minesLeft = document.getElementById("minesLeft");
			minesLeft.innerHTML = "";

			for(var i = 0; i < this.xRange; i++){
				for(var j = 0; j < this.yRange; j++){
					if(this.boardWithValues[i][j].mine){
						var squareToInspect = document.getElementById("row" + i + "col" + j);
						squareToInspect.className = "victory-square";
					}
				}
			}
		}
	},

	writeMineLabel: function() {
		var minesLeftText = document.createElement("label");
		minesLeftText.id = "minesLeftText";
		minesLeftText.innerHTML = "Mines left to mark: ";
		document.body.appendChild(minesLeftText);

		var minesLeft = document.createElement("label");
		minesLeft.id = "minesLeft";
		minesLeft.innerHTML = this.minesToMark;
		document.body.appendChild(minesLeft);
	},

	updateMinesLeft: function() {
		var minesLeft = document.getElementById("minesLeft");
		minesLeft.innerHTML = this.minesToMark;
	},
};

game.startGame();
