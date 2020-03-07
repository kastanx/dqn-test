import * as tf from '@tensorflow/tfjs-node';

export class AggregateLayer extends tf.layers.Layer {
  call(input: any) {
    return tf.tidy(() => {
      const advantage = input[0];
      const value = input[1];

      const mean = tf.mean(advantage, 1, true);
      const sub = advantage.sub(mean);
      const add = value.add(sub);

      return add;
    });
  }

  static get className() {
    return 'AggregateLayer';
  }

  computeOutputShape() {
    return [1, 4];
  }
}

tf.serialization.registerClass(AggregateLayer);
