import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from 'uuid';


describe('UUID Unit Tests', () => {

    const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');
    test('should throw error when uuid is invalid', () => {
        expect(() => {
            new Uuid("invalid-uuid");
        }).toThrow(new InvalidUuidError());
        expect(validateSpy).toHaveBeenCalledTimes(1);
    })

    test( 'should create a valid uuid', () => {
        const uuid = new Uuid();
        expect(uuid.id).toBeDefined();
        expect(uuidValidate(uuid.id)).toBeTruthy();
        expect(validateSpy).toHaveBeenCalledTimes(1);
    })

    test( 'should accept a valid uuid', () => {
        const uuid = new Uuid('550e8400-e29b-41d4-a716-446655440000');
        expect(uuid.id).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(validateSpy).toHaveBeenCalledTimes(1);
    })
})