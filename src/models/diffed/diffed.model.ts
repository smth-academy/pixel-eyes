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
    imgPath: string;
    @Column
    width: number;
    @Column
    height: number;
    @Column
    mse: number;
    @Column
    compt: number;
    @Column
    redPixels: number;
    @Column
    purplePixels: number;
    @Column
    yellowPixels: number;
    @Column
    misPixels: number;
    @Column
    totPixels: number;

    @ForeignKey(() => Sampler)
    samplerId: number
    @BelongsTo(() => Sampler, 'samplerId')
    sampler: Sampler;

    @ForeignKey(() => Sampler)
    differId: number
    @BelongsTo(() => Differ, 'differId')
    differ: Differ;
}