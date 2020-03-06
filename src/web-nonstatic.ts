import { Game } from './game/Game';
import { TrainedAgent } from './agent/TrainedAgent';

const render = true;
let agent: any;

const start = async (modelUrl: string = 'nonstatic-pretrained') => {
  agent = new TrainedAgent(modelUrl);
  await agent.init();

  while (true) {
    const state = game.getState();
    const action = await agent.predict(state);
    const frame = game.step(action);
    agent.buffer.append(frame);

    await new Promise((resolve, reject) => setTimeout(resolve, 300));
  }
};

const game = new Game('canvas-nonstatic', 8, 8, render, false);

game.endGameCallback = () => {
  agent.score = 0;
  game.start();
};

game.successCallback = (object1: any, object2: any) => {
  agent.score++;
  //game.start();
  object2.delete();
};

game.start();

let gameTimeout = 300;

document.getElementById('nonstatic-model-button').onclick = () => {
  const model: any = document.getElementById('nonstatic-model');
  game.start();
  start(model.value);
};

start();
