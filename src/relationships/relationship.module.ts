import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { Relationship } from './relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship])],
  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
