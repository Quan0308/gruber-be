import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_GRUBER_ENDPOINT, // client's origin
    methods: ["GET", "POST"],
  },
})
export class GruberGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on("connection", (socket) => {
      console.log("connected to the socket with id:", socket.id);
    });
  }

  //"message": name of the event that the client will send to the server, server will listen to this name of event
  @SubscribeMessage("message")
  handleMessage(@MessageBody() body: any) {
    //"onMessage": name of the event that the server will send to the client, client will listen to this name of event
    this.server.emit("onMessage", {
      msg: "New message from the server",
      content: body,
    });
    console.log(body);
  }
}
