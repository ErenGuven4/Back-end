import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserProgress } from './progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
