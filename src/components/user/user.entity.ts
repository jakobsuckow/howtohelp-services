import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MessageEntity } from "../message/message.entity";
import { PinEntity } from "../pin/pin.entity";
import * as bcrypt from "bcrypt";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";

export enum Role {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

@Entity("user")
export class UserEntity extends BaseEntity {
  @BeforeInsert()
  async hashEmail() {
    console.log(this.email);
    if (this.email) this.email = await bcrypt.hash(this.email, 10);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { nullable: true })
  name: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column({
    type: "simple-array",
    enum: Role,
    default: Role.Guest,
  })
  roles: Role[];

  @CreateDateColumn({
    select: false,
  })
  dateCreated: string;

  @OneToMany(() => PinEntity, pin => pin.userId, { nullable: true, cascade: true })
  pins: string[];

  @OneToMany(() => MessageEntity, message => message.sender)
  senderMessages: string[];

  @OneToMany(() => MessageEntity, message => message.sendee)
  sendeeMessages: string[];
}
