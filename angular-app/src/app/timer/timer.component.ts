import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { LoggerService } from '../logger.service';

/**
 * The component for the timer module.
 */
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

/**
 * The class for the timer module of the application.
 * Starts when the player starts the game and stops when the user loses or wins the game.
 */
export class TimerComponent implements OnInit {
  /**
   * The state variable that the timer uses for incrementing the timer.
   */
  time = "000";

  /**
   * The state variable that the component uses for only allowing one timer to exist at once.
   */
  timerLockFree = false;

  /**
   * The state variable that the component uses for determining if the timer needs to start or not.
   */
  @Input() paused = false;

  @Input() gameWin = false;

  @Input() totalMines = "0";


  /**
   * @ignore
   */
  constructor(private logger: LoggerService, private gridComp: GridComponent) { 
    this.totalMines = "0" + GridComponent.totalMines.toString();

  }

  
  /**
   * Initializes the timer component for when the application starts.
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.timerLockFree = true;
      this.incrementTimer();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.paused.currentValue === false && changes.paused.previousValue === true && this.timerLockFree) {
      this.timerLockFree = false;
      setTimeout(() => {
        this.timerLockFree = true;
        this.incrementTimer();
      }, 1000);
    }
  }

  /**
   * Increments the timer and updates the string as necessary if single, double, or
   * triple digits in the time are reached.
   */
  incrementTimer() {
    if (this.paused || this.gameWin) {
      return;
    }
    if (!this.timerLockFree) {
      return;
    }
    this.timerLockFree = false;
    let timeAsNum = parseInt(this.time);
    timeAsNum++;
    let timeAsString = timeAsNum.toString();
    if (timeAsString.length === 1) {
      this.time = "00" + timeAsString;
    }
    else if (timeAsString.length === 2) {
      this.time = "0" + timeAsString;
    }
    else if (timeAsString.length === 3) {
      this.time = timeAsString;
    }
    else if (this.time = "999") {
      this.time = "999";
    }
    setTimeout(() => {
      this.timerLockFree = true;
      this.incrementTimer();
    }, 1000);
    if (GridComponent.totalMines < 10 && GridComponent.totalMines > -10)
      this.totalMines = "00" + GridComponent.totalMines.toString();
    else
      this.totalMines = "0" + GridComponent.totalMines.toString();
    this.logger.log(GridComponent.totalMines);
  }

  /**
   * On the start of a new game, the timer will reset back to zero.
   */
  @Input()
  set resetTimer(e: boolean) {
    this.time = "000";
    this.totalMines = "0" + GridComponent.totalMines.toString();
  }
}
