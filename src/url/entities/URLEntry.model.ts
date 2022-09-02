import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from "typeorm";

import { Field, ObjectType, Int } from "@nestjs/graphql";

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

    @Field(() => String)
    @Column({ type: "text", nullable: true })
    public title!: string;

    @Field(() => String)
    @Column({ type: "text", nullable: true })
    public description!: string;

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
}
