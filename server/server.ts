import * as http from "http";
import app from "./app";

export class Server {
  port = "3000";
  server: http.Server;

  constructor() {
    this.server = http.createServer(app);
    this.server.listen(this.port);
    console.log("Listening on :" + this.port);
    this.configureRouting();
  }

  configureRouting() {
    app.get("/members", (req, res) => {
      res.send("");
    });
  }
}

const server = new Server();
