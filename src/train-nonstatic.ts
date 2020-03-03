import { Game } from './game/Game';
import { NonStaticAgent } from './agent/NonStaticAgent';

const model = process.env.MODEL;

const agent = new NonStaticAgent();
const render = false;

const start = async () => {
  await agent.init(model);

  while (true) {
    const state = game.getState();
    const action = await agent.predict(state);
    const frame = game.step(action);
    agent.buffer.append(frame);
  }
};

const game = new Game('canvas', 8, 8, render, false);

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
