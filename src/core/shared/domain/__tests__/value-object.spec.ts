import { ValueObject } from "../value-objects";

class StringValueObject extends ValueObject{
    constructor(readonly value: string) {
        super();
    }
}
class ComplexValueObject extends ValueObject{
    constructor(readonly prop1: string, readonly prop2: number) {
        super();
    }
}
describe('ValueObject Unit Tests', () => {
    test('should be equals', () => {
        const vo1 = new StringValueObject('test');
        const vo2 = new StringValueObject('test');
        expect(vo1.equals(vo2)).toBeTruthy();

        const ComplexValueObject1 = new ComplexValueObject('test', 1);
        const ComplexValueObject2 = new ComplexValueObject('test', 1);
        expect(ComplexValueObject1.equals(ComplexValueObject2)).toBeTruthy();
    });

    test('should not be equals', () => {
        const vo1 = new StringValueObject('test');
        const vo2 = new StringValueObject('test2');
        expect(vo1.equals(vo2)).toBeFalsy();
        expect(vo1.equals(null as any)).toBeFalsy();
        expect(vo1.equals(undefined as any)).toBeFalsy();

        const ComplexValueObject1 = new ComplexValueObject('test', 1);
        const ComplexValueObject2 = new ComplexValueObject('test', 2);
        expect(ComplexValueObject1.equals(ComplexValueObject2)).toBeFalsy();
        expect(ComplexValueObject1.equals(null as any)).toBeFalsy();
        expect(ComplexValueObject1.equals(undefined as any)).toBeFalsy();
    });
})