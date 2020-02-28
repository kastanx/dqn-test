import * as tensorflow from '@tensorflow/tfjs';
import * as tfnode from '@tensorflow/tfjs-node';
import { Sequential } from '@tensorflow/tfjs';

export const tf = process.env.NODEJS === 'node' ? tfnode : tensorflow;

export class Model {
  static create = (): Sequential => {
    const hidden1 = tf.layers.dense({
      inputShape: [64],
      units: 16,
      kernelInitializer: 'randomNormal'
    });

    const hidden2 = tf.layers.dense({
      units: 16,
      kernelInitializer: 'randomNormal'
    });

    const hidden3 = tf.layers.dense({
      units: 4,
      kernelInitializer: 'randomNormal'
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
