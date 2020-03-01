import * as tf from '@tensorflow/tfjs-node';
import { Sequential } from '@tensorflow/tfjs';

export class TestModel {
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
      units: 256,
      activation: 'relu'
    });

    const hidden4 = tf.layers.dense({
      activation: 'linear',
      units: 4
    });

    const model = tf.sequential();
    model.add(hidden1);
    model.add(hidden2);
    model.add(hidden3);
    model.add(hidden4);
    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
    model.summary();

    return model;
  };
}
