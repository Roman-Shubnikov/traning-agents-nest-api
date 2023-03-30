import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RoleEnum } from '@app/core/enums';
import { FileEntity } from 'src/storage/entities/file.entity';

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vk_user_id: number;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.AGENT })
  permissions: number;

  @Column({ default: 0 })
  mark_day: number;

  @Column({ default: 0 })
  generator: number;

  @Column({ default: null })
  nickname: string;

  @Column({ default: 0 })
  last_activity: number;

  @Column({ default: 0 })
  registered: number;

  @Column({ default: 0 })
  good_answers: number;

  @Column({ default: 0 })
  bad_answers: number;

  @Column({ default: 0 })
  total_answers: number;

  @Column({ default: 1 })
  avatar_id: number;

  @Column({ default: 0 })
  money: number;

  @Column({ default: 0 })
  donuts: number;

  @Column({ default: 0 })
  verified: number;

  @Column({ default: 0 })
  flash: number;

  @Column({ default: 0 })
  age: number;

  @Column({ default: 0 })
  scheme: number;

  @Column({ default: 0 })
  donut: number;

  @Column({ default: 0 })
  diamond: number;

  @Column({ default: null })
  publicStatus: string;

  @OneToMany(() => FileEntity, (file) => file.owner)
  files: FileEntity[];

  @Column({ default: 0 })
  coff_active: number;

  @Column({ default: 0 })
  exp: number;

  @Column({ default: 1 })
  lvl: number;

  @OneToOne(() => FileEntity, { onDelete: "SET NULL"})
  @JoinColumn()
  avatar: FileEntity;
}
