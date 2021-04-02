import { Injectable } from '@angular/core';
import { Difficulty } from './types/difficulty';

/**
 * Settings Injectible
 */
@Injectable({
  providedIn: 'root'
})

/**
 * The class for the difficulty module and its logic.
 */
export class SettingsService {
  /**
   * A state variable for the number of rows in the game grid.
   */
  numRows: number;

  /**
   * A state variable for the number of columns in the game grid.
   */
  numCols: number;

  /**
   * A state variable for the number of mines in the game grid.
   */
  numMines: number;

  /**
   * A variable containing the various difficulties for the game.
   */
  difficulties: Difficulty[];

  /**
   * A state variable for the difficulty chosen by the player.
   */
  difficulty: Difficulty;

  /**
   * Initializes the difficulties array to hold the difficulties that are available in the game.
   */
  constructor() {
    this.difficulties = [
      {
        label: "Beginner",
        numRows: 10,
        numCols: 10,
        numMines: 10
      },
      {
        label: "Intermediate",
        numRows: 16,
        numCols: 16,
        numMines: 40
      },
      {
        label: "Expert",
        numRows: 30,
        numCols: 16,
        numMines: 99
      }
    ];
    this.difficulty = this.difficulties[0];
    this.numRows = this.difficulty.numRows;
    this.numCols = this.difficulty.numCols;
    this.numMines = this.difficulty.numMines;
  }

  /**
   * A function to change the difficulty of the game based on which one the player chooses.
   * @param label The difficulty that is chosen by the player.
   */
  changeDifficulty(label: string) {
    for (let difficulty of this.difficulties) {
      if (difficulty.label === label) {
        this.difficulty = difficulty;
      }
    }
    this.numRows = this.difficulty.numRows;
    this.numCols = this.difficulty.numCols;
    this.numMines = this.difficulty.numMines;
  }
}
