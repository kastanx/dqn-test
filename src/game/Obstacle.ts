import { GameEntity } from './GameEntity';
import { EntityType } from './EntityType';

export class Obstacle extends GameEntity {
  getType() {
    return EntityType.OBSTACLE;
  }
}
