import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("city")
export class City {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ type: "float8" })
  longitude: number;

  @Column({ type: "float8" })
  latitude: number;
}
