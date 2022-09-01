import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Field, ObjectType, Int } from "@nestjs/graphql";

@Entity({ name: "url-entries" })
@ObjectType()
export class UrlEntry {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public uniqueId!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public originalUrl!: string;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;
}
