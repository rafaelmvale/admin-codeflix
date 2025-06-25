import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe('Category Unit Tests', () => {
    let valdateSpy: any;
    beforeEach(() => {
        valdateSpy = jest.spyOn(Category,"validate");
    });
    test('constructor', () => {

        let category = new Category({
            name: 'Movie'
        });
        expect(category.category_id).toBeInstanceOf(Uuid);
        expect(category.name).toBe('Movie');
        expect(category.description).toBeNull();
        expect(category.is_active).toBeTruthy();
        expect(category.created_at).toBeInstanceOf(Date);
        // expect(valdateSpy).toHaveBeenCalledTimes(1);
        
        
        const created_at = new Date();
        category = new Category({
            name: 'Movie',
            description: 'some description',
            is_active: false,
            created_at
        });
        expect(category.category_id).toBeInstanceOf(Uuid);
        expect(category.name).toBe('Movie');
        expect(category.description).toBe('some description');
        expect(category.is_active).toBeFalsy();
        expect(category.created_at).toBe(created_at);

        category = new Category({
            name: 'Movie',
            description: 'some description',
        });
        expect(category.category_id).toBeInstanceOf(Uuid);
        expect(category.name).toBe('Movie');
        expect(category.description).toBe('some description');
        expect(category.is_active).toBeTruthy();
        expect(category.created_at).toBeInstanceOf(Date);
    });

    describe("category_id field", () => {
        const arrange = [
            {category_id: null},
            {category_id: undefined},
            {category_id: new Uuid()},
        ];
        test.each(arrange)("id - %j", ({ category_id }) => {
            const category = new Category({
                name: 'Movie',
                category_id: category_id as any
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            if(category_id instanceof Uuid) {
                expect(category.category_id).toBe(category_id);
            }
        })
    
    })
    test("should change name ", () => {
        const category = Category.create({
            name: 'Movie'
        });
        category.changeName('test');
        expect(category.name).toBe('test');
        expect(valdateSpy).toHaveBeenCalledTimes(2);
    });

    test("should change description ", () => {
        const category = Category.create({
            name: 'Movie'
        });
        category.changeDescription('test');
        expect(category.description).toBe('test');
        expect(valdateSpy).toHaveBeenCalledTimes(2);
    });
    test("should activate category ", () => {
        const category = new Category({
            name: 'Movie',
            is_active: false
        });
        category.activate();
        expect(category.is_active).toBeTruthy();
    });

    test("should deactivate category ", () => {
        const category = new Category({
            name: 'Movie',
            is_active: true
        });
        category.deactivate();
        expect(category.is_active).toBeFalsy();
    });
})

describe("Category Validator", () => { 

    describe("create command", () => { 
        test("should an invalid category with name propoerty", () => {
            const category = Category.create({name: 't'.repeat(256)})
            
            expect(category.notification.hasErrors()).toBe(true);
            expect(category.notification).notificationContainsErrorMessages([
                {

                    name: ['name must be shorter than or equal to 255 characters']
                },
            ])
            
            
        })
    })
})