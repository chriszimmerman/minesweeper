var square = {
    xCoord: 0,
    yCoord: 0,
    mine: false,
    adjacentMines: 0
};

var printBoard = function(board){
	for(var i = 0; i < board.length; i++){
		var line = "";
        for(var j = 0; j < board[i].length; j++){
			if(board[i][j].mine){
                line = line.concat("X ");
			}
			else if(board[i][j].adjacentMines === 0){
				line = line.concat(". ");
			}
            else{
                line = line.concat(board[i][j].adjacentMines + " ");
            }
		}
		console.log(line);
	}
    console.log();
};

//create squares with xy coords
// randomly make squares mines
// determine how many mines are adjacent
// wire underlying model to view
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

var foo = init();
var boardWithMines = insertMines(foo);
printBoard(boardWithMines);
var boardWithValues = determineAdjacentMines(boardWithMines);
printBoard(boardWithValues);

var swapButtonWithLabel = function(xCoord, yCoord){
	var clickedButton = document.getElementById("row" + xCoord + "col" + yCoord);
	clickedButton.innerHTML = boardWithValues[xCoord][yCoord].adjacentMines;
};

var writeBoardWithButtons = function(boardValues){

	var board = document.createElement("table");
	board.id = "board";
	board.setAttribute("style", "border: 1px solid black;");

	for(var i = 0; i < xRange; i++){
		var row = document.createElement("tr");

		for(var j = 0; j < yRange; j++){
			var square = document.createElement("td");
			square.setAttribute("style", "height: 20px; width: 20px;");

			var squareButton = document.createElement("label");
			squareButton.id = "row" + i + "col" + j;
			squareButton.setAttribute("style", "display: block; text-align: center; background-color: lightgray; height: 20px; width: 20px; border: 1px solid black;");
			squareButton.setAttribute("onclick", "swapButtonWithLabel(" + i + ", " + j + ")");
			square.appendChild(squareButton);
			row.appendChild(square);
		}
		board.appendChild(row);
	}

	document.body.appendChild(board);
};

writeBoardWithButtons(boardWithValues);
