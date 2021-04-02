import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { GridService } from '../grid.service';
import { SettingsService } from '../settings.service';
import { Coord } from '../types/coord';
import { LoggerService } from '../logger.service';

/**
 * The square class that contains the display properties for the game grid module.
 */
class Square {
  /**
   * A state variable containing the designated coordinate to modify or view.
   */
  coord: Coord;

  /**
   * A state variable containing the number on the tile (-1 if it is a mine).
   */
  val: number;

  /**
   * A state variable to determine if a tile has been selected or not.
   */
  hidden: boolean;

  /**
   * A state variable to determine if a tile is flagged or not.
   */
  flagged: boolean;

  /**
   * @ignore
   */
  html: string;
  logger: any;

  /**
   * Initializes the tile that has been selected by the user.
   * @param row The row that the selected tile is located in.
   * @param col The column that the selected tile is located in.
   * @param val The value that is on the selected tile (-1 if it is a mine).
   */
  constructor(row: number, col: number, val: number) {
    this.coord = {row: row, col: col};
    this.val = val;
    this.hidden = true;
    this.flagged = false;
    this.html = "";
  }

  /**
   * A function to unhide the tile that the user has selected.
   */
  unhide() {
    this.hidden = false;
    this.flagged = false;
    if (this.val !== 0) {
      this.html = this.val.toString();
    }
  }

  /**
   * A function to toggle the flag when the player right clicks a tile to either flag or unflag the file.
   */
  toggleFlag() {
    if (this.hidden) {
      this.flagged = !this.flagged;
    }
  }
}

/**
 * The Component for displaying the game grid module logic to the screen.
 */
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})


/**
 * The game grid module class for displaying the outputs to the screen.
 */
export class GridComponent implements OnInit {
  /**
   * A state variable to hold the current state of the game grid as a string.
   */
  // gridString: string;

  /**
   * A state variable to store the game grid.
   */
  squares: Square[];

  /**
   * A state variable to hold if a new game grid has been generated.
   */
  @Output() newGameRenderFinished = new EventEmitter<boolean>();

  /**
   * A state variable to determine if the game is over or not.
   */
  gameOver = false;

  correctFlags: number;

  numOfMines: number;

  numOfTiles: number;

  /**
   * A state variable to determine if the game over has been triggered or ont yet.
   */
  @Output() gameOverTriggered = new EventEmitter<boolean>();


  gameWin = false;

  @Output() gameWinTriggered = new EventEmitter<boolean>();

  /**
   * Initializes the grid string to an empty string and the squares of the game grid to an empty array.
   * @param grid The game grid module details.
   * @param settings The difficulty module details.
   * @param logger LoggerService details.
   */
  constructor(private grid: GridService, private settings: SettingsService, private logger: LoggerService) {
    this.squares = [];
    this.correctFlags = 0;
    this.numOfMines = settings.numMines;
    this.numOfTiles = settings.numRows * settings.numCols;
  }

  /**
   * A function to initialize all of the data in the game grid for displaying to the screen.
   */
  ngOnInit(): void {
    for (let row = 0; row < this.grid.height; row++) {
      for (let col = 0; col < this.grid.width; col++) {
        let square = new Square(row, col, this.grid.getValue(row, col));
        this.squares.push(square);
      }
    }
  }

  /**
   * A function to get the height of the game grid in pixels.
   * @returns the height of the game grid.
   */
  @HostBinding('style.height')
  get height(): string {
    return (20 * this.settings.numRows) + 'px';
  }

  /**
   * A function to get the width of the game grid in pixels.
   * @returns the width of the game grid.
   */
  @HostBinding('style.width')
  get width(): string {
    return (20 * this.settings.numCols) + 'px';
  }

  /**
   * A function to get the designated tile based on the coordinates on the game grid.
   * @param coord The specified coordinate that is being searched for.
   * @returns The square's coordinate on the game grid.
   */
  private getSquareWithCoord(coord: Coord): Square | undefined {
    for (let square of this.squares) {
      if (square.coord.row === coord.row && square.coord.col === coord.col) {
        return square
      }
    }
    return undefined;
  }

