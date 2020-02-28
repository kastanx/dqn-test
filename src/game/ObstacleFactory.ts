import { Obstacle } from './Obstacle';
import { TakenSpots } from './TakenSpots';
import { random } from 'lodash';

export class ObstacleFactory {
  public static create(count: number, gameWidth: number, gameHeight: number, context: any, takenSpots: TakenSpots) {
    const obstacles: Obstacle[] = [];
    for (let i = 0; i < count; i++) {
      const position = ObstacleFactory.generateUnique(gameWidth, gameHeight, takenSpots);
      takenSpots.add(position);

      const x = parseInt(position.split(',')[0]);
      const y = parseInt(position.split(',')[1]);
      obstacles.push(new Obstacle(1, 1, x, y, context, 'black'));
    }

    return obstacles;
  }

  public static generateUnique = (gameWidth: number, gameHeight: number, takenSpots: TakenSpots): string => {
    const position = `${random(gameWidth - 1)},${random(gameHeight - 1)}`;

    if (takenSpots.all().find(pos => pos === position)) {
      return ObstacleFactory.generateUnique(gameWidth, gameHeight, takenSpots);
    }

    return position;
  };

  public static generateFence = (
    gameWidth: number,
    gameHeight: number,
    context: any,
    takenSpots: TakenSpots
  ): Obstacle[] => {
    const obstacles: Obstacle[] = [];

    for (let x = 0; x < gameWidth; x++) {
      takenSpots.add(`${x},${0}`);
      obstacles.push(new Obstacle(1, 1, x, 0, context, 'black'));
      takenSpots.add(`${x},${gameWidth - 1}`);
      obstacles.push(new Obstacle(1, 1, x, gameWidth - 1, context, 'black'));
    }

    for (let y = 0; y < gameHeight; y++) {
      takenSpots.add(`${0},${y}`);
      obstacles.push(new Obstacle(1, 1, 0, y, context, 'black'));
      takenSpots.add(`${gameHeight - 1},${y}`);
      obstacles.push(new Obstacle(1, 1, gameHeight - 1, y, context, 'black'));
    }

    return obstacles;
  };
}
