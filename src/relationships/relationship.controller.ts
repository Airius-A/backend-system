import { Controller, Get, Delete } from '@nestjs/common';
import { RelationshipService } from './relationship.service';

@Controller('relationship')
export class RelationshipController {
  constructor(private readonly RelationshipService: RelationshipService) {}

  @Get('import')
  async importRelationshipData() {
    await this.RelationshipService.importRelationshipFromCSV();
    return 'Relationship data imported!';
  }

  @Delete('delete-all')
  async deleteAll() {
    await this.RelationshipService.deleteAllRelationships();
    return 'all relationship data has been deleted!';
  }
}
