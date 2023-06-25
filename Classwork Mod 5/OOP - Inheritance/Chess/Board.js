
class Square {
    constructor(color, location){
        this._color = color;
        this._location = location;
        this.occupied = false; // gets a getter and setter
    };

    //GETTER FOR OCCUPIED
    isOccupied() {
        console.log(this.occupied);  //console.log is for us -- return is for the computer
        return this.occupied;
    }

    //SETTER FOR OCCUPIED
    setOccupied() {
        if (this.occupied) {
            this.occupied = false;
        } else {
            this.occupied = true;
    }
    // OTHER METHODS --
    // this.occupied = this.occupied ? false : true
    // this.occupied = !this.occupied
    }
}

// class Board {
//     constructor() {
//         return Array(8).fill().map(() => Array(8).fill(null));
//     }


// }










// class ChessPiece {
//     constructor(name, color) {
//       this.name = name;
//       this.color = color;
//     }
//   }
  
//   class ChessPlayer {
//     constructor(name, color) {
//       this.name = name;
//       this.color = color;
//     }
//   }
  
//   class ChessGame {
//     constructor(player1, player2) {
//       this.board = this.initializeBoard();
//       this.players = [player1, player2];
//       this.currentPlayer = player1;
//     }
  
//     initializeBoard() {
//       // Here you would initialize the 8x8 board and place pieces on it.
//       // This example just returns an 8x8 array filled with null values.
//       return Array(8).fill().map(() => Array(8).fill(null));
//     }
  
//     movePiece(player, fromPos, toPos) {
//       // Validate the move and update the board.
//       // For now, this method just updates the board without any validation.
//       let piece = this.board[fromPos[0]][fromPos[1]];
//       this.board[fromPos[0]][fromPos[1]] = null;
//       this.board[toPos[0]][toPos[1]] = piece;
//       this.changeTurn();
//     }
  
//     changeTurn() {
//       this.currentPlayer = this.players.find(player => player !== this.currentPlayer);
//     }
//   }
  
//   let player1 = new ChessPlayer('Alice', 'white');
//   let player2 = new ChessPlayer('Bob', 'black');
//   let game = new ChessGame(player1, player2);
  
//   game.movePiece(player1, [0, 0], [0, 1]);
  