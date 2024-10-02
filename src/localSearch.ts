import RandomRestart from "./RandomRestart";
import GeneticAlgorithm from "./GeneticAlgorithm";
import { State } from "./shared";
import BaseAlgorithm from "./BaseAlgorithm";
import SteepestAscent from "./SteepestAscent";
import SidewaysMove from "./SidewaysMove";
import Stochastic from "./Stochastic";
import SimulatedAnnealing from "./SimulatedAnnealing";

const N = 5;

let startTime = new Date().getTime();
const maxRestart = 1000;
const randomRestart = RandomRestart.solve(N, maxRestart).value;
let endTime = new Date().getTime();
console.log(
  `[RANDOM RESTART] with ${maxRestart} max restarts: final value = ${randomRestart} ~ [${((endTime - startTime) / 1000).toFixed(2)} seconds elapsed]`,
);

const initialState = BaseAlgorithm.initializeState(N);
console.log(`initialState.value = ${initialState.value}`);

startTime = new Date().getTime();
const steepestAscent = SteepestAscent.solve(initialState).value;
endTime = new Date().getTime();
console.log(
  `[STEEPEST ASCENT]: final value = ${steepestAscent} ~ [${((endTime - startTime) / 1000).toFixed(2)} seconds elapsed]`,
);

startTime = new Date().getTime();
const sidewaysMove = SidewaysMove.solve(initialState).value;
endTime = new Date().getTime();
console.log(
  `[SIDEWAYS MOVE]: final value = ${sidewaysMove} ~ [${((endTime - startTime) / 1000).toFixed(2)} seconds elapsed]`,
);

startTime = new Date().getTime();
const maxIteration = 1000;
const stochastic = Stochastic.solve(initialState, maxIteration).value;
endTime = new Date().getTime();
console.log(
  `[STOCHASTIC] with ${maxIteration} max iterations: final value = ${stochastic} ~ [${((endTime - startTime) / 1000).toFixed(2)} seconds elapsed]`,
);

startTime = new Date().getTime();
const simulatedAnnealing = SimulatedAnnealing.solve(initialState).value;
endTime = new Date().getTime();
console.log(
  `[SIMULATED ANNEALING]: final value = ${simulatedAnnealing} ~ [${((endTime - startTime) / 1000).toFixed(2)} seconds elapsed]`,
);

const k = 10;
const population = Array.from({ length: k }).fill(null) as State[];
for (let i = 0; i < k; i++) {
  population[i] = BaseAlgorithm.initializeState(N);
}
const geneticAlgorithm = GeneticAlgorithm.solve(
  population,
  BaseAlgorithm.getObjectiveValue.bind(BaseAlgorithm),
  5,
  15,
).value;
console.log(
  `[GENETIC ALGORITHM] with ${15} seconds elapsed time: final value = ${geneticAlgorithm}`,
);
