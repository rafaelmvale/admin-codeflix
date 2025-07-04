import { SetupSequelize } from "@core/shared/infra/testing/helpers";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe('DeleteCategoryUseCase Integration Tests', () => {
    let useCase: DeleteCategoryUseCase;
    let repository: CategorySequelizeRepository;

    SetupSequelize({ models: [CategoryModel]})

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new DeleteCategoryUseCase(repository);
    })

    it('should throws error when entity not found', async () => {
        const uuid = new Uuid()
        await expect(() => useCase.execute({ id: uuid.id})).rejects.toThrow(
            new NotFoundError(uuid.id, Category)
        )
    })
    it('should delete a category', async () => {
        const category = Category.fake().aCategory().build()
        await repository.insert(category)
        await useCase.execute({ id: category.category_id.id })
        
        expect(await CategoryModel.findByPk(category.category_id.id)).toBeNull()
    
    })
})