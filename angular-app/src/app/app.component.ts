import { Component } from '@angular/core';
import { LoggerService } from './logger.service';

/**
 * Component for the base application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {
    '(document:keydown)': 'onKeyDown($event)'
  }
})

/**
 * AppComponent class to render a new game or determine if a game is over and to update the
 * application accordingly.
 */
export class AppComponent {
  /**
   * A variable storing the title of the application's webpage.
   */
  title = 'Minesweeper Ultimate';

  /**
   * A state variable to store the state of the game. A game is not started by default.
   */
  newGameTriggered: boolean = false;

  /**
   * A state variable to store if a game is stopped or not. A game is not stopped by default.
   */
  gameStopped = false;

  /**
   * A state variable to store if a game is over or not. A game is not over by default.
   */
  gameOver = false;

  gameWin = false;

  gamePaused = false;

  /**
   * @ignore
   */
  constructor(private logger: LoggerService) {}

  /**
   * A function to start new game when the event is triggered by the user selecting a tile.
   * @param e The event of the user selecting a tile.
   */
  startNewGame(e: boolean) {
    if (e === true) {
      this.newGameTriggered = true;
      this.gameStopped = false;
      this.gameOver = false;
      this.gameWin = false;
      this.logger.log("set gameStopped, gameOver to false.");
    }
  }

  /**
   * A function to render a new game grid.
   * @param e The event to trigger a new game.
   */
  onNewGameRender(e: boolean) {
    if (e === true) {
      this.newGameTriggered = false;
    }
  }

  /**
   * A function to stop the game if the user uncovers all mines or discovers a mine.
   * @param e The event that triggered the game to stop (uncovering all mines or a mine)
   */
  onGameOverTriggered(e: boolean) {
    this.gameStopped = true;
    this.gameOver = true;
    this.logger.log("set gameStopped, gameOver to true.");
  }

  onGameWinTriggered(e: boolean) {
    this.gameStopped = true;
    this.gameWin = true;
    this.logger.log("set gameStopped, gameWin to true.");
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === "p" && !this.gameOver) {
      this.gamePaused = !this.gamePaused;
      this.gameStopped = !this.gameStopped;
    }
  }
}
