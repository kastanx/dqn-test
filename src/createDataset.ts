import { Game } from './game/Game';
import { DatasetAgent } from './agent/DatasetAgent';
import { TrainedAgent } from './agent/TrainedAgent';

const render = process.env.NODEJS === 'node' ? false : true;
let agent: any;

const start = async () => {
  agent = new DatasetAgent();

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
  //game.start();
  object2.delete();
};

game.start();
game.getState();
game.createControls();

let gameTimeout = 300;

if (render) {
  const dump = () => {
    document.getElementById('dump').textContent = 'tbd';
  };

  document.getElementById('dumpbtn').onclick = dump;

  const setGameTimeout = (to: any) => {
    const { value } = document.getElementById('speedValue') as any;
    agent.epsilonStrategy = false;
    gameTimeout = parseInt(value);
  };

  document.getElementById('speedBtn').onclick = setGameTimeout;
}

start();
