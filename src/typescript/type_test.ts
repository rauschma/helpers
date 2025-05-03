import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import type { Class, NewableClass } from '@rauschma/helpers/typescript/type.js';

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

test('NewableClass<T>', () => {
  //#region NewableClass
  function createInstance<T>(aClass: NewableClass<T>): T {
    return new aClass();
  }
  const instance: RegExp = createInstance(RegExp);
  //#endregion NewableClass
});
