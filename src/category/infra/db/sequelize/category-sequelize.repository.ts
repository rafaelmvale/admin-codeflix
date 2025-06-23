import { Op } from "sequelize";
import { Entity } from "../../../../shared/domain/entity";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";


export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ['name', 'created_at'];

    constructor(private categoryMode: typeof CategoryModel) {}
    
    async insert(entity: Category): Promise<any> {
        await this.categoryMode.create({
            category_id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        })
    }
    async bulkInsert(entities: Category[]): Promise<any> {
        await this.categoryMode.bulkCreate(entities.map((entity) => ({
            category_id: entity.category_id.id,
            name: entity.name, 
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        }))
    )
    }
    async update(entity: Category): Promise<any> {
        const id = entity.category_id.id
        const model = await this._get(id);

        if(!model) {
            throw new NotFoundError(id, this.getEntity())
        }
        await this.categoryMode.update(
            {
                category_id: entity.category_id.id,
                name: entity.name,
                description: entity.description,
                is_active: entity.is_active,
                created_at: entity.created_at,
            },
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
        if(!model) {
            return null;
        }
        return new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
        })
    }

    private async _get(id: string ) {
        return await this.categoryMode.findByPk(id);

    }

    async findAll(): Promise<Category[]> {
        const model = await this.categoryMode.findAll();
        return model.map((model) => new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
        }))
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
                return new Category({
                    category_id: new Uuid(model.category_id),
                    name: model.name,
                    description: model.description,
                    is_active: model.is_active,
                    created_at: model.created_at
                })
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