export default class Utility {
  public static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static isBetween(
    num: number,
    bound: { lowerBound: number; upperBound: number },
  ) {
    return num <= bound.upperBound && num >= bound.lowerBound;
  }
}
