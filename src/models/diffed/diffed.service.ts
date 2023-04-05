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

  // TODO: @Stefanoberka create a interface to input
  async create(input): Promise<Diffed> {
    return this.diffedModel.create(input);
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
