import { Child, Parent, State } from "./shared";
import Utility from "./Utility";

export default class GeneticAlgorithm {
  public static selectParents(population: State[]): Parent[] {
    let totalFitnessValue = 0;
    for (let unit of population) {
      totalFitnessValue += unit.value;
    }
    const modified: Array<{
      state: State;
      distribution: { lowerBound: number; upperBound: number };
    }> = [
      {
        state: population[0],
        distribution: {
          lowerBound: 0,
          upperBound:
            Number((population[0].value / totalFitnessValue).toFixed(2)) * 100,
        },
      },
    ];

    for (let i = 1; i < population.length; i++) {
      modified[i] = {
        state: population[i],
        distribution: {
          lowerBound: modified[i - 1].distribution.upperBound,
          upperBound:
            modified[i - 1].distribution.upperBound +
            Number((population[i].value / totalFitnessValue).toFixed(2)) * 100,
        },
      };
    }

    const parents: { first: State; second: State }[] = [];
    for (let i = 0; i < population.length / 2; i++) {
      const randomNumbers = [
        Utility.getRandomInt(0, 100),
        Utility.getRandomInt(0, 100),
      ];
      const parent: Parent = { first: null as any, second: null as any };

      let count = 0;
      for (let unit of modified) {
        if (count === 2) break;

        if (Utility.isBetween(randomNumbers[0], unit.distribution)) {
          if (parent.first === null) {
            parent.first = unit.state;
            count++;
          }
        }

        if (Utility.isBetween(randomNumbers[1], unit.distribution)) {
          if (parent.second === null) {
            parent.second = unit.state;
            count++;
          }
        }
      }

      if (count !== 2) {
        throw new Error("count is not 2");
      }

      parents.push(parent);
    }

    return parents;
  }

  public static crossOver(
    parent: Parent,
    fitnessFn: (cube: State["cube"]) => number,
    length: number,
  ): Child {
    const N = parent.first.cube.length;
    const totalElements = Math.pow(N, 3);

    const start = Utility.getRandomInt(1, totalElements - length + 1);
    const elements = Array.from({ length }, (_, i) => start + i);

    const cube1 = [...parent.first.cube];
    const cube2 = [...parent.second.cube];
    for (let num of elements) {
      let f: number;
      let r: number;
      let c: number;

      if (num % Math.pow(N, 2) === 0) {
        f = num / Math.pow(N, 2) - 1;
        r = N - 1;
        c = N - 1;
      } else {
        f = Math.floor(num / Math.pow(N, 2));
        num = num % Math.pow(N, 2);
        r = Math.floor(num / N);
        num = num % N;
        c = r;
      }

      const temp = cube1[f][r][c];
      cube1[f][r][c] = cube2[f][r][c];
      cube2[f][r][c] = temp;
    }

    return {
      first: {
        cube: cube1,
        value: fitnessFn(cube1),
      },
      second: {
        cube: cube2,
        value: fitnessFn(cube2),
      },
    };
  }

  public static mutate(child: Child): void {
    const N = child.first.cube.length;

    const f = Utility.getRandomInt(0, N - 1);
    const r = Utility.getRandomInt(0, N - 1);
    const c = Utility.getRandomInt(0, N - 1);

    const temp = child.first.cube[f][r][c];
    child.first.cube[f][r][c] = child.second.cube[f][r][c];
    child.second.cube[f][r][c] = temp;
  }

  public static solve(
    initialPopulation: State[],
    fitnessFn: (cube: State["cube"]) => number,
    elapsedTimeInSeconds: number,
    length: number,
  ): State {
    let population = initialPopulation;
    const k = population.length;
    let bestState: State = {
      cube: null as any,
      value: -Infinity,
    };
    if (k % 2 !== 0) throw new Error("initial population must be even!");

    const start = new Date().getTime();
    let i = 0;
    while ((new Date().getTime() - start) / 1000 < elapsedTimeInSeconds) {
      i++;
      const newPopulation = [];
      for (let parent of this.selectParents(population)) {
        const child = this.crossOver(parent, fitnessFn, length);
        this.mutate(child);
        newPopulation.push(...[child.first, child.second]);
      }
      population = [...newPopulation];

      const best = population.sort((a, b) => b.value - a.value)[0];
      if (best.value > bestState.value) {
        bestState = best;
      }
    }

    return bestState;
  }
}
