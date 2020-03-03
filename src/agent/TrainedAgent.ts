import * as tf from '@tensorflow/tfjs';
import { DequeBuffer, Frame } from '../experimental/DequeBuffer';

export class TrainedAgent {
  private discount: number = 0.9;
  private trainModel: any;
  private predictModel: any;
  public buffer: DequeBuffer;
  public training: boolean = false;
  public epsilon: number = 1;
  public epsilonDecay: number = 0.9999999;
  public score: number = 0;
  public epsilonStrategy: boolean = true;
  public updateEvery: number = 100;
  public toUpdate: number = 0;

  constructor() {
    this.buffer = new DequeBuffer(50000);
  }

  init = async () => {
    this.predictModel = await tf.loadLayersModel('https://kastanx.github.io/dqn-test/nonstatic-pretrained/model.json');
    console.log('loaded');
  };

  train = async () => {};

  predict = (state: any): number => {
    console.log('SCORE: ' + this.score);
    const qs = this.predictModel.predict(tf.tensor2d([state])).dataSync();

    const highestReward = Object.keys(qs).reduce((a, b) => (qs[a] > qs[b] ? a : b));

    return parseInt(highestReward) + 1;
  };

  updateModel = () => {};
}
