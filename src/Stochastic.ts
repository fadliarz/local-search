import { State } from "./shared";
import BaseAlgorithm from "./BaseAlgorithm";

export default class Stochastic {
  public static solve(
    initialState: State,
    maxIteration: number,
    log: boolean = false,
  ): State {
    let current = initialState;
    let i = 0;
    while (i <= maxIteration) {
      i++;

      const randomSuccessor = BaseAlgorithm.getRandomSuccessor(current);

      if (log)
        console.log(
          `iteration: ${i}, randomSuccessor.value: ${randomSuccessor.value}`,
        );

      if (randomSuccessor.value > current.value) current = randomSuccessor;
    }

    return current;
  }
}
