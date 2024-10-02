import { Action, Point, State } from "./shared";
import Utility from "./Utility";
import ConstraintViolation from "./ConstraintViolation";

export default class BaseAlgorithm {
  public static calculateMagicNumber(N: number): number {
    return (N * (Math.pow(N, 3) + 1)) / 2;
  }

  public static initializeState(N: number): State {
    const cube: number[][][] = [];
    const elements = Array.from({ length: Math.pow(N, 3) }, (_, i) => i + 1);
    for (let i = 0; i < N; i++) {
      cube[i] = new Array(N).fill(0).map(() =>
        new Array(N).fill(0).map(() => {
          const randomIndex = Math.floor(Math.random() * elements.length);
          const removedValue = elements.splice(randomIndex, 1)[0];

          return removedValue;
        }),
      );
    }

    return {
      cube,
      value: this.getObjectiveValue(cube),
    };
  }

  public static getNewSuccessor(state: State, action: Action): State {
    const cube = [...state.cube];
    const { p1, p2 } = action;
    const temp = cube[p1.f][p1.r][p1.c];
    cube[p1.f][p1.r][p1.c] = cube[p2.f][p2.r][p2.c];
    cube[p2.f][p2.r][p2.c] = temp;

    return {
      cube,
      value: this.getObjectiveValue(cube),
    };
  }

  public static getBestSuccessor(state: State): State {
    const N = state.cube.length;
    let bestNeighbors: State[] = [
      {
        cube: state.cube,
        value: -Infinity,
      },
    ];
    let bestWeightedValue = -Infinity;
    for (let f1 = 0; f1 < N; f1++) {
      for (let f2 = 0; f2 < N; f2++) {
        for (let r1 = 0; r1 < N; r1++) {
          for (let r2 = 0; r2 < N; r2++) {
            for (let c1 = 0; c1 < N; c1++) {
              for (let c2 = 0; c2 < N; c2++) {
                if (f1 === f2 && r1 === r2 && c1 === c2) continue;

                const p1 = { f: f1, r: r1, c: c1 };
                const p2 = {
                  f: f2,
                  r: r2,
                  c: c2,
                };

                if (!this.shouldContinue(state, p1, p2)) {
                  continue;
                }

                const successor = this.getNewSuccessor(state, { p1, p2 });
                if (successor.value > bestNeighbors[0].value) {
                  bestNeighbors = [successor];
                }

                if (successor.value === bestNeighbors[0].value) {
                  bestNeighbors.push(successor);
                }
              }
            }
          }
        }
      }
    }

    return bestNeighbors[Utility.getRandomInt(0, bestNeighbors.length - 1)];
  }

  public static getRandomSuccessor(state: State): State {
    const M = state.cube.length - 1;

    while (true) {
      const first = [
        Utility.getRandomInt(0, M),
        Utility.getRandomInt(0, M),
        Utility.getRandomInt(0, M),
      ];
      const second = [
        Utility.getRandomInt(0, M),
        Utility.getRandomInt(0, M),
        Utility.getRandomInt(0, M),
      ];

      let count = 0;
      for (let i = 0; i < 3; i++) {
        if (first[i] === second[i]) count++;
      }

      if (count < 3) {
        if (
          !this.shouldContinue(
            state,
            {
              f: first[0],
              r: first[1],
              c: first[2],
            },
            {
              f: second[0],
              r: second[1],
              c: second[2],
            },
          )
        ) {
          continue;
        }

        let cube = [...state.cube];
        const value = cube[first[0]][first[1]][first[2]];
        cube[first[0]][first[1]][first[2]] =
          cube[second[0]][second[1]][second[2]];
        cube[second[0]][second[1]][second[2]] = value;

        return {
          cube,
          value: this.getObjectiveValue(cube),
        };
      }
    }
  }

  public static shouldContinue(state: State, p1: Point, p2: Point): boolean {
    let countNotViolated = 0;

    if (
      !ConstraintViolation.isRowConstraintViolatedWithGivenPoint(state, p1) ||
      !ConstraintViolation.isRowConstraintViolatedWithGivenPoint(state, p2)
    )
      countNotViolated++;

    if (
      !ConstraintViolation.isColumnConstraintViolatedWithGivenPoint(
        state,
        p1,
      ) ||
      !ConstraintViolation.isColumnConstraintViolatedWithGivenPoint(state, p2)
    )
      countNotViolated++;

    return countNotViolated == 0;
  }

  public static getObjectiveValue(cube: number[][][]): number {
    const N = cube[0].length;
    const magicNumber = BaseAlgorithm.calculateMagicNumber(N);
    const pillars = Array.from({ length: N })
      .fill(0)
      .map(() => Array.from({ length: N }).fill(0));

    let conflict = 0;
    for (let frame of cube) {
      for (let row of frame) {
        if (row.reduce((acc, curr) => acc + curr) !== magicNumber) conflict++;
      }

      for (let i = 0; i < N; i++) {
        let sum = 0;
        for (let j = 0; j < N; j++) {
          sum += frame[j][i];
        }

        if (sum !== magicNumber) conflict++;
      }

      let firstSum = 0;
      let secondSum = 0;
      for (let i = 0; i < N; i++) {
        firstSum += frame[i][i];
        secondSum += frame[i][N - 1 - i];
      }
      if (firstSum !== magicNumber) conflict++;
      if (secondSum !== magicNumber) conflict++;

      frame.forEach((row, i) =>
        row.forEach((col, j) => {
          (pillars as number[][])[i][j] += col;
        }),
      );
    }

    for (let row of pillars) {
      for (let num of row) {
        if (num !== magicNumber) conflict++;
      }
    }

    let sum = [0, 0, 0, 0];
    for (let i = 0; i < N; i++) {
      sum[0] += cube[i][i][i];
      sum[1] += cube[i][i][N - 1 - i];
      sum[2] += cube[i][N - 1 - i][i];
      sum[3] += cube[i][N - 1 - i][N - 1 - i];
    }
    for (let num of sum) {
      if (num !== magicNumber) conflict++;
    }

    return -conflict;
  }
}
