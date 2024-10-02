import BaseAlgorithm from "./BaseAlgorithm";
import { State } from "./shared";
import Utility from "./Utility";

export default class RandomRestart extends BaseAlgorithm {
  public static solve(
    N: number,
    maxRestart: number,
    log: boolean = false,
  ): State {
    let current: State;
    let bestState = this.initializeState(N);
    bestState.value = -Infinity;

    let restart = 0;
    while (restart <= maxRestart) {
      const n1 = Math.floor(N / 2);
      const randNumber = Utility.getRandomInt(0, 1);
      if (randNumber === 0) {
        const cube = [
          ...bestState.cube.slice(0, n1),
          ...BaseAlgorithm.initializeState(N).cube.slice(n1, N),
        ];
        current = {
          cube,
          value: BaseAlgorithm.getObjectiveValue(cube),
        };
      } else {
        const cube = [
          ...BaseAlgorithm.initializeState(N).cube.slice(0, n1),
          ...bestState.cube.slice(n1, N),
        ];
        current = {
          cube,
          value: BaseAlgorithm.getObjectiveValue(cube),
        };
      }

      current = BaseAlgorithm.initializeState(N);

      let i = 0;
      while (true) {
        i++;

        const neighbor = BaseAlgorithm.getBestSuccessor(current);

        if (current.value >= neighbor.value) {
          break;
        }

        if (i >= 30) break;

        current = neighbor;
      }

      if (current.value > bestState.value) {
        bestState = current;
      }

      restart++;
    }

    return bestState;
  }
}