  /**
   * A function to deal with the user selecting a tile, whether it be flagging or uncovering a tile.
   * @param e The event of the user selecting a tile.
   * @param square The specified tile that the user has selected.
   * @returns Nothing
   */
  onMouseDown(e: MouseEvent, square: Square) {
    e.preventDefault();
    let isLeftClick: boolean = e.button === 0;
    let isRightClick: boolean = e.button === 2;
    if (this.gameOver || this.gameWin) {
      return;
    }
    else if (isLeftClick) {
      if (square.flagged)
        return;

      let anyTilesRevealed = false;
      for (let s of this.squares) { //check for any revealed tiles
        if (!s.hidden) {
          anyTilesRevealed = true;
          break;
        }
      }
      if (!anyTilesRevealed) {
        for (let i = 0; i < 50; i++) { //try to regenerate so your first click is a 0 tile
          if (square.val === 0) {
            break;
          }
          this.regenerateGrid();
          square = this.getSquareWithCoord(square.coord)!;
        }
        for (let i = 0; i < 50; i++) { //try to regenerate so your first click just isn't a mine
          if (square.val === -1) {
            this.regenerateGrid();
            square = this.getSquareWithCoord(square.coord)!;
          }
          else {
            break;
          }
        }
      }

      this.unhide(square);
    }
    else if (isRightClick) {
      square.toggleFlag();
      if (square.val == -1) {
        if (!square.flagged) {
          this.correctFlags--;
          this.logger.log(this.correctFlags + " " + this.settings.numMines);
        }
        else {
          this.correctFlags++;
          this.logger.log(this.correctFlags + " " + this.settings.numMines);
          if (this.correctFlags == this.numOfMines) {
            this.gameWin = true;
            this.gameWinTriggered.emit(true);
          }
        }
      }
    }
  }

  /**
   * A function to deal with when the user uncovers a tile.
   * @param square The specified tile that the user has selected.
   * @returns Nothing, game is over
   */
  unhide(square: Square) {
    if (square.val === 0) {
      let zeroGroup: Coord[] = this.grid.getZeroGroup(square.coord);
      for (let coord of zeroGroup) {
        this.numOfTiles--;
        this.logger.log(this.numOfTiles);
        this.getSquareWithCoord(coord)?.unhide();
      }
      if (this.numOfTiles === this.numOfMines) {
        this.gameWin = true;
        this.gameWinTriggered.emit(true);
      }
    } else {
      square.unhide();
      if (square.val === -1) {
        this.gameOver = true;
        this.gameOverTriggered.emit(true);
        for (let sq of this.squares) {
          if (sq.val === -1) {
            sq.unhide();
          }
        }
      }
      else {
        this.numOfTiles--;
        this.logger.log(this.numOfTiles);
        if (this.numOfTiles === this.numOfMines) {
          this.gameWin = true;
          this.gameWinTriggered.emit(true);
        }
      }
    }
  }

  /**
   * @ignore
   */
  onContextMenu() {
    return false;
  }

  /**
   * An input for starting a new game based on when the user first selects a tile on the game grid.
   */
  @Input()
  set newGame(e: boolean) {
    if (e) {
      this.startNewGame();
      this.newGameRenderFinished.emit(true);
      this.numOfTiles = this.settings.numRows * this.settings.numCols;
      this.correctFlags = 0;
      this.numOfMines = this.settings.numMines;
    }
  }

  /**
   * A function to start a new game and initialize the game grid for displaying to the screen.
   */
  startNewGame() {
    this.gameOver = false;
    this.gameWin = false;
    this.regenerateGrid();
  }

  /**
   * A function to initialize the game grid for displaying to the screen.
   */
  regenerateGrid() {
    this.grid.resetGrid();
    this.squares = [];
    for (let row = 0; row < this.grid.height; row++) {
      for (let col = 0; col < this.grid.width; col++) {
        let square = new Square(row, col, this.grid.getValue(row, col));
        this.squares.push(square);
      }
    }
  }
}
