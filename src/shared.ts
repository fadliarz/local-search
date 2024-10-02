export type State = {
  cube: number[][][];
  value: number;
};

export type Point = {
  f: number;
  r: number;
  c: number;
};

export type Action = {
  p1: Point;
  p2: Point;
};

export type Parent = {
  first: State;
  second: State;
};

export type Child = {
  first: State;
  second: State;
};
