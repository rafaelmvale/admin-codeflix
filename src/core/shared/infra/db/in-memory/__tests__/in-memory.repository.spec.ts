import { InMemoryRepository } from "../in-memory.repository";
import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";


type StubEntityConstructor = {
    entity_id?: Uuid;
    name: string;
    price: number;
}


class StubEntity extends Entity {
    entity_id: Uuid;
    name: string;
    price: number;

    constructor(props: StubEntityConstructor) {
        super();
        this.entity_id = props.entity_id ?? new Uuid();
        this.name = props.name;
        this.price = props.price;
    }

    toJSON() {
        return {
            entity_id: this.entity_id,
            name: this.name,
            price: this.price,
        };
    }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
    getEntity(): new (...args: any[]) => StubEntity {
        return StubEntity;
    }
}

describe("InMemoryRepository Unit Tests", () => { 
    let repo: StubInMemoryRepository;

    beforeEach(() => {
        repo = new StubInMemoryRepository();
    });
    it("should insert an entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Product 1",
            price: 100,
        });

        await repo.insert(entity);
        expect(repo.items.length).toBe(1);
        expect(repo.items[0]).toEqual(entity);
    });

    it("should bulk insert entites", async () => {
        const entities = [
            new StubEntity({
                entity_id: new Uuid(),
                name: "Test",
                price: 100,
            }),
            new StubEntity({
                entity_id: new Uuid(),
                name: "Test 2",
                price:100,
            }),
        ];
        await repo.bulkInsert(entities);
        expect(repo.items.length).toBe(2);
        expect(repo.items[0]).toEqual(entities[0]);
    });

    it("should return all entities", async () => { 
        const aggregate= new StubEntity({name: "Test", price: 5});
        await repo.insert(aggregate);

        const entities = await repo.findAll();
        expect(entities).toStrictEqual([aggregate]);
        
    });
    it("should trhows error an update when entity not found", async () => {
        const entity = new StubEntity({name: "Test", price: 5});
        expect(repo.update(entity)).rejects.toThrow(
            new NotFoundError(entity.entity_id, StubEntity),
        );
    })

    it("should updates an entity", async () => {
        const entity = new StubEntity({name: "Test", price: 5});
        await repo.insert(entity);

        const entityUpdated = new StubEntity({
            entity_id: entity.entity_id,
            name: "Test 2",
            price: 10,
        });
        await repo.update(entityUpdated);
        expect(entityUpdated.toJSON()).toStrictEqual(
            repo.items[0].toJSON(),
        )
    })

    it("should throws error when entity not found", async () => {
       const uuid = new Uuid()
       await expect(repo.delete(uuid)).rejects.toThrow(
            new NotFoundError(uuid, StubEntity),
        );

        // await expect(
        //     repo.delete(new Uuid("9344b8a0-4f2e-8c3d-1f5e7a9b8a0f")),)
        // .rejects.toThrow(
        //     new NotFoundError("9344b8a0-4f2e-8c3d-1f5e7a9b8a0f", StubEntity),
        // );

    });


});
