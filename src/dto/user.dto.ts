import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  id?: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  static createDtoFromEntity(entity: any) {
    const dto = new CreateUserDto();
    dto.id = entity._id;
    dto.username = entity.username;
    dto.email = entity.email;
    dto.password = entity.password;
    return dto;
  }
  static createDtosFromEntities(entities: any[]) {
    return entities.map((entity) => this.createDtoFromEntity(entity));
  }
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
