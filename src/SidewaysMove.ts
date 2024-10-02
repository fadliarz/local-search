import BaseAlgorithm from "./BaseAlgorithm";
import { State } from "./shared";

export default class SidewaysMove extends BaseAlgorithm {
  public static solve(initialState: State, log: boolean = false): State {
    let current = initialState;
    let i = 0;

    let count = 0;
    while (count < 50) {
      i++;

      const neighbor = BaseAlgorithm.getBestSuccessor(current);

      if (log)
        console.log(`iteration: ${i}, neighbor.value: ${neighbor.value}`);

      if (neighbor.value < current.value) return current;

      if (neighbor.value === current.value) {
        count++;
      } else {
        count = 0;
      }

      current = neighbor;
    }

    return current!;
  }
}
