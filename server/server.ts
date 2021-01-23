import * as http from 'http';
import app from './app';
import { MpRepository } from './mp-repository';
import { TokenSessionKey } from '../shared/constants';
import { OAuth2Client } from 'google-auth-library';
import keys from '../api-keys-etc/keys';

export class Server {
  port = '8080';
  server: http.Server;
  repo: MpRepository;
  googleVerificationClient: OAuth2Client;

  constructor(repo: MpRepository) {
    this.server = http.createServer(app);
    this.repo = repo;
    this.server.listen(this.port);

    this.googleVerificationClient = new OAuth2Client(keys.gOauthClientId);

    console.log('Listening on :' + this.port);
    this.configureRouting();
  }

  configureRouting() {
    app.post('/send', async (req, res) => {
      const token = req.cookies[TokenSessionKey];
      if (token == null) {
        return res.sendStatus(403);
      }

      let ticket = null;
      try {
        ticket = await this.googleVerificationClient.verifyIdToken({
          idToken: token,
          audience: keys.gOauthClientId,
        });
      } catch (err) {
        console.error(err);
        return res.sendStatus(403);
      }
      if (ticket == null) {
        return res.sendStatus(403);
      }
      const payload = ticket.getPayload();

      const { to, points } = req.body;

      const success = this.repo.trySendMemberPoints(payload.email, to, points);
      if (!success) {
        return res.sendStatus(402);
      }
      return res.sendStatus(200);
    });

    app.post('/balance', async (req, res) => {
      const token = req.cookies[TokenSessionKey];
      if (token == null) {
        return res.sendStatus(403);
      }

      let ticket = null;
      try {
        ticket = await this.googleVerificationClient.verifyIdToken({
          idToken: token,
          audience: keys.gOauthClientId,
        });
      } catch (err) {
        console.error(err);
        return res.sendStatus(403);
      }
      if (ticket == null) {
        return res.sendStatus(403);
      }
      const payload = ticket.getPayload();

      const points = this.repo.getMemberPoints(payload.email);
      return res.status(200).send(points.toString());
    });

    app.post('/top', (req, res) => {
      const toplist = this.repo.getMemberAndPoints();
      const sortedToplist = Object.entries(toplist)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      return res.status(200).json(sortedToplist);
    });
  }
}

const repo = new MpRepository();
const server = new Server(repo);
