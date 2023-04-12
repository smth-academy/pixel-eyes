import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Differ } from './differ.model';
import { DifferCreateDTO } from './differ.interface';

@Injectable()
export class DiffersService {
  constructor(
    @InjectModel(Differ)
    private differModel: typeof Differ,
  ) {}

  // TODO: @Stefanoberka create a interface to input
  async create(input: DifferCreateDTO): Promise<Differ> {
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
