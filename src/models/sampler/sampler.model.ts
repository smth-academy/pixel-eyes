/* eslint-disable prettier/prettier */
import { Column, Model, Table } from 'sequelize-typescript';
import { SamplerAttributes, SamplerCreationAttributes } from './sampler.interface';

@Table
export class Sampler extends Model<SamplerAttributes, SamplerCreationAttributes> {
  @Column({    
    primaryKey: true,
    autoIncrement: true
  })
  id: number;
  @Column
  url: string;
  @Column
  imgPath: string;
}
