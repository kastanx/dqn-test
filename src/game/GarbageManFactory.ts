import { Obstacle } from './Obstacle';
import { TakenSpots } from './TakenSpots';
import { random } from 'lodash';
import { GarbageMan } from './GarbageMan';

export class GarbageManFactory {
  public static create(
    count: number,
    gameWidth: number,
    gameHeight: number,
    context: any,
    takenSpots: TakenSpots
  ): GarbageMan[] {
    const garbageMan: GarbageMan[] = [];
    for (let i = 0; i < count; i++) {
      const position = GarbageManFactory.generateUnique(gameWidth, gameHeight, takenSpots);
      takenSpots.add(position);

      const x = parseInt(position.split(',')[0]);
      const y = parseInt(position.split(',')[1]);
      garbageMan.push(new GarbageMan(1, 1, x, y, context, 'blue'));
    }

    return garbageMan;
  }

  public static generateUnique = (gameWidth: number, gameHeight: number, takenSpots: TakenSpots): string => {
    const position = `${random(gameWidth - 1)},${random(gameHeight - 1)}`;

    if (takenSpots.all().find(pos => pos === position)) {
      return GarbageManFactory.generateUnique(gameWidth, gameHeight, takenSpots);
    }

    return position;
  };
}
