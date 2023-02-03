import { log } from 'console';
import { getCommandHandler } from './handlers';
import { Command, RobotState, Terrain } from './types';

/**
 * Runs a sequence of commands with the given starting state 
 * on the given terrain map
 */
export class Simulator {
  private readonly _terrain: Terrain[][];

  constructor(terrain: Terrain[][]) {
    this._terrain = terrain;
  }

  /**
   * 
   * Run the commands starting with the given initial state
   * @param state - initial state of the robot
   * @param commands - a sequence of commands to run
   * @returns 
   */
  public run(state: RobotState, commands: Command[]): RobotState {
    // reverse so we treat it like a stack
    commands.reverse();
    while (commands.length > 0) {
      const command = commands.pop();
      const handler = getCommandHandler(command);

      handler(state, this._terrain);

      const terrain: Terrain =
        this._terrain[state.position.location.y][state.position.location.x];

      log(
        `New location: {${state.position.location.x}, ${state.position.location.y}} Facing ${state.position.facing} Terrain ${terrain} `
      );
    }

    return state;
  }
}
