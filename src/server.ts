import express from 'express';
import payload from 'payload';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.disable('x-powered-by');
app.use(helmet());

const port = process.env.PORT || 3000;

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

app.use('/assets', express.static(path.resolve(__dirname, './assets')));

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(port, () => {
    payload.logger.info(`Server listening at port: ${port}`);
  });
};

start();
