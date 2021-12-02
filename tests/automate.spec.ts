import {ValidateAutomate, validate, presence, inclusion, uuid, array, type} from "../src";

describe('validate automate', () => {

  class TestModel {
    @validate('UID', [presence(), uuid()])
    public uid!: string;

    @validate('Kind', [presence(), inclusion([1, 2, 3])])
    public kind!: number;

    @validate('Leafs', [presence(), array({element: [type('string')]})])
    public leafs!: string[];
  }

  let automate: ValidateAutomate<TestModel>;

  beforeEach(() => {
    automate = new ValidateAutomate(TestModel);
  })

  it('attempted', () => {
    automate.update({
      uid: '123',
      kind: 1
    });

    expect(automate.attempted).toBe(false);

    automate.validate();

    expect(automate.attempted).toBe(true);
  })

  it('valid', () => {

    expect(automate.valid).toBe(true);

    automate.update({
      kind: 1
    });

    expect(automate.valid).toBe(true);

    automate.validate();

    expect(automate.valid).toBe(false);
  })

  it('values', () => {

    expect(automate.values).toStrictEqual({})

    automate.update({
      uid: '123',
      kind: 1,
    });

    expect(automate.values).toStrictEqual({
      uid: '123',
      kind: 1,
    });
  })

  it('global', () => {

    expect(automate.global).toBeUndefined();

    automate.set(true, 'global');

    expect(automate.global).toBe('global');

    automate.clear(true);

    expect(automate.global).toBeUndefined();
  })

  it('errors', () => {

    expect(automate.errors).toStrictEqual({})

    automate.update({
      uid: '123',
      kind: false as never,
    });

    expect(automate.errors).toStrictEqual({
      uid: 'UID is not valid uuid of version 4',
      kind: 'Kind value (false) is not allowed',
    });
  })

  it('update', () => {

    expect(automate.values).toStrictEqual({})
    expect(automate.errors).toStrictEqual({})

    automate.update({
      uid: '123',
      kind: false as never,
    });

    expect(automate.values).toStrictEqual({
      uid: '123',
      kind: false as never,
    })

    expect(automate.errors).toStrictEqual({
      uid: 'UID is not valid uuid of version 4',
      kind: 'Kind value (false) is not allowed',
    });
  })

  it('update alias', () => {

    expect(automate.values).toStrictEqual({})
    expect(automate.errors).toStrictEqual({})

    const firstValidatorForUid = automate.update.uid;

    firstValidatorForUid('123');
    automate.update.kind(false as never);

    expect(automate.values).toStrictEqual({
      uid: '123',
      kind: false as never,
    })

    expect(automate.errors).toStrictEqual({
      uid: 'UID is not valid uuid of version 4',
      kind: 'Kind value (false) is not allowed',
    });

    expect(automate.update.uid).toBe(firstValidatorForUid);
    expect(automate.update.uid).toBe(firstValidatorForUid);
    expect(automate.update.uid).toBe(firstValidatorForUid);
  })

  it('update deep alias', () => {
    automate.update.leafs(['a', 'b']);
    automate.update.leafs[1](5 as never);

    expect(automate.errors).toStrictEqual({
      leafs: "Leafs [1] must be of the correct type string",
    });
  });

})
