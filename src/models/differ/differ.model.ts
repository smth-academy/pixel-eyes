/* eslint-disable prettier/prettier */
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Differ extends Model {
    @Column({    
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
    @Column
    value: string;
    @Column
    timeDate: Date;
    @Column
    imgPath: string;
    @Column
    sampler: string;
}
