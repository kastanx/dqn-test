import * as tf from '@tensorflow/tfjs-node';
import { AggregateLayer } from '../AggregateLayer';

export class DuelingDqn {
  static create = (): any => {
    const input = tf.input({ shape: [64] });

    const hidden = tf.layers
      .dense({ units: 256, activation: 'relu' })
      .apply(tf.layers.dense({ units: 256, activation: 'relu' }).apply(input));

    const value = tf.layers.dense({ units: 1, activation: 'linear' });
    const advantage = tf.layers.dense({ units: 4, activation: 'linear' });

    const V = value.apply(hidden);
    const A = advantage.apply(hidden);

    //@ts-ignore
    const aggregate = new AggregateLayer({ units: 4 }).apply([A, V]);
    //@ts-ignore
    const model = tf.model({ inputs: input, outputs: aggregate });
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    model.summary();

    return model;
  };
}
