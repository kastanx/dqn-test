import { TestModel } from './TestModel';
import * as fs from 'fs-extra';
import { Frame } from '../experimental/DequeBuffer';
import * as tf from '@tensorflow/tfjs-node';
import { Reward } from '../game/Reward';

const model: any = TestModel.create();
const dataset: Frame[] = fs.readJSONSync('./src/testing/state-dataset.json'); //.slice(0, 100000);
const verify: Frame = fs.readJSONSync('./src/testing/verify.json');

const DISCOUNT = 1;
const train = async () => {
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
    if (frame.reward === Reward.OBSTACLE) {
      newQ = -100;
    } else {
      const maxFutureQ = Math.max(...nextQs[index]);
      newQ = frame.reward + DISCOUNT * maxFutureQ;
    }

    const currentQ = currentQs[index];
    currentQ[frame.action - 1] = newQ;
    x.push(frame.state);
    y.push(currentQ);
  });

  for (let i = 0; i < 100; i++) {
    await model.fit(tf.tensor2d(x), tf.tensor2d(y), { verbose: true });
    await model.predict(tf.tensor2d([verify.state])).print();
    await model.save('file://model.bin');
  }
};

train();
