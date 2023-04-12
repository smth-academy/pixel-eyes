import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sampler } from './sampler.model';
import { SamplerCreationAttributes } from './sampler.interface';

@Injectable()
export class SamplersService {
  constructor(
    // Init the sampler model to use in functions
    @InjectModel(Sampler)
    private samplerModel: typeof Sampler,
  ) {}

  // TODO: @Stefanoberka create an interface to input
  async create(input: SamplerCreationAttributes): Promise<Sampler> {
    return this.samplerModel.create(input);
  }

  findOne(url: string): Promise<Sampler> {
    return this.samplerModel.findOne({
      where: {
        url: url,
      },
    });
  }

  // todo: @Stefanoberka implement update function
}
