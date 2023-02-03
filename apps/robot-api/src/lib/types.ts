export enum Command {
  MoveForward = 'F',
  MoveBackwards = 'B',
  TurnLeft = 'L',
  TurnRight = 'R',
  TakeSample = 'S',
  ExtendSolarPanels = 'E',
}

export enum Facing {
  North = 'North',
  East = 'East',
  South = 'South',
  West = 'West',
}

export enum Terrain {
  Ferrum = 'Fe',
  Obstacle = 'Obs',
  Selenium = 'Se',
  Silicon = 'Si',
  Water = 'W',
  Zinc = 'Zn',
}

export enum BatteryUnits {
  Move = 3,
  Turn = 2,
  TakeSample = 8,
  Recharge = 1,
}

export type InputInstruction = {
  terrain: Terrain[][];
  commands: Command[];
  battery: number;
  initialPosition: Position;
};

export type Position = {
  location: Point;
  facing: Facing;
};

export type Point = {
  x: number;
  y: number;
};

export type RobotState = {
  batteryLeft: number;
  position: Position;
  samplesCollected: Terrain[];
  cellsVisited: Point[];
};
