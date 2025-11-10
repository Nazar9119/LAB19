import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true }) // Убираем TypeScript union тип, используем только настройки TypeORM
  description: string; // Просто string, но nullable: true позволяет null

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
 updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}