import { Point, State } from "./shared";
import BaseAlgorithm from "./BaseAlgorithm";

export default class ConstraintViolation {
  public static isSpaceDiagonalConstraintViolatedWithGivenPoint(
    state: State,
    p: Point,
  ): boolean {
    const N = state.cube.length;

    let sum = 0;
    if (p.f === p.r && p.r === p.c) {
      for (let i = 0; i < N; i++) {
        sum += state.cube[i][i][i];
      }
    }

    if (p.f === p.r && p.c === N - 1 - p.f) {
      for (let i = 0; i < N; i++) {
        sum += state.cube[i][i][N - 1 - i];
      }
    }

    if (p.r === N - 1 - p.f && p.c === p.f) {
      for (let i = 0; i < N; i++) {
        sum += state.cube[i][N - 1 - i][i];
      }
    }

    if (p.c === N - 1 - p.f && p.c === p.r) {
      for (let i = 0; i < N; i++) {
        sum += state.cube[i][N - 1 - i][N - 1 - i];
      }
    }

    if (sum === 0) return false;

    return sum !== BaseAlgorithm.calculateMagicNumber(state.cube.length);
  }

  public static isDiagonalConstraintViolatedWithGivenPoint(
    state: State,
    p: Point,
  ): boolean {
    const N = state.cube.length;

    if (p.r !== p.c && p.c !== N - 1 - p.r) {
      return false;
    }

    let firstSum = 0;
    let secondSum = 0;
    for (let i = 0; i < N; i++) {
      p.r === p.c ? (firstSum += state.cube[p.f][i][i]) : (firstSum = 0);
      p.c === N - 1 - p.r
        ? (secondSum += state.cube[p.f][i][N - 1 - i])
        : (secondSum = 0);
    }

    let sum = p.r === p.c ? firstSum : secondSum;

    return !(sum === BaseAlgorithm.calculateMagicNumber(state.cube.length));
  }

  public static isRowConstraintViolatedWithGivenPoint(
    state: State,
    p: Point,
  ): boolean {
    let sum = 0;
    for (let num of state.cube[p.f][p.r]) {
      sum += num;
    }

    return !(sum === BaseAlgorithm.calculateMagicNumber(state.cube.length));
  }

  public static isColumnConstraintViolatedWithGivenPoint(
    state: State,
    p: Point,
  ): boolean {
    let sum = 0;
    for (let i = 0; i < state.cube.length; i++) {
      sum += state.cube[p.f][i][p.c];
    }

    return !(sum === BaseAlgorithm.calculateMagicNumber(state.cube.length));
  }

  public static isPillarConstraintViolatedWithGivenPoint(
    state: State,
    p: Point,
  ): boolean {
    let sum = 0;
    for (let frame of state.cube) {
      sum += frame[p.r][p.c];
    }

    return !(sum === BaseAlgorithm.calculateMagicNumber(state.cube.length));
  }
}
