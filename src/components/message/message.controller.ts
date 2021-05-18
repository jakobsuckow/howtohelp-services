import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.decorator";
import { UserEntity } from "../user/user.entity";
import { CreateMessageDto } from "./message.dto";
import { MessageEntity } from "./message.entity";
import { MessageService } from "./message.service";

@ApiTags("message")
@Controller("message")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ description: "Getting my Conversations" })
  @ApiBearerAuth()
  @HttpCode(200)
  async getMyConvos(@User() user: UserEntity) {
    return await this.messageService.myConversations(user.id);
  }

  @Get("/contacts")
  @ApiOperation({ description: "Getting all contacts" })
  @ApiBearerAuth()
  @HttpCode(200)
  async contacts(@User() user: UserEntity) {
    return await this.messageService.myContacts(user.id);
  }

  @Get(":id")
  @ApiOperation({ description: "Getting all messages between two parties" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @HttpCode(200)
  async getAll(@User() user: UserEntity, @Param("id") sendee: string): Promise<MessageEntity[]> {
    return await this.messageService.getMessagesBetween(user.id, sendee);
  }

  @Get(":id/unread")
  @ApiOperation({ description: "Getting unread messages between two parties" })
  @ApiBearerAuth()
  @ApiParam({ name: "id" })
  @HttpCode(200)
  async getUnreadMessages(@User() user: UserEntity, @Param("id") sendee: string): Promise<number> {
    return await this.messageService.unreadMessages(user.id, sendee);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiOperation({ description: "Creating a message between two parties" })
  @ApiBody({ type: CreateMessageDto })
  async createMessage(@User() user: UserEntity, @Body() messageDto: CreateMessageDto) {
    const { body, sendee } = messageDto;
    return await this.messageService.createMessage({
      sender: user.id,
      sendee,
      body,
    });
  }
}
