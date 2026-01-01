import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_schema')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'user_id', nullable: false, unique: true })
  userId: string;

  @Column({ name: 'role', nullable: false, unique: true })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
