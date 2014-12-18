var square = {
    xCoord: 0,
    yCoord: 0,
    mine: false,
    adjacentMines: 0
};

var xRange = 10;
var yRange = 10;

var init = function(){  
  var board = [];
  for(var i = 0; i < xRange; i++){
      board.push([]);
      for(var j = 0; j < yRange; j++){
          var square = {
              xCoord: i,
              yCoord: j,
              mine: false,
              adjacentMines: 0
          };
          board[i].push(square);
      }
  }
  
  return board;
};

var insertMines = function(board) {
    for(var i = 0; i < xRange; i++){
        for(var j = 0; j < yRange; j++){
            if(Math.random() < 0.25){
                board[i][j].mine = true;
            }
        }
    } 
    return board;
};

var determineAdjacentMines = function(board){
  for(var i = 0; i < xRange; i++){
      for(var j = 0; j < yRange; j++){
          board[i][j].adjacentMines = getNumberOfMines(board, i, j);
      }
  }
  return board;
};

var getNumberOfMines = function(board, xPos, yPos){
    return isMine(board, xPos - 1, yPos - 1)
        + isMine(board, xPos, yPos - 1)
        + isMine(board, xPos + 1, yPos - 1)
        + isMine(board, xPos - 1, yPos)
        + isMine(board, xPos + 1, yPos)
        + isMine(board, xPos - 1, yPos + 1)
        + isMine(board, xPos, yPos + 1)
        + isMine(board, xPos + 1, yPos + 1);
};

var isMine = function(board, xPos, yPos){
    if(xPos < 0 || xPos >= xRange){
        return 0;
    }
    if(yPos < 0 || yPos >= yRange){
        return 0;
    }
    return board[xPos][yPos].mine ? 1 : 0;
}

var blankBoard = init();
var boardWithMines = insertMines(blankBoard);
var boardWithValues = determineAdjacentMines(boardWithMines);

var reveal = function(xCoord, yCoord){
	var clickedButton = document.getElementById("row" + xCoord + "col" + yCoord);
	var cell = boardWithValues[xCoord][yCoord];
	clickedButton.innerHTML = cell.mine ? "X" : (cell.adjacentMines > 0 ? cell.adjacentMines : ".");
	clickedButton.removeAttribute("onclick");
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
			square.setAttribute("onclick", "reveal(" + i + ", " + j + ")");
			cell.appendChild(square);
			row.appendChild(cell);
		}
		board.appendChild(row);
	}

	document.body.appendChild(board);
};

writeBoardWithButtons(boardWithValues);
