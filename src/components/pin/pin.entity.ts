import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../user/user.entity";

//https://github.com/typeorm/typeorm/blob/master/docs/listeners-and-subscribers.md

export class GeoJSON {
  type: string;
  coordinates: number[];
}

export class Properties {
  id: string;
  type: string;
}

export enum Trait {
  DogWalking = "dogwalking",
  Delivery = "delivery",
  Food = "food",
  Shopping = "shopping",
  Cleaning = "cleaning",
  CovidKnowledege = "covidknowledge",
  Donations = "donations",
  Maintenance = "maintenance",
}

export enum Type {
  Hand = "hand",
  Heart = "heart",
}

@Entity()
export class PinEntity extends BaseEntity {
  @BeforeInsert()
  updateDates() {
    this.dateCreated = new Date();
  }

  @BeforeUpdate()
  updateDateUpdated() {
    this.dateUpdated = new Date();
  }

  @PrimaryGeneratedColumn("increment")
  primaryId: string;

  @Column({ type: "timestamp" })
  dateCreated: Date;

  @Column({ type: "timestamp", nullable: true })
  dateUpdated: Date;

  @Column({ default: "Feature" })
  type: string;

  @Column({ type: "geography" })
  @Index({ spatial: true })
  geometry: GeoJSON;

  @Column({ type: "simple-json" })
  properties: Properties;

  @Column("varchar", { nullable: false })
  name: string;

  @Column("varchar", { nullable: false })
  address: string;

  @Column("varchar", { nullable: false })
  city: string;

  @Column("boolean", { default: false })
  approved: boolean;

  @Column({ type: "simple-array" })
  traits: Array<string>;

  @Column("varchar", { nullable: true })
  suggestion: string;

  @ManyToOne(() => UserEntity, user => user.pins, { cascade: ["insert", "update"] })
  @JoinColumn({ name: "userId" })
  userId: string;
}

export class PinDetail extends PinEntity {
  name: string;
  dateCreated: Date;
  properties: Properties;
  traits: Array<string>;
  city: string;
}
