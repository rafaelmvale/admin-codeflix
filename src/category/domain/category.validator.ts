import { MaxLength } from 'class-validator';
import { Category } from './category.aggregate';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';

//criar um testes que verifique os decorators
export class CategoryRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(entity:Category) {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}