import { TestModel } from './TestModel';
import * as fs from 'fs-extra';
import { Frame, DequeBuffer } from '../experimental/DequeBuffer';
import * as tf from '@tensorflow/tfjs-node';
import { Reward } from '../game/Reward';

const model: any = TestModel.create();
const set: Frame[] = fs.readJSONSync('./src/testing/state-dataset.json'); //.slice(0, 100000);
const verify: Frame = fs.readJSONSync('./src/testing/verify.json');
const verify2 = fs.readJSONSync('./src/testing/test.data.json');
const buffer = new DequeBuffer(50000);
buffer.frames = set;

const DISCOUNT = 0.999999;
const train = async () => {
  for (let k = 0; k < 3000; k++) {
    let dataset = buffer.sample(32);
    const states: any = [];
    const nextStates: any = [];

    dataset.forEach(element => {
      states.push(element.state);
      nextStates.push(element.nextState);
    });

    const currentQs = model.predict(tf.tensor2d(states)).arraySync();
    const nextQs: any = model.predict(tf.tensor2d(nextStates)).arraySync();

    const x: any = [];
    const y: any = [];

    dataset.forEach((frame: Frame, index: number) => {
      let newQ;
      let rewiretenReward;
      if (frame.reward === 100) {
        rewiretenReward = 5;
      } else {
        rewiretenReward = 1;
      }
      if (frame.reward === -250) {
        newQ = -5;
      } else {
        const maxFutureQ = Math.max(...nextQs[index]);
        newQ = rewiretenReward + DISCOUNT * maxFutureQ;
      }

      const currentQ = currentQs[index];
      currentQ[frame.action - 1] = newQ;
      x.push(frame.state);
      y.push(currentQ);
    });

    for (let i = 0; i < 1; i++) {
      await model.fit(tf.tensor2d(x), tf.tensor2d(y), { verbose: true });
      await model.predict(tf.tensor2d([verify.state])).print();
      await model.predict(tf.tensor2d(verify2)).print();
    }
  }

  await model.save('file://lowerrewards');
};

train();
