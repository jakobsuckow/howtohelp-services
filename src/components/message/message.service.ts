import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoggerService } from "../logger/logger.service";
import { CreateMessageDto } from "./message.dto";
import { MessageEntity } from "./message.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly loggerService: LoggerService
  ) {}

  async getMessagesBetween(sender: string, sendee: string): Promise<any> {
    this.loggerService.log(`Getting messages between ${sender} & ${sendee}`);
    const query = await this.messageRepository
      .createQueryBuilder("message")
      .innerJoinAndSelect("message.sender", "sender")
      .innerJoinAndSelect("message.sendee", "sendee")
      .where(":sender = ANY ( string_to_array(message.participants, ','))", { sender })
      .andWhere(":sendee = ANY ( string_to_array(message.participants, ','))", { sendee })
      .addOrderBy("message.date_created", "ASC")
      .getMany();
    return query;
  }

  async myConversations(id: string) {
    this.loggerService.log(`Getting messages for ${id}`);
    const query = await this.messageRepository
      .createQueryBuilder("message")
      .innerJoinAndSelect("message.sender", "sender")
      .innerJoinAndSelect("message.sendee", "sendee")
      .where(":id = ANY ( string_to_array(message.participants, ','))", { id })
      .addOrderBy("message.date_created")
      .getMany();
    return query;
  }

  async myContacts(id: string): Promise<any> {
    this.loggerService.log(`Getting Contacts for ${id}`);

    const query = await this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.sendee", "sendee")
      .select(["message.id", "sender.name", "sender.id", "sendee.id", "sendee.name"])
      .where(":id = ANY ( string_to_array(message.participants, ','))", { id })
      .addOrderBy("message.date_created", "ASC")
      .getRawMany();

    let contacts = new Set([]);

    for (let contact of query) {
      if (contact.sender_id === id) {
        contacts.add({ id: contact.sendee_id, name: contact.sendee_name });
      } else if (contact.sendee_id === id) {
        contacts.add({ id: contact.sender_id, name: contact.sender_name });
      }
      return [...new Set(Array.from(contacts))];
    }
  }

  async createMessage({ sender, sendee, body }): Promise<MessageEntity> {
    this.loggerService.log(`Sending message`);

    let message = new MessageEntity();
    message.body = body;
    message.sendee = sendee;
    message.sender = sender;
    message.participants = [sender, sendee];
    const savedMessage = await this.messageRepository.save(message);
    return savedMessage;
  }

  async unreadMessages(sender: string, sendee: string): Promise<number> {
    const query = await this.messageRepository
      .createQueryBuilder("message")
      .innerJoinAndSelect("message.sender", "sender")
      .innerJoinAndSelect("message.sendee", "sendee")
      .where(":sender = ANY ( string_to_array(message.participants, ','))", { sender })
      .andWhere(":sendee = ANY ( string_to_array(message.participants, ','))", { sendee })
      .andWhere(":message.read = false")
      .addOrderBy("message.date_created", "ASC")
      .getCount();
    return query;
  }
}
