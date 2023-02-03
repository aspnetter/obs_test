/**
 * Represent the error thrown when there's less battery than required for the operation
 */
export class BatteryError extends Error {
    readonly code = 'BatteryError';
    constructor() {
      super('Not enough battery!');
    }
  }

/**
 * Check if there's enough battery life
 *
 * @param unitsLeft - current battery units
 * @param unitsRequired - required battery units for the opeation
 */
export const checkBatteryEnoughFor = function (
  unitsLeft: number,
  unitsRequired: number
): void {
  if (unitsLeft - unitsRequired < 0) {
    throw new BatteryError();
  }
};

/**
 * Check if the new coordinates are not outside the terrain
 *
 * @param terrain - the 2D array
 * @param newX - new horizontal index
 * @param newY - new vertical index
 *
 * @returns if can be moved, the value of the new
 */
export const checkCanMove = function (
  terrain: string[][],
  newX: number,
  newY: number
) {
  const isValidLocation =
    newY >= 0 &&
    newY < terrain.length &&
    newX >= 0 &&
    newX < terrain[newY].length;

  if (!isValidLocation) {
    throw new RangeError(`Location X:${newX}, Y:${newY} is out of range - please check your instructions!`);
  }
};
