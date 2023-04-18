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

  // TODO: @Stefanoberka create a interface to input
  async create(input: DiffedCreationAttributes): Promise<Diffed> {
    // @ts-ignore TODO: @Stefanoberka fix this
    return this.diffedModel.create(input);
  }
}
