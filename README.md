# Bare minimum Korean chess Janggi engine
Play blue: https://maksimkorzh.github.io/bmcp-janngi/bmcp_janggi.html <br>
Play red: https://maksimkorzh.github.io/bmcp-janngi/bmcp_janggi.html?color=red

## Piece encoding
```txt
  /*******************************************\
    =========================================
              PIECE COLOR ENCOIDING
    =========================================
      
      Blue = 0 
      Red = 16

    =========================================
               PIECE TYPE ENCODING
    =========================================
    
      emSq,  P+, P-, K,  A,  N,  B,  C,  R
         0,  1,  2,  3,  4,  5,  6,  7,  8
     
    =========================================
                 PIECE ENCODING
    =========================================
    
     bP : P+| b = 1     0001 | 0000 = 0001
     bA : K | b = 3     0011 | 0000 = 0011
     bK : A | b = 4     0100 | 0000 = 0100
     bB : N | b = 5     0101 | 0000 = 0101
     bN : B | b = 6     0110 | 0000 = 0110
     bC : C | b = 7     0111 | 0000 = 0111
     bR : R | b = 8     1000 | 0000 = 1000
    
     rP : P-| r = 18   00010 | 10000 = 10010
     rA : K | r = 19   00011 | 10000 = 10011
     rK : A | r = 20   00100 | 10000 = 10100
     rB : N | r = 21   00101 | 10000 = 10101
     rN : B | r = 22   00110 | 10000 = 10110
     rC : C | r = 23   00111 | 10000 = 10111
     rR : R | r = 24   01000 | 10000 = 11000

  \*******************************************/
```

## Ending the game
<https://en.wikipedia.org/wiki/Janggi#Ending-the-game>
```text
In Western chess, stalemate is achieved when no legal moves are possible. However, the stalemate is not a draw in janggi. The player must pass their turn when no legal moves are possible. If neither player can move legally, or if neither player can win because neither player has enough pieces, the game ends in a draw.
```
