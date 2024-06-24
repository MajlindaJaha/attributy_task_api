import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDto(dtoClass: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req.body);
    validate(dtoObject).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints!).join(", ")
        );
        return res.status(400).json({ message: errorMessages.join(", ") });
      } else {
        req.body = dtoObject;
        next();
      }
    });
  };
}
