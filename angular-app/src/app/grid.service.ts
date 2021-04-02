import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { Coord } from './types/coord';

/**
 * Grid Injectible
 */
@Injectable({
  providedIn: 'root'
})

/**
 * The class for the game grid module.
 */
export class GridService {
  /**
   * A state variable for the game grid.
   */
  grid: number[][];
  /**
   * A state variable to keep track of the current height of the game grid.
   */
  height: number;
  /**
   * A state variable to keep track of the current width of the game grid.
   */
  width: number;
  /**
   * A state variable to track where the mines on the current game grid are.
   */
  mines: Coord[];

  /**
   * Initializes the game grid as well as its number of mines, height, and width.
   * @param settings The settings from the difficulty module which include the difficulty the player selected.
   */
  constructor(private settings: SettingsService) {
    this.height = settings.numRows;
    this.width = settings.numCols;
    this.mines = [];
    this.grid = [];
    this.initializeGridWithZeros();
    this.insertMines(settings.numMines);
  }

  /**
   * A function that resets to an empty game grid with the designated height and width from the difficulty.
   */
  resetGrid() {
    this.height = this.settings.numRows;
    this.width = this.settings.numCols;
    this.mines = [];
    this.grid = [];
    this.initializeGridWithZeros();
    this.insertMines(this.settings.numMines);
  }

  /**
   * A function that initializes the game grid with zeros that will be modified with the insertion of 
   * mines and their adjacent numbered tiles.
   */
  private initializeGridWithZeros() {
    this.grid = [];
    for (let i = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(0);
      }
      this.grid.push(row);
    }
  }

  /**
   * A function to populate the game grid with mines depending on the difficulty selected by the player.
   * @param numMines The number of mines to place on the game grid based on the difficulty.
   */
  private insertMines(numMines: number) {
    let availableSquares: Coord[] = [];
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (!this.isMine({row: row, col: col})) {
          availableSquares.push({row: row, col: col});
        }
      }
    }
    for (let i = 0; i < numMines; i++) {
      let randomSquareIndex = Math.floor(Math.random() * availableSquares.length);
      let randomSquare = availableSquares[randomSquareIndex];
      this.setMine(randomSquare);
      availableSquares.splice(randomSquareIndex, 1);
    }
  }

  /**
   * A function to determine if the selected tile is a mine.
   * @param square The selected tile's coordinates on the game grid.
   * @returns True if the selected tile is a mine, false otherwise.
   */
  private isMine(square: Coord) {
    return this.grid[square.row][square.col] === -1;
  }

  /**
   * A function to set a random tile as a mine when the game board is generated.
   * @param square The designated tile coordinates where the mine will be placed.
   */
  private setMine(square: Coord) {
    this.grid[square.row][square.col] = -1;
    this.incrementSurroundingSquares(square);
  }

  /**
   * A function to modify tiles that are surrounded by a mine with the appropriate number of adjacent mines.
   * @param square The tiles that are surrounding a mine tile.
   */
  private incrementSurroundingSquares(square: Coord) {
    let surroundingSquares: Coord[] = this.getSurroundingSquares(square);
    for (let surroundingSquare of surroundingSquares) {
      if (!this.isMine(surroundingSquare)) {
        this.grid[surroundingSquare.row][surroundingSquare.col]++;
      }
    }
  }

  /**
   * A function to get the surrounding tiles' data.
   * @param square The designated coordinates to get the surrounding tiles of.
   * @returns The adjacent tiles of the specified tile.
   */
  private getSurroundingSquares(square: Coord) {
    let surroundingSquares: Coord[] = this.getAdjacentSquares(square);
    // Top-left
    if (square.row > 0 && square.col > 0) {
      surroundingSquares.push({row: square.row-1, col: square.col-1});
    }
    // Top-right
    if (square.row > 0 && square.col < this.width-1) {
      surroundingSquares.push({row: square.row-1, col: square.col+1});
    }
    // Bottom-right
    if (square.row < this.height-1 && square.col < this.width-1) {
      surroundingSquares.push({row: square.row+1, col: square.col+1});
    }
    // Bottom-left
    if (square.row < this.height-1 && square.col > 0) {
      surroundingSquares.push({row: square.row+1, col: square.col-1});
    }
    return surroundingSquares;
  }

  /**
   * A function to get the adjacent tiles to a designated tile.
   * @param square The designated tile to get the adjacent tiles of.
   * @returns A Coord array of the adjacent tiles to a specified tile.
   */
  private getAdjacentSquares(square: Coord): Coord[] {
    let adjacentSquares: Coord[] = [];
    // Top
    if (square.row > 0) {
      adjacentSquares.push({row: square.row-1, col: square.col});
    }
    // Right
    if (square.col < this.width-1) {
      adjacentSquares.push({row: square.row, col: square.col+1});
    }
    // Bottom
    if (square.row < this.height-1) {
      adjacentSquares.push({row: square.row+1, col: square.col});
    }
    // Left
    if (square.col > 0) {
      adjacentSquares.push({row: square.row, col: square.col-1});
    }
    return adjacentSquares;
  }

  /**
   * A function to return a specific coordinate in the entire coordinate array.
   * @param coord The specified coordinate that is being searched for.
   * @param coordArray The coordinate array that is being searched for the specific coordinate.
   * @returns True if the coordinate is in the coordinate array, false otherwise.
   */
  private coordInCoordArray(coord: Coord, coordArray: Coord[]): boolean {
    for (let arrayElem of coordArray) {
      if (arrayElem.row === coord.row && arrayElem.col === coord.col) {
        return true;
      }
    }
    return false;
  }

  /**
   * A function to determine if the selected tile has any adjacent mines or not.
   * @param square The designated tile's coordinates to check for no adjacent mines.
   * @returns True if there are no adjacent mines, false otherwise.
   */
  private squareIsZero(square: Coord): boolean {
    return this.grid[square.row][square.col] === 0;
  }

  /**
   * A function to uncover any adjacent tiles that do not have any adjacent mines (otherwise contain no number).
   * @param square The tile that has been selected that has no adjacent mines surrounding it
   * @param zeroGroup The group of adjacent tiles that do not have any adjacent mines.
   * @returns The full group of adjacent tiles that do not have any adjacent mines.
   */
  getZeroGroup(square: Coord, zeroGroup?: Coord[]): Coord[] {
    zeroGroup = zeroGroup || [];
    if (this.grid[square.row][square.col] !== 0) {
      return zeroGroup;
    }
    zeroGroup.push(square);
    let surroundingSquares: Coord[] = this.getSurroundingSquares(square);
    for (let surroundingSquare of surroundingSquares) {
      if (!this.coordInCoordArray(surroundingSquare, zeroGroup)) {
        if (this.squareIsZero(surroundingSquare)) {
          zeroGroup = this.getZeroGroup(surroundingSquare, zeroGroup);
        }
        else {
          zeroGroup.push(surroundingSquare);
        }
      }
    }
    return zeroGroup;
  }

  /**
   * A function to return the specified tile based on the row or column specified.
   * @param row The row the tile is located in.
   * @param col The column the tile is located in.
   * @returns The status of the specified tile (whether it contains a mine, is numbered, or unnumbered)
   */
  getValue(row: number, col: number) {
    return this.grid[row][col];
  }
}
