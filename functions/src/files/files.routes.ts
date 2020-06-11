import * as express from 'express';
import * as httperr from 'httperr';
import { createFileInStorage } from '../services/storage.services';
import { celebrate, Joi, Segments } from 'celebrate';

const routes = express.Router();

const postUploadValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    filename: Joi.string().required(),
  }),
});

routes.post('/', postUploadValidator, async (req, res) => {
  try {
    await createFileInStorage({
      filename: req.query.filename as string,
      headers: req.headers,
      // @ts-ignore 
      rawBody: req.rawBody,
    });

    return res.json({ message: 'file uploaded successfully' });
  } catch (error) {
    const err = httperr.badRequest({
      message: 'Error, could not upload file',
      details: error,
    });
    return res.status(err.statusCode).json(err);
  }
});

routes.get('/', (req, res) => {
  
});

export default routes;