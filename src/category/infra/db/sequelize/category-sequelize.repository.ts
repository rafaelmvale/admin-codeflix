import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";


export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ['name', 'created_at'];

    constructor(private categoryMode: typeof CategoryModel) {}
    
    async insert(entity: Category): Promise<void> {
        const modelProps = CategoryModelMapper.toModel(entity);
        await this.categoryMode.create(modelProps.toJSON())
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        const modelsProps = entities.map((entity) => 
            CategoryModelMapper.toModel(entity).toJSON());

        await this.categoryMode.bulkCreate(modelsProps)
    }

    async update(entity: Category): Promise<void> {
        const id = entity.category_id.id
        const model = await this._get(id);

        if(!model) {
            throw new NotFoundError(id, this.getEntity())
        }

        const modelToUpdate = CategoryModelMapper.toModel(entity);

        await this.categoryMode.update(modelToUpdate.toJSON(),
            {
                where: {
                    category_id: id,
                }
            }
        )

    }
    async delete(entity_id: Uuid): Promise<any> {
                const id = entity_id.id
        const model = await this._get(id);

        if(!model) {
            throw new NotFoundError(id, this.getEntity())
        }

        await this.categoryMode.destroy({
            where: {
                category_id: id,
            }
        })
    }

    async findById(entity_id: Uuid): Promise<Category | null> {
        const model = await this._get(entity_id.id);
        return model ? CategoryModelMapper.toEntity(model) : null;
    }

    private async _get(id: string ) {
        return await this.categoryMode.findByPk(id);

    }

    async findAll(): Promise<Category[]> {
        const model = await this.categoryMode.findAll();
        return model.map((model) => {
            return CategoryModelMapper.toEntity(model);
        })
    }


    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;
        const { rows: models, count } = await this.categoryMode.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: { [Op.like]: `%${props.filter}%` },
                },
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? { order: [[props.sort, (props.sort_dir ?? 'ASC').toUpperCase() as 'ASC' | 'DESC']] }
                : { order: [['created_at', 'DESC']] }),
            offset,
            limit, 
        });
        return new CategorySearchResult({
            items: models.map((model) => {
              return CategoryModelMapper.toEntity(model);
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        })
    }
    getEntity(): new (...args: any[]) => Category {
       return Category
    }
    
}