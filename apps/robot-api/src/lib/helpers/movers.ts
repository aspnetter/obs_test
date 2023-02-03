/**
 * Calculates new coordinates of the next move
 *
 * @param currentX - current position, X
 * @param currentY - current position, Y
 * @param facing - current facing direction
 * @param forward - if currently moving forward
 * @returns
 */
export const calculateNewLocation = function (
  currentX: number,
  currentY: number,
  facing: string,
  forward: boolean
) {
  const result = {
    x: currentX,
    y: currentY,
  };

  const increment = forward ? 1 : -1;

  switch (facing) {
    case 'North':
      result.y -= increment;
      break;
    case 'South':
      result.y += increment;
      break;
    case 'East':
      result.x += increment;
      break;
    case 'West':
      result.x -= increment;
      break;
    default:
      break;
  }

  return result;
};

/**
 * Calculates new direction of the next move
 *
 * @param currentFacing - current facing direction
 * @param facingOptions - available facing directions
 * @param clockWise - true if turning right, false if turning left
 * @returns next facing direction
 */
export const calculateNewFacing = function (
  currentFacing: string,
  facingOptions: string[],
  clockWise: boolean
): string {
  let newIndex = 0;

  const increment = clockWise ? 1 : -1;
  const currentIndex = facingOptions.indexOf(currentFacing);

  if (currentIndex != -1) {
    newIndex = currentIndex + increment;

    if (newIndex == facingOptions.length) {
      newIndex = 0;
    }
    if (newIndex == -1) {
      newIndex = facingOptions.length - 1;
    }
  }

  return facingOptions[newIndex];
};
