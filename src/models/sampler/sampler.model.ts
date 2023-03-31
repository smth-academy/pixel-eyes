import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Sampler extends Model {
  @Column
  name: string;
}
