import { Optional } from 'sequelize';

export type DiffedAttributes = {
  id: string;
  mse: number;
  redPixels: number;
  purplePixels: number;
  yellowPixels: number;
  totPixels: number;
  misPixels: number;
  imgPath: string;
  compt: number;
}


export type DiffedCreationAttributes = Optional<DiffedAttributes, 'id'>;
