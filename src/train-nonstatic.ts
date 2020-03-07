import { Game } from './game/Game';
import { NonStaticAgent } from './agent/NonStaticAgent';
import { DuelingDqn } from './agent/DuelingDqn';
import { Model } from './agent/Model';
import * as prompts from 'prompts';

const agent = new NonStaticAgent();
const render = false;

const start = async () => {
  const { model } = await prompts({
    type: 'text',
    name: 'model',
    message: 'Enter model (dueling, dqn)'
  });

  switch (model) {
    case 'dueling':
      await agent.init(false, DuelingDqn);
      break;
    case 'dqn':
      await agent.init(false, Model);
      break;
  }

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
