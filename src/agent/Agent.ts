import { Sequential, tensor2d } from '@tensorflow/tfjs';
import { Model, tf } from './Model';
import { DequeBuffer, Frame } from '../experimental/DequeBuffer';
import { Action } from '../game/Action';
import { Reward } from '../game/Reward';

export class Agent {
  private discount: number = 1;
  private trainModel: any;
  private predictModel: any;
  public buffer: DequeBuffer;
  public training: boolean = false;
  public epsilon: number = 1;
  public epsilonDecay: number = 0.9999999;
  public score: number = 0;
  public epsilonStrategy: boolean = true;
  public updateEvery: number = 1000;
  public toUpdate: number = 0;
  public step: number = 0;

  constructor() {
    this.trainModel = Model.create();
    this.predictModel = Model.create();
    this.buffer = new DequeBuffer(50000);
  }

  train = async () => {
    const batch = this.buffer.sample(64);
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
      let newQ;
      if (frame.reward === Reward.OBSTACLE) {
        newQ = -100;
      } else {
        const maxFutureQ = Math.max(...nextQs[index]);
        newQ = frame.reward + this.discount * maxFutureQ;
      }

      const currentQ = currentQs[index];
      currentQ[frame.action - 1] = newQ;
      x.push(frame.state);
      y.push(currentQ);
    });

    await this.trainModel.fit(tensor2d(x), tensor2d(y), { verbose: false });
    await this.saveModel();
    this.updateModel();
  };

  saveModel = async () => {
    if (this.step % 10000 === 0) {
      await this.trainModel.save('file://step' + this.step);
    }
  };

  predict = async (state: any): Promise<any> => {
    console.log(this.step);
    this.step++;
    if (this.buffer.canTrain(64)) {
      await this.train();
    }
    this.epsilon = this.epsilon * this.epsilonDecay;
    const rand = Math.random();
    if (rand < this.epsilon && this.epsilonStrategy) {
      return Action.random();
    }

    const qs = this.predictModel.predict(tf.tensor2d([state])).dataSync();

    const highestReward = Object.keys(qs).reduce((a, b) => (qs[a] > qs[b] ? a : b));

    return parseInt(highestReward) + 1;
  };

  updateModel = () => {
    this.toUpdate++;
    if (this.toUpdate > this.updateEvery) {
      this.predictModel.setWeights(this.trainModel.getWeights());
      console.log('UPDATING MODEL');
      this.toUpdate = 0;
    }
  };
}
