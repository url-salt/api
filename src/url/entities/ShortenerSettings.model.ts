import { Field, InputType } from "@nestjs/graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";

@InputType()
export class ShortenerSettings {
    @Field(() => String, { nullable: true })
    public title?: string | null;

    @Field(() => String, { nullable: true })
    public description?: string | null;

    @Field(() => GraphQLUpload, { nullable: true })
    public thumbnail?: Promise<FileUpload> | null;
}
