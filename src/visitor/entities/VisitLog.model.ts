import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";

import { Field, ObjectType, Int } from "@nestjs/graphql";

import { UrlEntry } from "@url/entities/URLEntry.model";

import { Nullable } from "@utils/types";

@Entity({ name: "visit-logs" })
@ObjectType()
export class VisitLog {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 35 })
    public ip!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public userAgent!: string;

    @Field(() => Boolean)
    @Column({ type: "boolean" })
    public isBot!: boolean;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    public timezone: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    public country: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 15, nullable: true })
    public countryCode: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    public browser: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    public browserVersion: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    public os: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    public osVersion: Nullable<string>;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;

    //
    // Relation (Many-to-One) - UrlEntry => VisitLog
    //
    @ManyToOne(() => UrlEntry, urlEntry => urlEntry.visitLogs)
    public urlEntry!: UrlEntry;

    @RelationId((entity: VisitLog) => entity.urlEntry)
    public urlEntryId!: UrlEntry["id"];
}
