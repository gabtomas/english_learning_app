import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { VocabularyWord } from './vocabulary.entity';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  correctAnswers: number;

  @Column({ default: 0 })
  incorrectAnswers: number;

  @Column({ default: 1 })
  box: number; // Leitner system boxes 1-5

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  nextReviewDate: Date;

  @Column({ type: 'datetime', nullable: true })
  lastReviewed: Date;

  @ManyToOne(() => VocabularyWord, (word) => word.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wordId' })
  word: VocabularyWord;

  @Column()
  wordId: number;
}
