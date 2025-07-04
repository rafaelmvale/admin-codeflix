import { IsNotEmpty, IsString, validateSync } from "class-validator";

export type UpdateCategoryInputConstructorProps = {
    id: string;
    name?: string;
    description?: string | null;
    is_active?: boolean;

}

export class UpdateCategoryInput {
   @IsString()
   @IsNotEmpty()
   id!: string;

   @IsString()
   @IsNotEmpty()
   name?: string;

   @IsString()
   @IsNotEmpty()
   description?: string | null;

   @IsNotEmpty()
   is_active?: boolean;
   
   
   constructor(props?: UpdateCategoryInputConstructorProps) {
    if(!props) return;
    this.id = props.id;
    props.name && (this.name == props.name);
    props.description && (this.description == props.description);
    props.is_active !== null && 
    this.is_active !== undefined && 
    (this.is_active = props.is_active)
   }
}


export class ValidateUpdateCategoryInput {
    static validate(input: UpdateCategoryInput) {
        return validateSync(input)
    }
}
