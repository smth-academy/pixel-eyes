import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Diffed } from './diffed.model';
import { DiffedCreationAttributes } from './diffed.interface';

@Injectable()
export class DiffedsService {
  constructor(
    @InjectModel(Diffed)
    private diffedModel: typeof Diffed,
  ) {}

  async create(input: DiffedCreationAttributes): Promise<Diffed> {
    return this.diffedModel.create(input);
  }

  async findAll(num: number): Promise<Diffed[]> {
    return this.diffedModel.findAll({
      order: [['createdAt', 'DESC']],
      limit: num,
    });
  }
}
