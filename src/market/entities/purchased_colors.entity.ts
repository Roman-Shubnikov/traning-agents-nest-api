import { UserEntity } from 'src/users/entities';
import {
    Entity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
  
@Entity('purchased_colors')
export class PurchasedColorEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.purchased_colors, { cascade: true })
    user: UserEntity;

    @Column()
    color: string;

    @Column()
    purchased_at: number;
}
  