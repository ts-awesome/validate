import { Validator } from "../interfaces"
import { ISimpleQuery, match, ValidQueryModelSignature } from "@ts-awesome/simple-query"


export function conditional<TModel>(...args: ConditionalOptions<TModel>[]): Validator {

  return function ConditionalValidator (value, key, attributes, globalOptions) {
    const rules: Validator[] = matchQueriesAndGetRules(args, attributes as TModel)

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      const err = rule(value, key, attributes, globalOptions)
      if (err) {
        return err
      }
    }
  }
}


function matchQueriesAndGetRules<TModel> (conditions: ConditionalOptions<TModel>[], model: TModel): Validator[] {
  for (let i = 0; i < conditions.length; i++) {
    const { query, check } = conditions[i]
    const queryIsPositive = !query
      || (typeof query === 'function' && query(model))
      || (typeof query !== 'function' && match(model as never, query))

    if (queryIsPositive) {
      return Array.isArray(check) ? check : [check]
    }
  }

  return []
}


export interface ConditionalOptions<TModel> {
  query?: Predicate<TModel>|ISimpleQuery<ValidQueryModelSignature<TModel>>
  check: Validator|Validator[]
}


type Predicate<TModel> = (m: TModel) => boolean
