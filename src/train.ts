import { Game } from './game/Game';
import { StaticAgent } from './agent/StaticAgent';

const agent = new StaticAgent();
const render = false;

const start = async () => {
  await agent.init();

  while (true) {
    const state = game.getState();
    const action = await agent.predict(state);
    const frame = game.step(action);
    agent.buffer.append(frame);
  }
};

const game = new Game('canvas', 8, 8, render, true);

game.endGameCallback = () => {
  agent.score = 0;
  game.start();
};

game.successCallback = (object1: any, object2: any) => {
  agent.score++;
  object2.delete();
};

game.start();

start();
