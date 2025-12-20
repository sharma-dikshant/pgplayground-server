import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  table: string;

  @Column()
  created_at: string;
  @Column()
  updated_at: string;
  @Column()
  deleted_at: string;
}
