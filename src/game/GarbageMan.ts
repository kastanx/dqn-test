import { GameEntity } from './GameEntity';
import { Action } from './Action';
import { EntityType } from './EntityType';

export class GarbageMan extends GameEntity {
  public getType = () => {
    return EntityType.ME;
  };

  execute = (action: number) => {
    switch (action) {
      case Action.LEFT:
        this.x -= this.width;
        break;
      case Action.RIGHT:
        this.x += this.width;
        break;
      case Action.UP:
        this.y -= this.height;
        break;
      case Action.DOWN:
        this.y += this.height;
        break;
    }
  };
}
