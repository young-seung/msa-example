import { Entity, Column } from 'typeorm';

@Entity()
export default class User {
  @Column({ unique: true, nullable: false })
  id!: string;

  @Column({ unique: true, nullable: false })
  accountId!: string;

  @Column({ unique: true, nullable: false })
  profileId!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false })
  createdAt!: Date;
}
