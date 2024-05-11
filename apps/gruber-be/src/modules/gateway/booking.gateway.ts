import { CreateAssignBookingDriverMessageDto, updateBookingStatusDataSocketDto } from "@dtos";
import { Injectable, OnModuleInit, ValidationPipe } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_GRUBER_ENDPOINT, // client's origin
  },
})
export class BookingGateway implements OnModuleInit {
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

  sendAssignmentMessage(@MessageBody(new ValidationPipe()) body: CreateAssignBookingDriverMessageDto) {
    try {
      const { driver_id, booking_id, booking_route, message } = body;
      this.server.emit(`${driver_id}`, {
        msg: message,
        content: {
          booking_id,
          booking_route,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage("update-booking-status")
  updateBookingStatus(@MessageBody(new ValidationPipe()) body: updateBookingStatusDataSocketDto) {
    const { created_by, message, status } = body;
    this.server.emit(`${created_by}`, {
      msg: message,
      content: {
        status,
      },
    });
  }
}
