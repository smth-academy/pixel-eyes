/* eslint-disable prettier/prettier */
import { IntegerDataType, FloatDataType, BigIntDataType, FloatDataTypeOptions, StringDataType, DateDataType } from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Sampler } from '../sampler/sampler.model';
import { Differ } from '../differ/differ.model';

// Declare table
@Table
export class Diffed extends Model<Diffed> {
    @Column({    
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    @Column
    diffRate: number;
    @Column
    diffAbs: number;
    @Column
    similarityRate: number;
    @Column
    timeDate: Date
    @Column
    imgPath: string;

    @ForeignKey(() => Sampler)
    samplerId: number
    @BelongsTo(() => Sampler, 'samplerId')
    sampler: Sampler;

    @ForeignKey(() => Sampler)
    differId: number
    @BelongsTo(() => Differ, 'differId')
    differ: Differ;
}