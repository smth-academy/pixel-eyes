import { Optional } from 'sequelize';
import { Sampler } from './sampler.model';

export type SamplerAttributes = {
  id: number;
  url?: string;
  imgPath?: string;
};

export type SamplerCreationAttributes = Optional<SamplerAttributes, 'id'>;

// export interface SamplerCreateDTO extends Optional<Sampler, 'id'> {
//   id: number;
//   url?: string;
//   imgPath?: string;
// }
