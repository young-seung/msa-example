import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export default class EventEntity {
  @PrimaryColumn({ unique: true, nullable: false })
  public readonly id!: string;

  @Column({ nullable: false })
  public readonly userId!: string;

  @Column({ nullable: false })
  public readonly email!: string;

  @Column({ nullable: false })
  public readonly password!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  public readonly fileId!: string | null;

  @Column({ nullable: false })
  public readonly type!: string;

  @Column({ nullable: false })
  public readonly createdAt!: Date;

  constructor(
    id: string,
    userId: string,
    email: string,
    password: string,
    fileId: string | null,
    type: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.fileId = fileId;
    this.type = type;
    this.createdAt = new Date();
  }
}
