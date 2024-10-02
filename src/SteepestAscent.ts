import BaseAlgorithm from "./BaseAlgorithm";
import { State } from "./shared";

export default class SteepestAscent extends BaseAlgorithm {
  public static solve(initialState: State, log: boolean = false): State {
    let current = initialState;
    let i = 0;
    while (true) {
      i++;

      const neighbor = BaseAlgorithm.getBestSuccessor(current);

      if (log)
        console.log(`iteration: ${i}, neighbor.value: ${neighbor.value}`);

      if (neighbor.value <= current.value) return current;

      current = neighbor;
    }
  }
}
