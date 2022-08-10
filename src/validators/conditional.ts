import { Validator } from "../interfaces"

export function conditional<TModel>(options: ConditionalOptions<TModel>): Validator {
  const { when, check } = options

  return function ConditionalValidator (value, key, attributes, globalOptions) {
    if (when(attributes as TModel) == false) {
      return
    }

    const rules: Validator[] = Array.isArray(check) ? check : [check]

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const err = rule(value, key, attributes, globalOptions)
      if (err) {
        return err
      }
    }
  }
}

export interface ConditionalOptions<TModel> {
  when: (model: Readonly<TModel>) => boolean
  check: Validator|Validator[]
}
