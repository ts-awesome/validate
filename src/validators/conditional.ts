import { Validator } from "../interfaces"
import { ISimpleQuery, match, ValidQueryModelSignature } from "@ts-awesome/simple-query"


export function conditional<TModel>(...args: ConditionalOptions<TModel>[]): Validator {

  return function ConditionalValidator (value, key, attributes, globalOptions) {
    const rules: Validator[] = matchQueriesAndGetRules(args, attributes as TModel)

    const errors = validate(rules, [value, key, attributes, globalOptions])

    if (errors.length == 1) {
      return errors[0] as (string | readonly string[])
    }
    if (errors.length > 1) {
      return destructInnerArrays(errors)
    }
  }
}


function validate(rules: Validator[], ctx: Parameters<Validator>): (string | readonly string[])[] {
  const [value, key, attributes, globalOptions] = ctx
  const errors: (string | readonly string[])[] = []
  
  for (const rule of rules) {
    const err = rule(value, key, attributes, globalOptions)

    if (!err || err === true) {
      continue
    }
    errors.push(err)
  }

  return errors
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


function destructInnerArrays (m: (string | readonly string[])[]): string[] {
  const res: string[] = []
  for (const err of m) {
    if (Array.isArray(err)) {
      res.push(...err)
    } else {
      res.push(err as string)
    }
  }

  return res
}
