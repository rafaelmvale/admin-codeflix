import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import {  SetupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { GetCategoryUseCase } from "../get-category.use-case"

describe('GetCategoryUseCase Integration Tests', () => {
    let useCase: GetCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    SetupSequelize({models : [CategoryModel]})

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new GetCategoryUseCase(repository);
    })

    it('should throws error when entity not found', async () => {
        const uuid = new Uuid()
        await expect(() => useCase.execute({id: uuid.id})).rejects.toThrow(
            new NotFoundError(uuid.id, Category)
        )
    })
    it('should returns a category', async ()=> {
        const category = Category.fake().aCategory().build()
        await repository.insert(category)
        const output = await useCase.execute({id: category.category_id.id})
        expect(output).toStrictEqual({
            id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at
        })
    })

})