import { Game } from './game/Game';
import { Agent } from './agent/Agent';

const render = process.env.NODEJS === 'node' ? false : true;
const agent = new Agent();
const game = new Game('canvas', 8, 8, render);

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

const trainEvery = 1000;
let step = 0;
let gameTimeout = 0;

const start = async () => {
  while (true) {
    const state = game.getState();
    const action = agent.predict(state);
    const frame = game.step(action);
    agent.buffer.append(frame);

    if (step > trainEvery) {
      await agent.train();
      step = 0;
    }
    step++;

    if (gameTimeout !== 0) {
      await new Promise((resolve, reject) => setTimeout(resolve, gameTimeout));
    }
  }
};
if (render) {
  const dump = () => {
    document.getElementById('dump').textContent = 'TBD';
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
