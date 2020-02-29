import { sampleSize } from 'lodash';
import * as fs from 'fs-extra';

export interface Frame {
  state: number[];
  action: number;
  nextState: number[];
  reward?: number;
  done?: boolean;
}

export class DequeBuffer {
  private maxSize: number;

  private _frames: Frame[] = [];

  public get frames(): Frame[] {
    return this._frames;
  }

  public set frames(v: Frame[]) {
    this._frames = v;
  }

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  public append = (frame: Frame) => {
    if (this.frames.length > this.maxSize) {
      this.frames.shift();
    }

    this.frames.push(frame);
  };

  public sample = (batchSize: number): Frame[] => {
    return sampleSize(this.frames, batchSize);
  };

  public canTrain = (batchSize: number): boolean => {
    return this.frames.length > batchSize;
  };
}
