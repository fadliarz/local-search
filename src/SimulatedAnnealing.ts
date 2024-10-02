import { State } from "./shared";
import BaseAlgorithm from "./BaseAlgorithm";

export default class SimulatedAnnealing {
  public static solve(initialState: State, log: boolean = false): State {
    const N = initialState.cube.length;
    let current = initialState;
    for (let t = 0; t < Infinity; t++) {
      if (log)
        console.log(`iteration: ${t + 1}, current.value: ${current.value}`);

      const T = 1000 * Math.exp(-0.005 * t);

      if (T < 0.0001) break;

      const successor = BaseAlgorithm.getBestSuccessor(current);
      const dE = successor.value - current.value;
      if (dE > 0 || Math.exp(dE / T) > 0.5) current = successor;
    }

    return current;
  }
}
