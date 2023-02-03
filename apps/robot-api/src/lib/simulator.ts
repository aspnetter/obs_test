import { log } from 'console';
import { getCommandHandler } from './handlers';
import { Command, RobotState, Terrain } from './types';

export class Simulator {
  private readonly _terrain: Terrain[][];

  constructor(terrain: Terrain[][]) {
    this._terrain = terrain;
  }

  public run(state: RobotState, commands: Command[]): RobotState {
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
