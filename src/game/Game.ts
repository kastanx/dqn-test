import { Px } from '../util/Px';
import { TakenSpots } from './TakenSpots';
import { ObstacleFactory } from './ObstacleFactory';
import { TrashFactory } from './TrashFactory';
import { Obstacle } from './Obstacle';
import { Trash } from './Trash';
import { GarbageMan } from './GarbageMan';
import { GarbageManFactory } from './GarbageManFactory';
import { Collider } from './Collider';
import { Action } from './Action';
import { Reward } from './Reward';
import { Frame } from '../experimental/DequeBuffer';
import { EntityType } from './EntityType';

export class Game {
  private canvas: HTMLCanvasElement;
  private context: any;
  private fence: Obstacle[];
  private obstacles: Obstacle[];
  private gameWidth: number;
  private gameHeight: number;
  private trash: Trash[];
  private garbageMan: GarbageMan;
  private collider: Collider;
  public endGameCallback?: CallableFunction;
  public successCallback?: CallableFunction;
  public staticWorld: boolean;
  public state: any;
  public reward: number;
  public render: boolean;

  constructor(canvasId: string, gameWidth: number, gameHeight: number, render: boolean, staticWorld: boolean) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.render = render;
    this.staticWorld = staticWorld;
    if (this.render) {
      this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      this.canvas.width = Px.scaleUp(gameWidth);
      this.canvas.height = Px.scaleUp(gameHeight);
      this.context = this.canvas.getContext('2d');
    }
    this.collider = new Collider();
  }

  reset = () => {
    this.clear();
    this.collider.reset();
  };

  start = () => {
    this.reset();
    const takenSpots = new TakenSpots();
    this.fence = ObstacleFactory.generateFence(this.gameWidth, this.gameHeight, this.context, takenSpots);

    if (this.staticWorld) {
      this.obstacles = ObstacleFactory.createStatic(this.context, takenSpots);
      this.trash = TrashFactory.createStatic(this.context, takenSpots);
    } else {
      this.obstacles = ObstacleFactory.create(5, this.gameWidth, this.gameHeight, this.context, takenSpots);
      this.trash = TrashFactory.create(5, this.gameWidth, this.gameHeight, this.context, takenSpots);
    }

    this.garbageMan = GarbageManFactory.create(1, this.gameWidth, this.gameHeight, this.context, takenSpots)[0];

    this.collider.add([this.garbageMan], this.obstacles.concat(this.fence), (o1: any, o2: any) => {
      this.reward = Reward.OBSTACLE;
      this.endGameCallback(o1, o2);
    });

    this.collider.add([this.garbageMan], this.trash, (o1: any, o2: any) => {
      this.reward = Reward.TRASH;
      this.successCallback(o1, o2);
    });

    if (this.render) {
      this.garbageMan.update();
      this.obstacles.forEach(element => element.update());
      this.fence.forEach(element => element.update());
      this.trash.forEach(element => element.update());
    }
  };

  getState = (): number[] => {
    const map: any = {};

    this.obstacles.forEach(el => {
      map[el.getStringPosititon()] = el.getType();
    });

    this.fence.forEach(el => {
      map[el.getStringPosititon()] = el.getType();
    });

    this.trash.forEach(el => {
      !el.removed ? (map[el.getStringPosititon()] = el.getType()) : '';
    });

    map[this.garbageMan.getStringPosititon()] = this.garbageMan.getType();

    for (let x = 0; x < this.gameWidth; x++) {
      for (let y = 0; y < this.gameHeight; y++) {
        if (
          map[`${x},${y}`] !== EntityType.TRASH &&
          map[`${x},${y}`] !== EntityType.OBSTACLE &&
          map[`${x},${y}`] !== EntityType.ME
        ) {
          map[`${x},${y}`] = EntityType.VOID;
        }
      }
    }

    const ordered: any = {};
    Object.keys(map)
      .sort()
      .forEach(function(key) {
        ordered[key] = map[key];
      });

    return Object.values(ordered);
  };

  clear = () => {
    if (this.render) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  update = () => {
    if (this.render) {
      this.clear();
      this.obstacles.forEach(element => element.update());
      this.fence.forEach(element => element.update());
      this.trash.forEach(element => element.update());
      this.garbageMan.update();
    }
    this.collider.check();
  };

  move = (action: number) => {
    this.garbageMan.execute(action);
    this.update();
  };

  createControls = () => {
    if (this.render) {
      document.onkeydown = (e: any) => {
        e = e || window.event;

        if (e.keyCode == '38') {
          this.move(Action.UP);
        } else if (e.keyCode == '40') {
          this.move(Action.DOWN);
        } else if (e.keyCode == '37') {
          this.move(Action.LEFT);
        } else if (e.keyCode == '39') {
          this.move(Action.RIGHT);
        } else if (e.key == 'w') {
          // nothing
        }
      };
    }
  };

  step = (action: number): Frame => {
    this.reward = Reward.WALK;
    const state = this.getState();
    this.move(action);
    const nextState = this.getState();

    return { state, action, nextState, reward: this.reward };
  };
}
