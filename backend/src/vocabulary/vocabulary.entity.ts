import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserProgress } from './progress.entity';

@Entity()
export class VocabularyWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  english: string;

  @Column()
  czech: string;

  @Column()
  category: string; // e.g. 'programming', 'database', 'networking', 'security', 'devops'

  @Column({ nullable: true })
  definition: string; // Definition or explanation in English

  @Column({ nullable: true })
  example: string; // Example sentence in English

  @Column({ default: 'medium' })
  difficulty: string; // 'easy', 'medium', 'hard'

  @OneToMany(() => UserProgress, (progress) => progress.word, { cascade: true })
  progress: UserProgress[];
}
