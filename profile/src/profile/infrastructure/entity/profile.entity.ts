import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'profile' })
export default class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 500 })
  name!: string;

  @Column({ length: 500, unique: true })
  email!: string;

  @Column({ type: 'datetime', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: null, name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'datetime', default: null, name: 'deleted_at' })
  deletedAt!: Date;
}
