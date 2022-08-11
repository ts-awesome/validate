import { Validator } from "../interfaces"
import { ISimpleQuery, match, ValidQueryModelSignature } from "@ts-awesome/simple-query"


export function conditional<TModel>(...args: ConditionalOptions<TModel>[]): Validator {

  return function ConditionalValidator (value, key, attributes, globalOptions) {
    const rules: Validator[] = matchQueriesAndGetRules(args, attributes as TModel)

    for (const rule of rules) {
      const err = rule(value, key, attributes, globalOptions)
      if (err) {
        return err
      }
    }
  }
}


function matchQueriesAndGetRules<TModel> (conditions: ConditionalOptions<TModel>[], model: TModel): Validator[] {
  for (const { when, check } of conditions) {
    const shouldValidate = !when
      || (typeof when === 'function' && when(model))
      || (typeof when !== 'function' && match(model as never, when))

    if (shouldValidate) {
      return Array.isArray(check) ? check : [check]
    }
  }

  return []
}


export interface ConditionalOptions<TModel> {
  when?: Predicate<TModel> | ISimpleQuery<ValidQueryModelSignature<TModel>>
  check: Validator | Validator[]
}


type Predicate<TModel> = (m: TModel) => boolean
