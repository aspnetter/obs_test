import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { Simulator } from './lib/simulator';
import { InputInstruction, Position, RobotState } from './lib/types';
import { ObstactleError } from './lib/handlers';
import { log } from 'console';
import { BackupStrategies } from './strategies';
import { BatteryError } from './lib/helpers/validators';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const apiApp = express();

// adding Helmet to enhance your Rest API's security
apiApp.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
apiApp.use(bodyParser.json());

// enabling CORS for all requests
apiApp.use(cors());

// adding morgan to log HTTP requests
apiApp.use(morgan('combined'));

apiApp.get('/', (_req, res) => {
  res.send({ message: 'Hello & welcome to Mars!' });
});

apiApp.post('/', (req, res) => {
  const input: InputInstruction = req.body;
  // initialize the current state
  const state: RobotState = {
    batteryLeft: input.battery,
    position: { ... input.initialPosition },
    samplesCollected: [],
    cellsVisited: [],
  };
  // save the initial positions from the input in case we need to change the strategy
  const initialPosition: Position = {...input.initialPosition};

  const robotSimulator = new Simulator(input.terrain);
  let finalState = null;
  let strategy = input.commands;

  do {
    try {
      // reset the position and facing direction before we start with the new strategy
      state.position = {...initialPosition};
      finalState = robotSimulator.run(state, strategy);

      res.send({
        VisitedCells: finalState.cellsVisited,
        SamplesCollected: [...new Set(finalState.samplesCollected)],
        Battery: finalState.batteryLeft,
        FinalPosition: finalState.position,
      });
    } catch (error) {
      if (error instanceof ObstactleError) {
        strategy = BackupStrategies.pop();
        log(`Faced an Obstacle on my way, new strategy: ${strategy}`);
      } else {
        let message = "A system error has occurred";

        // TODO: could be made more flexible and generic here
        if(error instanceof BatteryError || error instanceof RangeError) {
          message = `${message}: ${error.message}`;
        }

        res.status(500).send(message);
      }
    }
  } while (!finalState && strategy); // before we succesfully execute the strategy or run out of backup strategies
});

apiApp.listen(port, () => {
  console.log(`🚀 Server ready on http://localhost:${port}`);
});
