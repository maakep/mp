import * as express from 'express';
import root from './root';
import * as bodyParser from 'body-parser';

const app: express.Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('/index.html', root);
});

app.get('/*.(js|png)', (req, res) => {
  res.sendFile(req.url, root);
});

export default app;
