import {array, inclusion, model, required, validate} from "../src";

describe('validators.array', function (){
  it('allows not defined values', () => {
    expect(array()(null, 'key', {}, {})).not.toBeDefined();
    expect(array()(undefined, 'key', {}, {})).not.toBeDefined();
  });
  it('must be an array', () => {
    expect(array()(1, 'key', {}, {})).toEqual('must be an array');
    expect(array()(true, 'key', {}, {})).toEqual('must be an array');
    expect(array()({}, 'key', {}, {})).toEqual('must be an array');
  });
  it('specific length', () => {
    expect(array({length: {
      is: 2,
        maximum: 5,
        minimum: 1,
      }})([], 'key', {}, {})).toEqual([".length is the wrong length (should be 2 characters)", ".length is too short (minimum is 1 characters)"]);
    expect(array({length: {
        is: 2,
        minimum: 0
      }, notValidLength: 'length is invalid'})([1, 3, 4], 'key', {}, {})).toEqual('length is invalid');
  });

  it('should return array of errors for individual items', () => {
    const items: ItemModel[] = [
      { prop: 'valid' },
      { prop: 'invalid' },
      { prop: 'valid' },
      { prop: 'invalid' },
    ]
    const expectedErrors = [
      "[1] Prop value (invalid) is not allowed",
      "[3] Prop value (invalid) is not allowed"
    ]

    const validator = array({ element: [model(ItemModel)] })
    const errors = validator(items, 'key', {}, {})
    expect(errors)
      .toStrictEqual(expectedErrors)
  })

  it('should works well with arrays of arrays', () => {
    const items: ItemModel[][] = [
      [
        { prop: 'valid' },
        { prop: 'invalid' }
      ],
      [
        { prop: 'valid' },
        { prop: 'invalid' }
      ]
    ]
    const expectedErrors = [
      "[0] [1] Prop value (invalid) is not allowed",
      "[1] [1] Prop value (invalid) is not allowed"
    ]
    const validator = array({
      element: [array({
        element: [model(ItemModel)]
      })]
    })
    const errors = validator(items, 'key', {}, {})
    expect(errors)
      .toStrictEqual(expectedErrors)
  })
})



class ItemModel {
  @validate([inclusion(['valid'])])
  prop: 'valid'|'invalid'
}
