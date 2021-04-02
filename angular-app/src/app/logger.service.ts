import { Injectable } from '@angular/core';

/**
 * Logger Injectible
 */
@Injectable({
  providedIn: 'root'
})

/**
 * LoggerService class
 */
export class LoggerService {

  /**
   * @ignore
   */
  constructor() { }

  /**
   * @ignore
   */
  log (msg: any) {
    console.log(msg);
  }
}
