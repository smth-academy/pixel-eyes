import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sampler } from './sampler.model';

@Injectable()
export class SamplersService {
  constructor(
    @InjectModel(Sampler)
    private samplerModel: typeof Sampler,
  ) {}

  async findAll(): Promise<Sampler[]> {
    return this.samplerModel.findAll();
  }

  async create(): Promise<Sampler> {
    return this.samplerModel.create({
      name: 'Test',
    });
  }

  findOne(id: string): Promise<Sampler> {
    return this.samplerModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const sampler = await this.findOne(id);
    await sampler.destroy();
  }
}
