/** Relative values to evaluate the material score of the position */
const PIECE_WEIGHTS = [
  //   bP      bK     bA    bN    bB    bC    bR
  0,   30, 0, 6000,  120,  270,  120,  285,  600,
  
  //   rP      rK     rA    rN    rB    rC    rR
      -30,   -6000, -120, -270, -120, -285, -600
];

/** Piece-square table */
const PST = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -5, -5,  0,  1,  5,  1,  0, -5, -5, -1,
  -1,  5,  0,  0, 10,  1, 10,  0,  0,  5, -1,
  -1,  0,  0, 10,  0,  5,  0, 10,  0,  0, -1,
  -1,  0,  0, -5,  0,  0,  0, -5,  0,  0, -1,
  -1,  0, 15,  0, 20,  5, 20,  0, 15,  0, -1,
  -1,  0, 15,  0, 20,  5, 20,  0, 15,  0, -1,
  -1,  0,  0, -5,  0,  0,  0, -5,  0,  0, -1,
  -1,  5,  0, 10,  0,  5,  0, 10,  0,  5, -1,
  -1,  5,  0,  0, 10,  1, 10,  0,  0,  5, -1,
  -1, -5, -5,  0,  1,  5,  1,  0, -5, -5, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

/** piece move offsets */
const MOVE_OFFSETS = [
  [],                                           // index placeholder
  [-11,   1,  -1, -10, -12],                    // red pawns
  [ 11,   1,  -1,  10,  12],                    // black pawns
  [-11,  11,   1,  -1, -10, -12,  10,  12],     // kings
  [-11,  11,   1,  -1, -10, -12,  10,  12],     // advisors
  [-21, -23, -13,  -9,  21,  23,  13,   9],     // knights
  [-31, -35, -19, -25,  31,  35,  19,  25],     // bishops
  [-11, 11, 1, -1, -10, -12,  10,  12],         // cannons
  [-11, 11, 1, -1, -10, -12,  10,  12]          // rooks
];

// 9/4k4/9/9/9/9/3P1P3/9/4K4/R8 w - - 1 0
/** palace zones */
const PALACE_ZONES = [
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  2,  1,  2,  0,  0,  0,  0,
  0,  0,  0,  0,  1,  2,  1,  0,  0,  0,  0,
  0,  0,  0,  0,  2,  1,  2,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  2,  1,  2,  0,  0,  0,  0,
  0,  0,  0,  0,  1,  2,  1,  0,  0,  0,  0,
  0,  0,  0,  0,  2,  1,  2,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
];

// see https://en.wikipedia.org/wiki/Janggi
/** Black pawn (Soldier)    */ const bP = 1;
/** Black king (General)    */ const bA = 3;
/** Black guard             */ const bK = 4;
/** Black bishop (Elephant) */ const bB = 5;
/** Black knight (Horse)    */ const bN = 6;
/** Black canon             */ const bC = 7;
/** Black rook (Chariot)    */ const bR = 8;

/** Red pawn (Soldier)    */ const rP = 18;
/** Red king (General)    */ const rA = 19;
/** Red guard             */ const rK = 20;
/** Red bishop (Elephant) */ const rB = 21;
/** Red knight (Horse)    */ const rN = 22;
/** Red canon             */ const rC = 23;
/** Red rook (Chariot)    */ const rR = 24;

/** 11x14 mailbox, contains pieces `bP, bA, ...`, empty squares `0` and outer squares `-1` */
var board = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, rR, rB, rN, rK,  0, rK, rN, rB, rR, -1,
  -1,  0,  0,  0,  0, rA,  0,  0,  0,  0, -1,
  -1,  0, rC,  0,  0,  0,  0,  0, rC,  0, -1,
  -1, rP,  0, rP,  0, rP,  0, rP,  0, rP, -1,
  -1,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1,
  -1,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1,
  -1, bP,  0, bP,  0, bP,  0, bP,  0, bP, -1,
  -1,  0, bC,  0,  0,  0,  0,  0, bC,  0, -1,
  -1,  0,  0,  0,  0, bA,  0,  0,  0,  0, -1,
  -1, bR, bB, bN, bK,  0, bK, bN, bB, bR, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

/** @type {0 | 16} side to move: can be `0b 0000 0000` or `0b 0001 0000` */
var sideToMove = 0;

/**
 * board orientation 
 * @type {0 | 1}
 */
var flip = 0;

/** to store the best move found in search */
var bestSourceSquare;

/** to store the best move found in search */
var bestTargetSquare;

/** pseudo legal moves for validation and highlighting */
var pseudoLegalMoves = [];

/** variable to check click-on-piece state */
var clickLock = false;

/** user input variable */
var userSourceSquare;

/** user input variable */
var userTargetSquare;

