var xRange = 10;
var yRange = 10;

var initializeBoard = function(){  
  var board = [];
  for(var i = 0; i < xRange; i++){
      board.push([]);
      for(var j = 0; j < yRange; j++){
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
};

var insertMines = function(board) {
    for(var i = 0; i < xRange; i++){
        for(var j = 0; j < yRange; j++){
            if(Math.random() < 0.10){
                board[i][j].mine = true;
            }
        }
    } 
    return board;
};

var determineAdjacentMines = function(board){
	var getNumberOfMines = function(board, xPos, yPos){
		var getMine = function(board, xPos, yPos){
			if(xPos < 0 || xPos >= xRange){
				return 0;
			}
			if(yPos < 0 || yPos >= yRange){
				return 0;
			}
			return board[xPos][yPos].mine ? 1 : 0;
		}

		return getMine(board, xPos - 1, yPos - 1)
			+ getMine(board, xPos, yPos - 1)
			+ getMine(board, xPos + 1, yPos - 1)
			+ getMine(board, xPos - 1, yPos)
			+ getMine(board, xPos + 1, yPos)
			+ getMine(board, xPos - 1, yPos + 1)
			+ getMine(board, xPos, yPos + 1)
			+ getMine(board, xPos + 1, yPos + 1);
	};

  for(var i = 0; i < xRange; i++){
      for(var j = 0; j < yRange; j++){
          board[i][j].adjacentMines = getNumberOfMines(board, i, j);
      }
  }
  return board;
};

var reveal = function(xCoord, yCoord){
	if(xCoord >= 0 && xCoord < xRange && yCoord >= 0 && yCoord < yRange){
		var clickedButton = document.getElementById("row" + xCoord + "col" + yCoord);
		var cell = boardWithValues[xCoord][yCoord];

		if(cell.revealed) return;
		cell.revealed = true;

		if(cell.mine){
			clickedButton.innerHTML = "X";
			clickedButton.style.backgroundColor = "red";

			for(var i = 0; i < xRange; i++){
				for(var j = 0; j < yRange; j++){
					reveal(i,j);
				}
			}
		}
		else if(cell.adjacentMines > 0){
			clickedButton.innerHTML = cell.adjacentMines;
		}
		else{
			clickedButton.innerHTML = ".";
			reveal(xCoord, yCoord - 1);
			reveal(xCoord, yCoord + 1);
			reveal(xCoord - 1, yCoord - 1);
			reveal(xCoord - 1, yCoord);
			reveal(xCoord - 1, yCoord + 1);
			reveal(xCoord + 1, yCoord - 1);
			reveal(xCoord + 1, yCoord);
			reveal(xCoord + 1, yCoord + 1);
		}
		clickedButton.removeAttribute("onclick");
	}
};

var markAsMine = function(xCoord, yCoord){
	var squareToMark = document.getElementById("row" + xCoord + "col" + yCoord);
	squareToMark.setAttribute("style", "display: block; text-align: center; background-color: yellow; height: 20px; width: 20px; border: 1px solid black;");
	squareToMark.onclick = null;
	squareToMark.setAttribute("oncontextmenu", "markAsDefault(" + xCoord + ", " + yCoord + "); return false;");
};

var markAsDefault = function(xCoord, yCoord){
	var squareToMark = document.getElementById("row" + xCoord + "col" + yCoord);
	squareToMark.setAttribute("style", "display: block; text-align: center; background-color: lightgray; height: 20px; width: 20px; border: 1px solid black;");
	squareToMark.setAttribute("onclick", "reveal(" + xCoord + ", " + yCoord + ");");
	squareToMark.setAttribute("oncontextmenu", "markAsMine(" + xCoord + ", " + yCoord + "); return false;");
};

var writeBoardWithButtons = function(boardValues){
	var board = document.createElement("table");
	board.id = "board";
	board.setAttribute("style", "border: 1px solid black;");

	for(var i = 0; i < xRange; i++){
		var row = document.createElement("tr");

		for(var j = 0; j < yRange; j++){
			var cell= document.createElement("td");
			cell.setAttribute("style", "height: 20px; width: 20px;");

			var square = document.createElement("label");
			square.id = "row" + i + "col" + j;
			square.setAttribute("style", "display: block; text-align: center; background-color: lightgray; height: 20px; width: 20px; border: 1px solid black;");
			square.setAttribute("onclick", "reveal(" + i + ", " + j + ");");
			square.setAttribute("oncontextmenu", "markAsMine(" + i + ", " + j + "); return false;");
			cell.appendChild(square);
			row.appendChild(cell);
		}
		board.appendChild(row);
	}

	document.body.appendChild(board);
};

var statGame = function(){

};

var blankBoard = initializeBoard();
var boardWithMines = insertMines(blankBoard);
var boardWithValues = determineAdjacentMines(boardWithMines);
writeBoardWithButtons(boardWithValues);
