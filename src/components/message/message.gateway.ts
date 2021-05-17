import { Injectable } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Client, Server, Socket } from "socket.io";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";
import { UserService } from "../user/user.service";

let Users: any = [];
@Injectable()
@WebSocketGateway()
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private count: number = 0;
  constructor(
    @Logger("message")
    private readonly loggerService: LoggerService,
    private readonly userService: UserService
  ) {}

  @WebSocketServer()
  server: Server;

  public async afterInit(server: Socket): Promise<void> {
    this.loggerService.log("hi from afterInit");
    this.server.use(async (socket: Socket, next: any) => {
      try {
        const user = await this.userService.verifyToken(socket.handshake.query.token);

        Users[socket.client.id] = { clientId: socket.client.id, user: user };

        next();
      } catch (error) {
        new WsException("Invalid Credentials");
        this.loggerService.log("error at AfterInit");
      }
    });
  }

  public async handleConnection(client: Socket) {
    const user = Users[client.id].user;
    this.loggerService.log(`${user.name} has entered the room`);
  }
  public async handleDisconnect(client: Socket): Promise<void> {
    delete Users[client.id];
  }

  @SubscribeMessage("joined")
  public async handleJoined() {
    this.loggerService.log("hi");
  }

  @SubscribeMessage("message")
  public async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      accessToken: string;
    }
  ) {
    this.loggerService.log("hi");
    this.loggerService.log(data.accessToken);

    return client.emit("new-messages");
  }
}
