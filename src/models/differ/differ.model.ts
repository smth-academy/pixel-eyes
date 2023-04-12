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
    url: string;
    @Column
    imgPath: string;
}
