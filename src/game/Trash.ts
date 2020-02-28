import { GameEntity } from './GameEntity';
import { EntityType } from './EntityType';

export class Trash extends GameEntity {
  removed = false;
  getType() {
    return EntityType.TRASH;
  }

  delete = () => {
    this.setPosition({ x: -5000, y: -5000 });
    this.removed = true;
  };
}
