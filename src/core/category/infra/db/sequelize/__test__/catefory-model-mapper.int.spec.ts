import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { SetupSequelize } from "../../../../../shared/infra/testing/helpers";

describe('CategoryModelMapper Integration Tests', () => {
   SetupSequelize({models: [CategoryModel]});

    it('should throws error when category is invalid', async () => {
        expect.assertions(2);
        const model = CategoryModel.build({
        category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
        name: 'a'.repeat(256),
        });
        try{
            CategoryModelMapper.toEntity(model)
            fail(
                'The category is valid, but it needs throws a LoadAggregateError');
        }catch(e) {
            expect(e).toBeInstanceOf(EntityValidationError)
            expect((e as EntityValidationError).error).toMatchObject([
                {
                    name: ['name must be shorter than or equal to 255 characters']
                }
            ])            
        }
    })
    it('should convert a category model to a category aggregate', async () => {
        const created_at = new Date();
        const model = CategoryModel.build({
            category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at,
        })
        const aggregate = CategoryModelMapper.toEntity(model);
        expect(aggregate.toJSON()).toStrictEqual(
            new Category({
                category_id: new Uuid('9366b7dc-2d71-4799-b91c-c64adb205104'),
                name: 'Movie',
                description: 'some description',
                is_active: true,
                created_at,
            }).toJSON()
        )
    })

    test('should convert a category aggregate to a category model', async ()=> {
        const created_at = new Date();
        const aggregate = new Category({
            category_id: new Uuid('9366b7dc-2d71-4799-b91c-c64adb205104'),
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at,
        })
        const model = CategoryModelMapper.toModel(aggregate);

        expect(model.toJSON()).toStrictEqual({
            category_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
            name: 'Movie',
            description: 'some description',
            is_active: true,
            created_at,
        })

    })
})