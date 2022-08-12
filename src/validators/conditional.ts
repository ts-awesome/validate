import { Validator } from "../interfaces"
import { ISimpleQuery, match, ValidQueryModelSignature } from "@ts-awesome/simple-query"
import { single } from "../utils"


export function conditional<TModel>(...args: ConditionalOptions<TModel>[]): Validator {

  return function ConditionalValidator (value, key, attributes, globalOptions): (readonly string[]) | undefined {
    const rules: Validator[] = matchQueriesAndGetRules(args, attributes as TModel)

    const errors = single(value, ...rules)

    return Array.isArray(errors) ? errors : undefined
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
