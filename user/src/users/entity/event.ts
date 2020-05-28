import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export default class Event {
  @PrimaryColumn({ unique: true, nullable: false })
  public readonly id!: string;

  @Column({ nullable: false })
  public readonly userId!: string;

  @Column({ nullable: false })
  public readonly type!: string;

  @Column({ nullable: false })
  public readonly createdAt!: Date;

  constructor(id: string, userId: string, type: string) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.createdAt = new Date();
  }
}
