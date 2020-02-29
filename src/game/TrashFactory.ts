import { TakenSpots } from './TakenSpots';
import { random } from 'lodash';
import { Trash } from './Trash';

export class TrashFactory {
  public static createStatic = (context: any, takenSpots: TakenSpots): Trash[] => {
    const positions = ['5,5', '5,6', '3,2', '3,6', '4,1'];
    const trash: Trash[] = [];

    positions.forEach((pos: string) => {
      const [x, y] = pos.split(',');
      takenSpots.add(pos);

      trash.push(new Trash(1, 1, parseInt(x), parseInt(y), context, 'red'));
    });

    return trash;
  };

  public static create(
    count: number,
    gameWidth: number,
    gameHeight: number,
    context: any,
    takenSpots: TakenSpots
  ): Trash[] {
    const trash: Trash[] = [];
    for (let i = 0; i < count; i++) {
      const position = TrashFactory.generateUnique(gameWidth, gameHeight, takenSpots);
      takenSpots.add(position);

      const x = parseInt(position.split(',')[0]);
      const y = parseInt(position.split(',')[1]);
      trash.push(new Trash(1, 1, x, y, context, 'red'));
    }

    return trash;
  }

  public static generateUnique = (gameWidth: number, gameHeight: number, takenSpots: TakenSpots): string => {
    const position = `${random(gameWidth - 1)},${random(gameHeight - 1)}`;

    if (takenSpots.all().find(pos => pos === position)) {
      return TrashFactory.generateUnique(gameWidth, gameHeight, takenSpots);
    }

    return position;
  };
}
