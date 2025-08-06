import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relationship } from './relationship.entity';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
  ) {}

  async importRelationshipFromCSV(): Promise<void> {
    const filePath = path.resolve(
      __dirname,
      '../../src/data/relationships.csv',
    );
    const results: Relationship[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          if (Object.values(data).every((value) => value === '')) return;
          const relationship = this.relationshipRepository.create({
            company_code: data.company_code,
            parent_company: data.parent_company,
          });

          results.push(relationship);
        })
        .on('end', async () => {
          await this.relationshipRepository.save(results);
          resolve();
        })
        .on('error', reject);
    });
  }

  async deleteAllRelationships(): Promise<void> {
    await this.relationshipRepository.clear(); // 清空整个表的数据
  }
}
