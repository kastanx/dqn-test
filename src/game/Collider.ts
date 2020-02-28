import { GameEntity } from './GameEntity';

interface Collide {
  entities1: GameEntity[];
  entities2: GameEntity[];
  callback: CallableFunction;
}

export class Collider {
  private map: Collide[] = [];

  add = (entities1: GameEntity[], entities2: GameEntity[], callback: CallableFunction) => {
    this.map.push({ entities1, entities2, callback });
  };

  check = () => {
    const collidees: any = [];
    this.map.forEach((collide, index: number) => {
      collidees[index] = [];

      collide.entities1.forEach(element => {
        collidees[index][element.getStringPosititon()] = element;
      });
      collide.entities2.forEach(element => {
        if (element.getStringPosititon() in collidees[index]) {
          collide.callback(collidees[index][element.getStringPosititon()], element);
        }
      });
    });
  };

  reset = () => {
    this.map = [];
  };
}