/** default search depth */
var searchDepth = 5;

/** search ply */
var ply = 0;

/******************************\
 ==============================

              ENGINE

  ==============================
\******************************/

/**
 * Search board position for the best move
 * @param {0 | 16} sideToMove can be `0b 0000 0000` or `0b 0001 0000`
 * @param {number} alpha the minimum score that the maximizing player is assured of
 * @param {number} beta the maximum score that the minimizing player is assured of
 * @param {number} depth maximum depth of the search
 * 
 * if `depth == 0` then we in leaf node and using static evalution of score
 * @param {boolean} validate flag used to validate moves
 */
function search(sideToMove, alpha, beta, depth, validate) {
  // we are in the leaf node
  if (depth == 0) {
    // static evaluation score
    let score = 0;

    // loop over board squares
    for (var square = 0; square < 154; square++) {
      // make sure square is on board
      if (board[square] != -1) {
        // init piece
        let piece = board[square]
        
        // make sure square contains a piece
        if (piece) {
          // calculate material score
          score += PIECE_WEIGHTS[(piece & 16 ? (piece & 15) + 7 : piece)];
          
          // calculate positional score
          (piece & 16) ? (score -= PST[square]) : (score += PST[square]);
        }
      }
    }

    // return positive score for red and negative for black
    return (sideToMove == 16) ? -score: score;
  }

  var oldAlpha = alpha;       // needed to check whether to store best move or not
  /** temporary best from square */ var tempBestSourceSquare;
  /** temporary best to square */   var tempBestTargetSquare;
  /** score of the position */
  var score = -10000;         // minus infinity

  // move generator variables
  var sourceSquare, targetSquare, capturedSquare, capturedPiece;
  var piece, pieceType, directions, stepVector;
  
  // loop over board squares
  for (var square = 0; square < 154; square++) {
    // make sure that square is on board
    if (board[square] != -1) {
      // init source square
      sourceSquare = square
    
      // init piece to move
      piece = board[square];

      // make sure piece belongs to the side to move
      if (piece && ((piece & 16) == sideToMove)) {
        // extract piece type
        pieceType = piece & 15;

        // init directions
        directions = MOVE_OFFSETS[pieceType];

        // loop over piece move directions
        for (let index = 0; index < directions.length; index++) {
          // init target square
          targetSquare = sourceSquare;
          
          // square count
          let squareCount = 0;
          
          // flag cannon jumping over the piece
          let jumpOver = 0;
          
          // loop over squares within a given move direction ray
          do {
            // increment square count
            squareCount++;
            
            // init next target square within move direction ray
            targetSquare += directions[index];
            
            // init captured piece
            capturedSquare = targetSquare;
            
            // drop sliding if hit the edge of the board
            if(board[targetSquare] == -1) break;
            
            // init captured piece
            capturedPiece = board[capturedSquare];

            // break if captured own piece
            if (capturedPiece && ((capturedPiece & 16) == sideToMove) && pieceType != 7) break;
            
            // diagonal moves in palace for pawns, cannons & rooks
            if ((pieceType < 3 && index > 2) || (pieceType > 6 && index > 3))
              if (PALACE_ZONES[sourceSquare] != 2 || PALACE_ZONES[targetSquare] == 0) break;

            // rules for kings and advisors
            if (pieceType == 3 || pieceType == 4) {
              // prevent diaogonal moves pieces are not in the center or angles
              if (PALACE_ZONES[sourceSquare] != 2 && index > 3) break;
            
              // prevent king and advisors escaping the palace
              if (PALACE_ZONES[targetSquare] == 0) break;
            }

            // knight rules
            if (pieceType == 5) {
              // prevent knight from moving if blocked by a piece
              if ((directions[index] == -23 || directions[index] == -21) && board[sourceSquare - 11]) break;
              if ((directions[index] ==  23 || directions[index] == 21) && board[sourceSquare + 11]) break;
              if ((directions[index] == -13 || directions[index] == 9) && board[sourceSquare - 1]) break;
              if ((directions[index] ==  13 || directions[index] == -9) && board[sourceSquare + 1]) break;
            }

            // bishop rules
            if (pieceType == 6) {
              // prevent bishop from moving if blocked by a first piece
              if ((directions[index] == -31 || directions[index] == -35) && board[sourceSquare - 11]) break;
              if ((directions[index] ==  31 || directions[index] ==  35) && board[sourceSquare + 11]) break;
              if ((directions[index] == -25 || directions[index] ==  19) && board[sourceSquare - 1]) break;
              if ((directions[index] == -19 || directions[index] ==  25) && board[sourceSquare + 1]) break;
              
              // prevent bishop from moving if blocked by a second piece
              if (directions[index] == -31 && board[sourceSquare - 21]) break;
              if (directions[index] == -35 && board[sourceSquare - 23]) break;
              if (directions[index] ==  31 && board[sourceSquare + 21]) break;
              if (directions[index] ==  35 && board[sourceSquare + 23]) break;
              if (directions[index] == -25 && board[sourceSquare - 13]) break;
              if (directions[index] ==  25 && board[sourceSquare + 13]) break;
              if (directions[index] ==  19 && board[sourceSquare +  9]) break;
              if (directions[index] == -19 && board[sourceSquare -  9]) break;
            }
            
            // cannon rules
            if (jumpOver == 0) {
              // cannon "jumps" over the piece
              if (pieceType == 7) {
                // prevent cannons from moving without jumping
                if (capturedPiece == 0) continue;
                
                // prevent cannons from jumping over cannons
                if ((capturedPiece & 15) == 7) break;

                // allow cannon moving further along the attack ray
                capturedPiece = 0;
                
                // set "jump" over flag
                jumpOver++; // after this jumpOver == 1
                
                continue;
              }
            }
            
            // prevent cannon from capturing own piece (special case)
            if (capturedPiece && pieceType == 7 && ((capturedPiece & 16) == sideToMove)) break;
            
            // prevent cannons from capturing cannons
            if (pieceType == 7 && (capturedPiece & 15) == 7) break;
            
            // return mating score if king has been captured
            if((capturedPiece & 15) == 3) return 10000 - ply; // mate in "ply"
            
            // validate moves
            if (validate) pseudoLegalMoves.push([sourceSquare, targetSquare]);
            
            // make move
            board[capturedSquare] = 0;       // clear captured square
            board[sourceSquare] = 0;         // clear source square (from square where piece was)
            board[targetSquare] = piece;     // put piece to destination square (to square)

            // recursive negamax search call
            ply++
            score = -search(16 - sideToMove, -beta, -alpha, depth - 1);
            ply--;
            
            // take back
            board[targetSquare] = 0;                   // clear the destination square (to square)
            board[sourceSquare] = piece;               // put the piece back to it's original square
            board[capturedSquare] = capturedPiece;     // restore captured piece on source square
            
            //Needed to detect checkmate
            bestSourceSquare = sourceSquare;
            bestTargetSquare = targetSquare;
            
            // Found better move (PV node)
            if(score > alpha) {
              // move is good enough to drop the branch (fail-high node)
              if(score >= beta) return beta;
              
              // update alpha value
              alpha = score;

              // save best move in given branch
              tempBestSourceSquare = sourceSquare;
              tempBestTargetSquare = targetSquare;
            } 
            
            // fake capture for non-slider PIECES
            capturedPiece += pieceType < 7;
          }
          
          // condition to break out of loop over squares for non-slider PIECES
          while(capturedPiece == 0);
        }
      }
    }
  }
  
  // associate best score with best move
  if(alpha != oldAlpha) {
      bestSourceSquare = tempBestSourceSquare;
      bestTargetSquare = tempBestTargetSquare;
  }

  // didn't find a better move (fail-low node)
  return alpha;
}

