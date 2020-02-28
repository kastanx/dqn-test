import { sample } from 'lodash';

export class Action {
  public static UP = 1;
  public static DOWN = 2;
  public static LEFT = 3;
  public static RIGHT = 4;

  public static toArray(): any {
    return Object.values(Action).filter(value => typeof value === 'number');
  }

  public static random(actions?: number[]) {
    if (actions && actions.length > 0) {
      return sample(actions);
    }

    return sample(Action.toArray());
  }
}
