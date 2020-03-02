import * as tensorflow from '@tensorflow/tfjs-node';
import { Sequential } from '@tensorflow/tfjs-node';

export const tf = tensorflow;

export class Model {
  static create = (): Sequential => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [64],
        activation: 'relu',
        units: 256
      })
    );

    model.add(
      tf.layers.dense({
        units: 256,
        activation: 'relu'
      })
    );
    model.add(
      tf.layers.dense({
        units: 256,
        activation: 'relu'
      })
    );

    model.add(
      tf.layers.dense({
        units: 256,
        activation: 'relu'
      })
    );

    model.add(
      tf.layers.dense({
        units: 256,
        activation: 'relu'
      })
    );

    model.add(
      tf.layers.dense({
        activation: 'linear',
        units: 4
      })
    );

    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
    model.summary();

    return model;
  };
}