/******************************\
 ==============================

              GUI

  ==============================
\******************************/

/**
 * Handle user input
 * @param {number} sq - id of `<div>` element that represents square of the board
 */
function makeUserMove(sq) {
  // convert div ID to square index
  var clickSquare = parseInt(sq, 10)
  
  // if user clicks on source square 
  if(!clickLock && board[clickSquare]) {
    // remove previous highlighting
    for (let square = 0; square < 154; square++)
      if (board[square] != -1)
        document.getElementById(square).classList.remove('highlight');
    
    // highlight current square
    document.getElementById(clickSquare).classList.add('highlight');
  
    // reset move list
    pseudoLegalMoves = [];
    
    // validate moves
    search(sideToMove, -10000, 10000, 1, true);
    
    // highlight pseudo legal moves
    for (let moveIndex = 0; moveIndex < pseudoLegalMoves.length; moveIndex++)
      if (clickSquare == pseudoLegalMoves[moveIndex][0])
          document.getElementById(pseudoLegalMoves[moveIndex][1]).classList.add('highlight');

    // init user source square
    userSourceSquare = clickSquare;
    
    // lock click
    clickLock ^= 1;
  }
  
  // if user clicks on destination square
  else if(clickLock) {
    // deep copy board position
    let boardCopy = JSON.stringify(board);

    // extract row and column from target square
    var col = userSourceSquare & 7;
    var row = userSourceSquare >> 4;
    
    // move user piece
    board[clickSquare] = board[userSourceSquare];
    board[userSourceSquare] = 0;
    
    // if pawn promotion
    if(((board[clickSquare] == 9) && (clickSquare >= 0 && clickSquare <= 7)) ||
        ((board[clickSquare] == rP) && (clickSquare >= 112 && clickSquare <= 119)))
        board[clickSquare] |= 7;    // convert pawn to corresponding sideToMove's queen
    
    // change sideToMove
    sideToMove = 16 - sideToMove;
    
    // unlock click
    clickLock ^= 1;
    
    // legality checking
    if (clickSquare == userSourceSquare ||
        document.getElementById(clickSquare).classList.value != 'highlight' ||
        search(sideToMove, -10000, 10000, 2) == Math.abs(10000)) {
      takeUserMoveBack(boardCopy);
      return;
    }
    
    // update position
    drawBoard();
    
    // highlight last move
    document.getElementById(clickSquare).classList.add('highlight');
    
    // make computer move in response
    setTimeout(function() { makeEngineMove(searchDepth) }, 100);
  }
}

