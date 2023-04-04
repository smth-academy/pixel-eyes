/* eslint-disable prettier/prettier */
import { IntegerDataType, FloatDataType, BigIntDataType, FloatDataTypeOptions, StringDataType, DateDataType } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { Sampler } from '../sampler/sampler.model';
import { Differ } from '../differ/differ.model';

// Declare table
@Table
export class Diffed extends Model {
    @Column({    
        primaryKey: true,
        autoIncrement: true
    })
    diffed_id: IntegerDataType
    @Column
    diffRate: FloatDataType
    @Column
    diffAbs: BigIntDataType
    @Column
    similarityRate: FloatDataTypeOptions
    decimals: 4
    @Column
    timeDate: DateDataType
    @Column
    imgPath: StringDataType
}

// Foreign key to sampler
Diffed.belongsTo(Sampler, {
    foreignKey: "sampler",
    targetKey: "sampler_id"
})
// Foreign key to differ
Diffed.belongsTo(Differ, {
    foreignKey: "differ",
    targetKey: "differ_id"
})