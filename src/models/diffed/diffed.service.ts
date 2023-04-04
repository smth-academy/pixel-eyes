import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Diffed } from './diffed.model';

@Injectable()
export class DiffedsService {
  constructor(
    @InjectModel(Diffed)
    private diffedModel: typeof Diffed,
  ) {}

  async findAll(): Promise<Diffed[]> {
    return this.diffedModel.findAll();
  }

  async create(): Promise<Diffed> {
    return this.diffedModel.create({
      name: 'Test',
    });
  }

  findOne(id: string): Promise<Diffed> {
    return this.diffedModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const diffed = await this.findOne(id);
    await diffed.destroy();
  }
}
