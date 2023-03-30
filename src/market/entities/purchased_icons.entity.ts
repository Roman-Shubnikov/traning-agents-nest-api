import { UserEntity } from 'src/users/entities';
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
  
@Entity('purchased_icons')
export class PurchasedIconEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
    user: UserEntity;

    @Column()
    icon_name: string;

    @Column()
    purchased_at: number;
}
  