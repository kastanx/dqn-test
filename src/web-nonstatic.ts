import { Game } from './game/Game';
import { TrainedAgent } from './agent/TrainedAgent';

const render = true;
let agent: any;

const start = async () => {
  agent = new TrainedAgent('nonstatic-pretrained');
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
game.getState();
game.createControls();

let gameTimeout = 300;

start();
