/* eslint-disable prettier/prettier */
import { DateDataType, IntegerDataType, StringDataType } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Differ extends Model {
    @Column({    
        primaryKey: true,
        autoIncrement: true
    })
    differ_id: IntegerDataType
    @Column
    value: StringDataType
    @Column
    timeDate: DateDataType
    @Column
    imgPath: StringDataType
    @Column
    sampler: StringDataType
}
