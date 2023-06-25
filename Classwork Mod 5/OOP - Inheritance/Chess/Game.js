//What is Chess?
// 2 player, turn based game
//8X8 chess board
// each player has x amount of pieces that have their own types of moves
//GOAL: position pieces in a way that the other playe cannot defend their king

//* What do we need?
//*PIECES
//each player 8 pawns, 2 rooks, 2 knights, 2 bishops, 1 queen and 1 king.

//*PAWN
//the starting row for each player (1 of 2 rows) 7 white & 7 black
// if: first move, pawn can move two spaces OR once space FORWARD, else if: not first move must move forward one space, unless the pawn is capturing a piece, in which case it can mpve one space diagnally
//CANNOT GO BACKWARDS

//*ROOK
//can mvoe vertically or horizontally across the board unless, one of our teams pieces id there or an enemie piece is there.

//*KNIGHT
//moves 2 squares over and then one square, or vice versa can jump over pieces as ong as final position is empty.

//*BISHOP
//can move diagonally in any direction from starting square, must be unblocked or must capture opponent.

//*QUEEN
//can move diagonally, vertical, horizontaly, forwards or backwards as long as there is no obstacle in the way

//*KING
//can move one step in any direction unless not obstructed or castling. if the move pute you in jeopardy of checkmate, it is not a valid move.

//*BOARD
// 8x8 chess board
// setup rules: the white queen is on white square the black qyeen is on black square, queen is left to a king -->
//white and black checker board pattern
//1-8 vertically, a-h horizontally

// is mad eup of squares, each square has information for us
//1. what color is this square
//2. location - row / column 
