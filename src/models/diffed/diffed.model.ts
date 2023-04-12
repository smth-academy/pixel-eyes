/* eslint-disable prettier/prettier */
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
    mse: number;
    @Column
    redPixels: number;
    @Column
    misPixels: number;
    @Column
    totPixels: number;
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