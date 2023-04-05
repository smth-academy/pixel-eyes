import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Differ } from './differ.model';

@Injectable()
export class DiffersService {
  constructor(
    @InjectModel(Differ)
    private differModel: typeof Differ,
  ) {}

  async findAll(): Promise<Differ[]> {
    return this.differModel.findAll();
  }

  // TODO: @Stefanoberka create a interface to input
  async create(input): Promise<Differ> {
    return this.differModel.create(input);
  }

  findOne(id: string): Promise<Differ> {
    return this.differModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const differ = await this.findOne(id);
    await differ.destroy();
  }
}
