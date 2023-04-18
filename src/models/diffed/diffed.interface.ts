import { Optional } from 'sequelize';

export type DiffedAttributes = {
  id: string;
  mse: number;
  redPixels: number;
  misPixels: number;
  imgPath: string;
}


export type DiffedCreationAttributes = Optional<DiffedAttributes, 'id'>;
