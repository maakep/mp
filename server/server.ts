import * as http from 'http';
import app from './app';
import { MpRepository } from './mp-repository';
import { TokenSessionKey } from '../shared/constants';
import { OAuth2Client } from 'google-auth-library';
import keys from '../api-keys-etc/keys';
import { isAdministrator } from './admin';

export class Server {
  port = process.env.PORT || 8080;
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
      const { to, points, dontRemove } = req.body;
      const {
        payload,
        ...verificationResult
      } = await this.verifyTokenAndGetPayload(token);

      if (!verificationResult.success) {
        return res.sendStatus(verificationResult.statusCode);
      }

      const success = await this.repo.trySendMemberPoints(
        payload.email,
        to,
        points,
        dontRemove
      );
      if (!success) {
        return res.sendStatus(402);
      }
      return res.sendStatus(200);
    });

    app.post('/balance', async (req, res) => {
      const token = req.cookies[TokenSessionKey];
      const {
        payload,
        ...verificationResult
      } = await this.verifyTokenAndGetPayload(token);

      if (!verificationResult.success) {
        return res.sendStatus(verificationResult.statusCode);
      }

      const points = await this.repo.getMemberPoints(payload.email);
      return res.status(200).send(points.toString());
    });

    app.post('/top', async (req, res) => {
      const toplist = await this.repo.getAllMembersAndPoints();
      const sortedToplist = toplist.sort((a, b) => b.points - a.points);
      return res.status(200).json(sortedToplist);
    });

    app.post('/admin', async (req, res) => {
      const token = req.cookies[TokenSessionKey];
      const {
        payload,
        ...verificationResult
      } = await this.verifyTokenAndGetPayload(token);

      if (!verificationResult.success) {
        return res.sendStatus(verificationResult.statusCode);
      }

      const isAdmin = isAdministrator(payload.email);

      return res.sendStatus(isAdmin ? 200 : 403);
    });
  }

  async verifyTokenAndGetPayload(token: string): Promise<VerificationPayload> {
    if (token == null) {
      return { success: false, statusCode: 403 };
    }

    let ticket = null;
    try {
      ticket = await this.googleVerificationClient.verifyIdToken({
        idToken: token,
        audience: keys.gOauthClientId,
      });
    } catch (err) {
      console.error(err);
    }
    if (ticket == null) {
      return { success: false, statusCode: 403 };
    }

    const payload = ticket.getPayload();
    return { success: true, payload: payload };
  }
}

type VerificationPayload = {
  success: boolean;
  statusCode?: number;
  payload?: any;
};

const repo = new MpRepository();
const server = new Server(repo);
