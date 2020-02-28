import { Sequential, tensor2d } from '@tensorflow/tfjs';
import { Model, tf } from './Model';
import { DequeBuffer, Frame } from '../experimental/DequeBuffer';
import { Action } from '../game/Action';

export class Agent {
  private discount: number = 0.9;
  private trainModel: any;
  private predictModel: any;
  public buffer: DequeBuffer;
  public training: boolean = false;
  public epsilon: number = 1;
  public epsilonDecay: number = 0.9999999;
  public score: number = 0;
  public epsilonStrategy: boolean = true;

  constructor() {
    this.trainModel = Model.create();
    this.predictModel = Model.create();
    this.buffer = new DequeBuffer(50000);
  }

  train = async () => {
    const batch = this.buffer.sample();
    const states: any = [];
    const nextStates: any = [];
    batch.forEach(element => {
      states.push(element.state);
      nextStates.push(element.nextState);
    });

    const currentQs = this.trainModel.predict(tf.tensor2d(states)).arraySync();
    const nextQs: any = this.trainModel.predict(tf.tensor2d(nextStates)).arraySync();

    const x: any = [];
    const y: any = [];
    batch.forEach((frame: Frame, index: number) => {
      const maxFutureQ = Math.max(...nextQs[index]);
      const newQ = frame.reward + this.discount * maxFutureQ;

      const currentQ = currentQs[index];
      currentQ[frame.action - 1] = newQ;

      x.push(frame.state);
      y.push(currentQ);
    });

    await this.trainModel.fit(tensor2d(x), tensor2d(y), { verbose: false });
    this.updateModel();

    if (this.score > 10) {
      await this.trainModel.save('file://model.bin');
    }
  };

  predict = (state: any): number => {
    this.epsilon = this.epsilon * this.epsilonDecay;
    const rand = Math.random();
    if (rand < this.epsilon && this.epsilonStrategy) {
      return Action.random();
    }

    // console.log(
    //   '\x1b[36m%s\x1b[0m',
    //   'N0 RANDOM ACTION | EPSILON: ' + this.epsilon + ' | RANDOM: ' + rand + ' | SCORE: ' + this.score
    // );

    const qs = this.predictModel.predict(tf.tensor2d([state])).dataSync();
    const highestReward = Object.keys(qs).reduce((a, b) => (qs[a] > qs[b] ? a : b));

    return parseInt(highestReward) + 1;
  };

  updateModel = () => {
    this.predictModel.setWeights(this.trainModel.getWeights());
  };
}
