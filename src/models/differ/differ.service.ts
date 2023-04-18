import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Differ } from './differ.model';
import { DifferCreationAttributes } from './differ.interface';

@Injectable()
export class DiffersService {
  constructor(
    @InjectModel(Differ)
    private differModel: typeof Differ,
  ) {}

  // TODO: @Stefanoberka create a interface to input
  async create(input: DifferCreationAttributes): Promise<Differ> {
        // @ts-ignore TODO: @Stefanoberka fix this
    return this.differModel.create(input);
  }

  findOne(id: string): Promise<Differ> {
    return this.differModel.findOne({
      where: {
        id,
      },
    });
  }
}
