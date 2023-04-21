import { Optional } from 'sequelize';

export type SamplerAttributes = {
  id: number;
  url?: string;
  imgPath?: string;
};

export type SamplerCreationAttributes = Optional<SamplerAttributes, 'id'>;
