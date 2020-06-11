import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { errors } from 'celebrate';
import filesRoutes from './files/files.routes';

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// routes
app.use('/files', filesRoutes);

app.use(errors());
