import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { Simulator } from './lib/simulator';
import { InputInstruction, RobotState } from './lib/types';
import { ObstactleError } from './lib/handlers';
import { log } from 'console';
import { BackupStrategies } from './strategies';

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
  const robotSimulator = new Simulator(input.terrain);

  let finalState = null;
  let strategy = input.commands;

  do {
    try {
      const initialState: RobotState = {
        batteryLeft: input.battery,
        position: {
          location: input.initialPosition.location,
          facing: input.initialPosition.facing,
        },
        samplesCollected: [],
        cellsVisited: [],
      };

      finalState = robotSimulator.run(initialState, strategy);

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
      }
    }
  } while (!finalState && strategy); // before we succesfully execute the strategy or run out of backup strategies
});

apiApp.listen(port, () => {
  console.log(`🚀 Server ready on http://localhost:${port}`);
});
