import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";

import { Field, ObjectType, Int } from "@nestjs/graphql";

import { VisitLog } from "@visitor/entities/VisitLog.model";
import { File } from "@file/entities/File.model";
import { UrlCache } from "@url/entities/UrlCache.model";

import { Nullable } from "@utils/types";

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

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public title!: Nullable<string>;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public description!: Nullable<string>;

    @Column({ type: "int", unique: true })
    public indexNo!: number;

    @Field(() => Date)
    @CreateDateColumn()
    public createdAt!: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    public updatedAt!: Date;

    //
    // Relation (One-to-One) - File => UrlEntry
    //
    @OneToOne(() => File, { nullable: true })
    @JoinColumn()
    public file!: Nullable<File>;

    @RelationId((entity: UrlEntry) => entity.file)
    public fileId!: Nullable<File["id"]>;

    //
    // Relation (One-to-One) - UrlCache => UrlEntry
    //
    @OneToOne(() => UrlCache, { nullable: true })
    @JoinColumn()
    public cache!: Nullable<UrlCache>;

    @RelationId((entity: UrlEntry) => entity.cache)
    public cacheId!: Nullable<UrlCache["id"]>;

    //
    // Relation (One-to-Many) - VisitLog => UrlEntry
    //
    @OneToMany(() => VisitLog, visitLog => visitLog.urlEntry)
    public visitLogs!: VisitLog[];
}
