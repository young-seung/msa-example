import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 500 })
  name!: string;

  @Column({ length: 500, unique: true })
  email!: string;

  @Column({ length: 500})
  password!: string;

  @Column({ type: 'datetime', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: null, name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'datetime', default: null, name: 'deleted_at' })
  deletedAt!: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  comparePassword(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
