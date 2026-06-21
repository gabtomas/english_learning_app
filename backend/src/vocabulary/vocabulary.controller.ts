import { Controller, Get, Post, Body, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';

@Controller('api/vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('words')
  async getWords(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.vocabularyService.getWords(category, difficulty);
  }

  @Get('quiz')
  async getQuiz(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('direction') direction?: 'en_to_cs' | 'cs_to_en',
  ) {
    return this.vocabularyService.getQuiz(limit, category, direction);
  }

  @Post('quiz/answer')
  async submitAnswer(
    @Body('wordId', ParseIntPipe) wordId: number,
    @Body('isCorrect') isCorrect: boolean,
  ) {
    return this.vocabularyService.submitAnswer(wordId, isCorrect);
  }

  @Get('stats')
  async getStats() {
    return this.vocabularyService.getStats();
  }
}
