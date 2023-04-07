/* eslint-disable prettier/prettier */
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Sampler extends Model {
  @Column({    
    primaryKey: true,
    autoIncrement: true
  })
  id: number;
  @Column
  value: string;
  @Column
  imgPath: string;
}
