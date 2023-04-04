/* eslint-disable prettier/prettier */
import { IntegerDataType, DateDataType, StringDataType } from 'sequelize';
// import { DataTypes, Sequelize } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Sampler extends Model {
  @Column({    
    primaryKey: true,
    autoIncrement: true
  })
  sampler_id: IntegerDataType
  @Column
  value: StringDataType
  @Column
  timeDate: DateDataType
  @Column
  imgPath: StringDataType
}
