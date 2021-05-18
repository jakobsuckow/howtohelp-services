import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("message")
export class MessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  date_created: Date;

  @Column({ type: "varchar", nullable: false })
  body: string;

  @ManyToOne(() => UserEntity, user => user.senderMessages, { eager: true })
  sender: string;

  @ManyToOne(() => UserEntity, user => user.sendeeMessages, { eager: true })
  sendee: string;

  @Column("simple-array", { nullable: true })
  participants: Array<string>;

  @Column({ type: "boolean", default: false })
  read: boolean;
}

export interface ConversationData {}
