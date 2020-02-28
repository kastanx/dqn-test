import { Px } from '../util/Px';
import { Position } from './Position';

export class GameEntity {
  protected x: number;
  protected y: number;
  protected context: any;
  protected width: number;
  protected height: number;
  protected color: string;

  constructor(width: number, height: number, x: number, y: number, context: any, color: string) {
    this.x = Px.scaleUp(x);
    this.y = Px.scaleUp(y);
    this.width = Px.scaleUp(width);
    this.height = Px.scaleUp(height);
    this.context = context;
    this.color = color;
  }

  getX = (): number => {
    return Px.scaleDown(this.x);
  };

  setX = (x: number) => {
    this.x = Px.scaleUp(x);
  };

  getY = (): number => {
    return Px.scaleDown(this.y);
  };

  setY = (y: number) => {
    this.y = Px.scaleUp(y);
  };

  getPosition = (): Position => {
    return { x: Px.scaleDown(this.x), y: Px.scaleDown(this.y) };
  };

  setPosition = (position: Position) => {
    this.x = Px.scaleUp(position.x);
    this.y = Px.scaleUp(position.y);
  };

  getContext = (): any => {
    return this.context;
  };

  setContext = (context: any) => {
    this.context = context;
  };

  getStringPosititon = (): string => {
    const pos = this.getPosition();
    return `${pos.x},${pos.y}`;
  };

  update = () => {
    this.getContext().fillStyle = this.color;
    this.getContext().fillRect(this.x, this.y, this.width, this.height);
  };
}
