import {Optional } from 'sequelize';
export interface DifferAttributes {
  id: number;
  url?: string;
  imgPath?: string;
}

export type DifferCreationAttributes = Optional<DifferAttributes, 'id'>;
