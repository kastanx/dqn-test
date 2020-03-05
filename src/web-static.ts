import { Game } from './game/Game';
import { TrainedAgent } from './agent/TrainedAgent';

const render = true;
let agent: any;

const start = async (modelUrl: string = 'static-pretrained') => {
  agent = new TrainedAgent(modelUrl);
  await agent.init();

  while (true) {
    const state = game.getState();
    const action = await agent.predict(state);
    const frame = game.step(action);
    agent.buffer.append(frame);

    if (gameTimeout !== 0) {
      await new Promise((resolve, reject) => setTimeout(resolve, gameTimeout));
    }
  }
};

const game = new Game('canvas-static', 8, 8, render, true);

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
game.getState();
game.createControls();

let gameTimeout = 300;

document.getElementById('nonstatic-model-button').onclick = () => {
  const model: any = document.getElementById('nonstatic-model');
  start(model);
};

start();
