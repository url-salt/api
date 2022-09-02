import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Field, ObjectType, Int } from "@nestjs/graphql";

@Entity({ name: "files" })
@ObjectType()
export class File {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public name!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 100 })
    public mime!: string;

    @Field(() => Int)
    @Column({ type: "int" })
    public size!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 25 })
    public extension!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public bucketName!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public region!: string;

    @Field(() => Int)
    @Column({ type: "int" })
    public width!: number;

    @Field(() => Int)
    @Column({ type: "int" })
    public height!: number;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;
}
