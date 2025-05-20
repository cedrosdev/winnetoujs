const { createServer } = require("http");
const { Server, Socket } = require("socket.io");
const express = require("express");
const Drawer = require("./drawer.js");

class Extension {
  /**
   *
   * @param {object} args
   * @param {Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>} args.socket
   * @param {string} args.type
   * @param {any} args.payload
   */
  sendToExtension(args) {
    try {
      args.socket.emit(args.type, args.payload);
    } catch (e) {}
  }

  /**
   *
   * @param {number} serverPort
   * @returns {Promise.<{app:any,io:any}>}
   */
  createServer(serverPort) {
    return new Promise((resolve, reject) => {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      const port = serverPort || 5501;

      try {
        const httpServer = createServer(app);
        const io = new Server(httpServer, {
          transports: ["websocket", "polling"],
          cors: {
            origin: `http://localhost:${port}`,
          },
        });
        httpServer
          .listen(port)
          .on("listening", ev => {
            new Drawer().drawTextBlock(`Server Running at ${port}`, {
              color: `green`,
            });
            new Drawer().drawBlankLine();
            new Drawer().drawLine();
            return resolve({ app, io });
          })
          .on("error", ev => {
            new Drawer().drawError(
              `Port ${port} is already in use. Change it in win.config.json and try again.`
            );
            new Drawer().drawBlankLine();
            new Drawer().drawLine();
            return reject(false);
          });
      } catch (e) {
        new Drawer().drawError(e.message);
        new Drawer().drawBlankLine();
        new Drawer().drawLine();
        return reject(false);
      }
    });
  }
}

module.exports = Extension;
