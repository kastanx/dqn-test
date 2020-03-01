import * as tensorflow from '@tensorflow/tfjs';
//import * as tfnode from '@tensorflow/tfjs-node';
import { Sequential } from '@tensorflow/tfjs';

export const tf = process.env.NODEJS === 'node' ? tensorflow : tensorflow;

export class Model {
  static create = (): Sequential => {
    const hidden1 = tf.layers.dense({
      inputShape: [64],
      activation: 'relu',
      units: 256
    });

    const hidden2 = tf.layers.dense({
      units: 256,
      activation: 'relu'
    });

    const hidden3 = tf.layers.dense({
      activation: 'linear',
      units: 4
    });

    const model = tf.sequential();
    model.add(hidden1);
    model.add(hidden2);
    model.add(hidden3);
    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
    model.summary();

    return model;
  };
}
