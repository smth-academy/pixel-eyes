import { Optional } from 'sequelize';

export type DiffedAttributes = {
  id: number;
  imgPath: string;
  width: number;
  height: number;
  mse: number;
  compt: number;
  redPixels: number;
  purplePixels: number;
  yellowPixels: number;
  misPixels: number;
  totPixels: number;
}


export type DiffedCreationAttributes = Optional<DiffedAttributes, 'id'>;
