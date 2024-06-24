import { IsString, IsOptional, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @Length(1, 200)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  postId?: string;

  static createDtoFromEntity(entity: any) {
    const dto = new CreatePostDto();
    dto.postId = entity.postId;
    dto.title = entity.title;
    dto.content = entity.content;
    return dto;
  }

  static createDtosFromEntities(entities: any[]) {
    return entities.map((entity) => this.createDtoFromEntity(entity));
  }
}
