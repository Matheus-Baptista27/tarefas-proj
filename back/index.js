import express, { json } from 'express';
import admin from 'firebase-admin';
import { tasksRouter } from './tasks/routes.js';

const app = express();

admin.initializeApp({
  credential: admin.credential.cert("serviceAccountKey.json")
});

app.use(json());
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PATCH,DELETE");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();

});

app.use('/tasks', tasksRouter);

app.listen(3000, () => console.log('API rest iniciada em htpp://localhost:3000'));
