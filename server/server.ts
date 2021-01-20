import * as http from 'http';
import app from './app';
import { MpRepository } from './mp-repository';
import { TokenSessionKey } from '../shared/constants';
import { OAuth2Client } from 'google-auth-library';
import keys from '../api-keys-etc/keys';

export class Server {
  port = '3000';
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
        console.log('Token is null');
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
        console.log('ticket is null');
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
  }
}

const repo = new MpRepository();
const server = new Server(repo);
