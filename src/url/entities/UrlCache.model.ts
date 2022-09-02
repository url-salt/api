import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Field } from "@nestjs/graphql";

import { Nullable } from "@utils/types";

@Entity({ name: "url-caches" })
export class UrlCache {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "text", nullable: true })
    public title!: Nullable<string>;

    @Field(() => String)
    @Column({ type: "text", nullable: true })
    public description!: Nullable<string>;

    @Field(() => String)
    @Column({ type: "text", nullable: true })
    public image!: Nullable<string>;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;
}
