import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsService } from '../settings.service';
import { LoggerService } from '../logger.service';

/**
 * The Component for the difficulty module.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

/**
 * The class for displaying the difficulty module to the screen.
 */
export class SettingsComponent implements OnInit {
  /**
   * The state variable for the difficulty that the player selects.
   */
  selectedDifficulty: string;

  /**
   * The variable to store the selected difficulty as a string.
   */
  difficultyLabels: string[];

  /**
   * A state variable for toggling a new game state.
   */
  @Output() newGame = new EventEmitter<boolean>();

  /**
   * Initializes the selected difficulty to the one the player selected.
   * @param logger For getting user input.
   * @param settings The settings that the user can choose from. The settings correspond
   * to the number of mines on the board as well as the size of the board.
   */
  constructor(private logger: LoggerService, private settings: SettingsService) {
    this.selectedDifficulty = settings.difficulty.label;
    this.difficultyLabels = [];
    for (let difficulty of settings.difficulties) {
      this.difficultyLabels.push(difficulty.label);
    }
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * A function to display the specified difficulties of Beginner, Intermediate, Expert.
   * @param e The event of the buttons being displayed.
   */
  onChange(e: any) {
    this.selectedDifficulty = e.target.value;
  }

  /**
   * A function for when the player presses a difficulty button to start the game and change the difficulty.
   * @param e The event of the player pressing the button.
   */
  onSubmit(e: any) {
    this.settings.changeDifficulty(this.selectedDifficulty);
    this.newGame.emit(true);
  }

}
