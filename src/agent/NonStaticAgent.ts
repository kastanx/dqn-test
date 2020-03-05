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
  public epsilon: number = 0.8;
  public epsilonDecay: number = 0.99999;
  public score: number = 0;
  public updateEvery: number = 1000;
  public toUpdate: number = 0;
  public step: number = 0;

  constructor() {
    this.buffer = new DequeBuffer(500000);
  }

  init = async (modelPath: string = 'nonstatic-pretrained') => {
    try {
      this.predictModel = await tf.loadLayersModel('file://' + modelPath + '/model.json');
      this.trainModel = await tf.loadLayersModel('file://' + modelPath + '/model.json');
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
    if (this.buffer.canTrain(500)) {
      const batch = this.buffer.sample(500);
      const states: any = [];
      const nextStates: any = [];
      batch.forEach(element => {
        states.push(element.state);
        nextStates.push(element.nextState);
      });

      const currentQs = tf.tidy(() => {
        return this.trainModel.predict(tf.tensor2d(states)).arraySync();
      });

      const nextQs: any = tf.tidy(() => {
        return this.trainModel.predict(tf.tensor2d(nextStates)).arraySync();
      });

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

      const xTensor = tf.tensor2d(x);
      const yTensor = tf.tensor2d(y);

      await this.trainModel.fit(xTensor, yTensor, { verbose: false });
      await this.saveModel();
      this.updateModel();

      tf.dispose(yTensor);
      tf.dispose(xTensor);
    }
  };

  saveModel = async () => {
    if (this.step % 10000 === 0) {
      await this.trainModel.save('file://pretrained/nonstatis/step' + this.step);
    }
  };

  predict = async (state: any): Promise<any> => {
    this.step++;
    await this.train();

    this.epsilon = this.epsilon * this.epsilonDecay;

    if (Math.random() < this.epsilon) {
      return Action.random();
    }

    return tf.tidy(() => {
      const qs = this.predictModel.predict(tf.tensor2d([state])).dataSync();

      const highestReward = Object.keys(qs).reduce((a, b) => (qs[a] > qs[b] ? a : b));

      return parseInt(highestReward) + 1;
    });
  };

  updateModel = () => {
    this.toUpdate++;
    if (this.toUpdate > this.updateEvery) {
      this.predictModel.setWeights(this.trainModel.getWeights());
      console.log('UPDATING MODEL, EPSILON: ' + this.epsilon + ' STEP: ' + this.step);
      this.toUpdate = 0;
    }
  };
}