/**
 * take user move back if illegal
 * @param {string} boardCopy strigified copy of board state
 */
function takeUserMoveBack(boardCopy) {
  // restore board position
  board = JSON.parse(boardCopy);
  
  // change sideToMove
  sideToMove = 16 - sideToMove;
  
  // remove previous highlighting
  for (let square = 0; square < 154; square++)
    if (board[square] != -1)
      document.getElementById(square).classList.remove('highlight');    
}

/**
 * Handle engine output
 * @param {number} depth - maximum depth of the search
 */
function makeEngineMove(depth) {
  // search position
  var score = search(sideToMove, -10000, 10000, depth);

  // Black checkmate detection
  if(score <= -9999) {
    // update board view
    drawBoard();
    
    // highlight king square
    for (let square = 0; square < 154; square++)
      if (board[square] == 19)
        document.getElementById(square).classList.add('mate');
    
    // no more moves to make
    return;
  }
  
  // move engine piece
  board[bestTargetSquare] = board[bestSourceSquare];
  board[bestSourceSquare] = 0;
  
  // change sideToMove
  sideToMove = 16 - sideToMove;
  
  // red checkmate detection
  if(score >= 9998) {
    // update board view
    drawBoard();
    
    // highlight last move
    document.getElementById(bestTargetSquare).classList.add('highlight');
    
    // highlight king square
    for (let square = 0; square < 154; square++)
      if (board[square] == 3)
        document.getElementById(square).classList.add('mate');
    
    // no more moves to make
    return;
  }
      
  else {
    // update board view
    drawBoard();
    
    // highlight last move
    document.getElementById(bestTargetSquare).classList.add('highlight');
  }  
}

/** Update board view */
function drawBoard() {
  // create HTML table tag (disable text selection, adjust mouse pointer)
  var xiangqiBoard = `<table align="center"
                        cellspacing="2"
            style="background-image: url('${GRAPHICS.board}');
                  background-repeat: no-repeat;
                    background-size: cover;
                  -moz-user-select: none;
                -webkit-user-select: none;
                    -ms-user-select: none;
                        user-select: none;
                    -o-user-select: none;
                            border: 10px solid #996633;"
                      unselectable="on"
                      onselectstart="return false;"
                        onmousedown="return false;"`;

  // loop over board rows
  for (var row = 0; row < 14; row++) {     
    // create table row
    xiangqiBoard += '<tr>'
    
    // loop over board columns
    for (var col = 0; col < 11; col++) {
      let file, rank;
    
      // flip board
      if (flip) {
        file = 11 - 1 - col;
        rank = 14 - 1 - row;
      } else {
        file = col;
        rank = row;
      }

      // init square
      var square = rank * 11 + file;
      
      // init piece
      let piece = board[square];
      
      // make sure square is on board
      if (board[square] != -1)
        // create table cell
        xiangqiBoard += '<td align="center" id="' + square + 
                        '" width="57" height="57" style="font-size: 30px;"' +
                        ' onclick="makeUserMove(this.id)">' +
                        (piece ? ('<img width="54" src="' + GRAPHICS.pieces[(piece & 16 ? (piece & 15) + 7 : piece)] + '">') : '') +
                        '</td>';
    }
    
    // close table row tag
    xiangqiBoard += '</tr>';
  }
  
  // close div tag
  xiangqiBoard += '</table>';
  
  // render chess board to screen
  document.getElementById('board').innerHTML = xiangqiBoard;
};

// parse & init search depth
if (window.location.href.includes('searchDepth'))
  searchDepth = parseInt(window.location.href.split('searchDepth=')[1].split('&')[0])

// parse & init side color
if (window.location.href.includes('color')) {
  if (window.location.href.split('color=')[1].split('&')[0] == 'red') {
    flip = 1;
    
    setTimeout(function() {
      makeEngineMove(searchDepth);
    }, 1000);
  }
}

// initially render board view
drawBoard();
