import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Field, ObjectType, Int } from "@nestjs/graphql";

@Entity({ name: "started-time" })
@ObjectType()
export class StartedTime {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => Date)
    @Column({ type: "datetime" })
    public startedAt!: Date;
}
