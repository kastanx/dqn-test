import * as tf from '@tensorflow/tfjs-node';
import { DequeBuffer, Frame } from '../experimental/DequeBuffer';
import { Action } from '../game/Action';
import { Reward } from '../game/Reward';
import { Model } from './Model';

export class NonStaticAgent {
  private discount: number = 0.8;
  private trainModel: any;
  private predictModel: any;
  public buffer: DequeBuffer;
  public training: boolean = false;
  public epsilon: number = 0.4;
  public epsilonDecay: number = 0.999999;
  public score: number = 0;
  public updateEvery: number = 1000;
  public toUpdate: number = 0;
  public step: number = 0;

  constructor() {
    this.buffer = new DequeBuffer(50000);
  }

  init = async () => {
    try {
      this.predictModel = await tf.loadLayersModel('file://nonstatic-pretrained/model.json');
      this.trainModel = await tf.loadLayersModel('file://nonstatic-pretrained/model.json');
      this.predictModel.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
      this.trainModel.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
      this.predictModel.summary();
      this.trainModel.summary();
      console.log('loaded');
    } catch (e) {
      this.predictModel = Model.create();
      this.trainModel = Model.create();
      console.log('model not found, created new');
    }
  };

  train = async () => {
    if (this.buffer.canTrain(32)) {
      const batch = this.buffer.sample(32);
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
          newQ = frame.reward;
        } else {
          const maxFutureQ = Math.max(...nextQs[index]);
          newQ = frame.reward + this.discount * maxFutureQ;
        }

        const currentQ = currentQs[index];
        currentQ[frame.action - 1] = newQ;
        x.push(frame.state);
        y.push(currentQ);
      });

      await this.trainModel.fit(tf.tensor2d(x), tf.tensor2d(y), { verbose: false });
      await this.saveModel();
      this.updateModel();
    }
  };

  saveModel = async () => {
    if (this.step % 10000 === 0) {
      await this.trainModel.save('file://nonstatic-step' + this.step);
    }
  };

  predict = async (state: any): Promise<any> => {
    this.step++;
    await this.train();

    this.epsilon = this.epsilon * this.epsilonDecay;

    if (Math.random() < this.epsilon) {
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
