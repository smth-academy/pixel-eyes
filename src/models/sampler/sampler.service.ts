import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sampler } from './sampler.model';
import { where } from 'sequelize';

@Injectable()
export class SamplersService {
  constructor(
    // Init the sampler model to use in functions
    @InjectModel(Sampler)
    private samplerModel: typeof Sampler,
  ) {}
  // FindAll() always returns an array
  async findAll(): Promise<Sampler[]> {
    return this.samplerModel.findAll();
  }

  // TODO: @Stefanoberka create an interface to input
  async create(input): Promise<Sampler> {
    return this.samplerModel.create(input);
  }
  // findOne returns a field if found and null if not
  findOne(id: string): Promise<Sampler> {
    return this.samplerModel.findOne({
      where: {
        id,
      },
    });
  }

  getHello(options: any): string {
    return JSON.stringify(options);
  }

  // async findOrCreate(id: string, created: boolean): Promise<Sampler> {
  //   return this.samplerModel.findOrCreate({
  //     where: {
  //       id,
  //     }
  //   });
  // }

  // Remove/overrides sampler
  async remove(id: string): Promise<void> {
    const sampler = await this.findOne(id);
    await sampler.destroy();
  }
}
