var Square = function(x,y){
	this.xCoord = x;
	this.yCoord = y;
	this.mine = false;
	this.adjacentMines = 0;
	this.revealed = false;
};

var Board = function(length, width){
	this.xRange = length;
	this.yRange = width;
	this.grid = [];
	this.minesToMark = 0;
};

Board.prototype.initializeBoard = function(){  
	this.minesToMark = 0;	
	for(var i = 0; i < this.xRange; i++){
		this.grid.push([]);
		for(var j = 0; j < this.yRange; j++){
			var square = new Square(i,j);
			this.grid[i].push(square);
		}
	}
};

Board.prototype.insertMines = function() {
	for(var i = 0; i < this.xRange; i++){
		for(var j = 0; j < this.yRange; j++){
			if(Math.random() < 0.10){
				this.grid[i][j].mine = true;
				this.minesToMark++;
			}
		}
	} 
};

Board.prototype.determineAdjacentMines = function(){
	for(var i = 0; i < this.xRange; i++){
		for(var j = 0; j < this.yRange; j++){
			this.grid[i][j].adjacentMines = this.getNumberOfMines(i, j);
		}
	}
};

Board.prototype.getNumberOfMines = function(xPos, yPos){
	return this.getMine( xPos - 1, yPos - 1)
		+ this.getMine(xPos, yPos - 1)
		+ this.getMine(xPos + 1, yPos - 1)
		+ this.getMine(xPos - 1, yPos)
		+ this.getMine(xPos + 1, yPos)
		+ this.getMine(xPos - 1, yPos + 1)
		+ this.getMine(xPos, yPos + 1)
		+ this.getMine(xPos + 1, yPos + 1);
};

Board.prototype.getMine = function(xPos, yPos){
	if(xPos < 0 || xPos >= this.xRange || yPos < 0 || yPos >= this.yRange){
		return 0;
	}
	return this.grid[xPos][yPos].mine ? 1 : 0;
};

var game = {
	startGame: function() {
		this.board = new Board(10,10);
		this.board.initializeBoard();
		this.board.insertMines();
		this.board.determineAdjacentMines();
		this.writeMineLabel();
		this.writeBoardWithButtons();
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

	writeBoardWithButtons: function(){
		var board = document.createElement("table");
		board.id = "board";
		board.setAttribute("style", "border: 1px solid black;");

		for(var i = 0; i < this.board.xRange; i++){
			var row = document.createElement("tr");

			for(var j = 0; j < this.board.yRange; j++){
				var cell = document.createElement("td");

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
		if(xCoord >= 0 && xCoord < this.board.xRange && yCoord >= 0 && yCoord < this.board.yRange){
			var clickedButton = document.getElementById("row" + xCoord + "col" + yCoord);
			var cell = this.board.grid[xCoord][yCoord];

			if(clickedButton.className === "marked-square"){
				this.markAsDefault(xCoord, yCoord);
				this.board.minesToMark++;	
			}

			if(cell.revealed) return;
			cell.revealed = true;

			if(cell.mine){
				clickedButton.innerHTML = "X";
				clickedButton.setAttribute("class", "mine-square");

				for(var i = 0; i < this.board.xRange; i++){
					for(var j = 0; j < this.board.yRange; j++){
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
		if(this.board.grid[xCoord][yCoord].revealed) return;
		if(this.board.minesToMark === 0) return;

		var squareToMark = document.getElementById("row" + xCoord + "col" + yCoord);
		squareToMark.setAttribute("class", "marked-square");
		//todo: research/ask on SO: why must I call setAttribute for onclick with a blank string instead of just setting it to null?
		//ex: squareToMark.setAttribute = null;
		squareToMark.setAttribute("onclick", "");
		squareToMark.setAttribute("oncontextmenu", "game.markAsDefault(" + xCoord + ", " + yCoord + "); return false;");
		this.board.minesToMark--;
		this.updateMinesLeft();
		this.checkForWinCondition();
	},

	markAsDefault: function(xCoord, yCoord){
		if(this.board.grid[xCoord][yCoord].revealed) return;

		var squareToMark = document.getElementById("row" + xCoord + "col" + yCoord);
		squareToMark.setAttribute("class", "unmarked-square");
		squareToMark.setAttribute("onclick", "game.reveal(" + xCoord + ", " + yCoord + ");");
		squareToMark.setAttribute("oncontextmenu", "game.markAsMine(" + xCoord + ", " + yCoord + "); return false;");

		this.board.minesToMark++;
		this.updateMinesLeft();
	},

	checkForWinCondition: function(){
		var win = true;
		for(var i = 0; i < this.board.xRange; i++){
			for(var j = 0; j < this.board.yRange; j++){
				var squareToInspect = document.getElementById("row" + i + "col" + j);
				if(this.board.grid[i][j].mine && squareToInspect.className !== "marked-square"){
					win = false;
				}
			}
		}

		if(win){
			var minesLeftLabel = document.getElementById("minesLeftText");
			minesLeftText.innerHTML = "YOU WIN!!"; 

			var minesLeft = document.getElementById("minesLeft");
			minesLeft.innerHTML = "";

			for(var i = 0; i < this.board.xRange; i++){
				for(var j = 0; j < this.board.yRange; j++){
					if(this.board.grid[i][j].mine){
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
		minesLeft.innerHTML = this.board.minesToMark;
		document.body.appendChild(minesLeft);
	},

	updateMinesLeft: function() {
		var minesLeft = document.getElementById("minesLeft");
		minesLeft.innerHTML = this.board.minesToMark;
	},
};

game.startGame();
