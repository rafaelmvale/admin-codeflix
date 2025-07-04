import { Entity } from "../entity";
import { ValueObject } from "../value-objects";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
    insert(entity: E): Promise<any>;
    bulkInsert(entities: E[]): Promise<any>;
    update(entity: E): Promise<any>;
    delete(entity_id: EntityId): Promise<any>;

    findById(entity_id: EntityId): Promise<E | null>;
    findAll(): Promise<E[]>;

    getEntity(): new (...args: any[]) => E;

}

export interface ISearchableRepository<
E extends Entity, 
EntityId extends ValueObject,
Filter = string, 
SearchInput = SearchParams<Filter>, 
SearchOutput = SearchResult
> extends IRepository<E, EntityId>{
    sortableFields: string[];
    search(props: SearchInput): Promise<SearchOutput>;
}