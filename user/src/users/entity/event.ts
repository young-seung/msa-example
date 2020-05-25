import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export default class Event {
  @PrimaryColumn({ unique: true, nullable: false })
  id!: string;

  @Column({ nullable: false })
  userId!: string;

  @Column({ nullable: false })
  type!: string;

  @Column({ unique: true, nullable: false })
  createdAt!: Date;
}
