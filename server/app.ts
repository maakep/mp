import * as express from 'express';
import root from './root';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

const app: express.Express = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/*.(js|png)', (req, res) => {
  res.sendFile(req.url, root);
});

app.get('/members', (req, res) => {
  res.send('endpoint to get all members in json');
});

app.get('/*', (req, res) => {
  res.sendFile('/index.html', root);
});

export default app;
