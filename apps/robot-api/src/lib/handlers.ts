import { log } from 'console';
import { calculateNewFacing, calculateNewLocation } from './helpers/movers';
import { checkBatteryEnoughFor, checkCanMove } from './helpers/validators';
import { BatteryUnits, Command, Facing, RobotState, Terrain } from './types';

const FACING_OPTIONS = [Facing.North, Facing.East, Facing.South, Facing.West];

export class ObstactleError extends Error {
  code = 'ObstactleError';
  constructor() {
    super('Obstacle on my way!');
  }
}

export type CommandHandlerFunc = (
  state: RobotState,
  terrain: Terrain[][]
) => void;

const moveForward = function (state: RobotState, terrain: Terrain[][]): void {
  log('Moving forward...');

  move(state, terrain, true);
};

const moveBackwards = function (state: RobotState, terrain: Terrain[][]): void {
  log('Moving backwards...');

  move(state, terrain, false);
};

const move = function (
  state: RobotState,
  terrain: Terrain[][],
  forward: boolean
): void {
  checkBatteryEnoughFor(state.batteryLeft, BatteryUnits.Move);

  const newLocation = calculateNewLocation(
    state.position.location.x,
    state.position.location.y,
    state.position.facing,
    forward
  );

  checkCanMove(terrain, newLocation.x, newLocation.y);
  const newSpot = terrain[newLocation.y][newLocation.x];

  state.batteryLeft -= BatteryUnits.Move;

  if (newSpot == Terrain.Obstacle) {
    throw new ObstactleError();
  }

  state.position.location = newLocation;
  state.cellsVisited.push(newLocation);
};

const turnLeft = function (state: RobotState, terrain: Terrain[][]): void {
  log('Turning left...');

  turn(state, false);
};

const turnRight = function (state: RobotState, terrain: Terrain[][]): void {
  log('Turning right...');

  turn(state, true);
};

const turn = function (state: RobotState, clockwise: boolean): void {
  checkBatteryEnoughFor(state.batteryLeft, BatteryUnits.Turn);

  state.position.facing = calculateNewFacing(
    state.position.facing,
    FACING_OPTIONS,
    clockwise
  ) as Facing;

  state.batteryLeft -= BatteryUnits.Turn;
};

const takeSample = function (state: RobotState, terrain: Terrain[][]): void {
  log('Taking sample...');
  checkBatteryEnoughFor(state.batteryLeft, BatteryUnits.TakeSample);

  const currentPoint = state.position.location;

  state.batteryLeft -= BatteryUnits.TakeSample;
  state.samplesCollected.push(terrain[currentPoint.y][currentPoint.x]);
};

const extendSolarPanel = function (
  state: RobotState,
  _terrain: Terrain[][]
): void {
  log('Recharging from solar...');

  checkBatteryEnoughFor(state.batteryLeft, BatteryUnits.Recharge);

  state.batteryLeft -= BatteryUnits.Recharge;
  state.batteryLeft += 10;
};

const handlers: Map<Command, CommandHandlerFunc> = new Map<
  Command,
  CommandHandlerFunc
>();

handlers.set(Command.MoveForward, moveForward);
handlers.set(Command.MoveBackwards, moveBackwards);
handlers.set(Command.TurnLeft, turnLeft);
handlers.set(Command.TurnRight, turnRight);
handlers.set(Command.TakeSample, takeSample);
handlers.set(Command.ExtendSolarPanels, extendSolarPanel);

/**
 * Gets the right handler defined for the command
 *
 * @param command
 * @returns reference to a function of a specific type
 */
export const getCommandHandler = function (
  command: Command
): CommandHandlerFunc {
  if (handlers.has(command)) {
    return handlers.get(command);
  } else {
    throw new Error(`Unknown command: ${command}!`);
  }
};
