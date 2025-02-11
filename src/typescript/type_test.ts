import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import type { Class, InstantiableClass } from '@rauschma/helpers/typescript/type.js';

createSuite(import.meta.url);

test('Class<T>', () => {
  //#region Class
  abstract class Shape { }
  class Circle extends Shape { }

  const shapeClass: Class<Circle> = Circle;

  // Works with abstract classes such as `Shape`
  const shapeClasses: Array<Class<Shape>> = [Circle, Shape];
  //#endregion Class
});

test('InstantiableClass<T>', () => {
  //#region InstantiableClass
  function createInstance<T>(aClass: InstantiableClass<T>): T {
    return new aClass();
  }
  const instance: RegExp = createInstance(RegExp);
  //#endregion InstantiableClass
});
