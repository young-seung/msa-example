import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export default class UserEntity {
  @PrimaryColumn({ unique: true, nullable: false })
  public readonly id!: string;

  @Column({ nullable: false })
  public readonly createdAt!: Date;

  @Column({ nullable: true, default: null })
  public readonly updatedAt!: Date | null;

  @Column({ nullable: true, default: null })
  public readonly deletedAt!: Date | null;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
  }
}
