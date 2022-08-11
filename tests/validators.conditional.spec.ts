import { AND_OP } from "@ts-awesome/simple-query"
import { boolean, inclusion, model, ModelValidator, required, validate } from "../src"
import { Validator } from "../src/interfaces"
import { conditional } from "../src/validators/conditional"
import { array } from "../src/validators/array"


describe('validators.conditional', () => {
	it('should validate with every positive query', () => {
		const data = { a: '123' }

		const positiveQueries = [
			undefined,
			() => true,
			data
		]

		for (const query of positiveQueries) {
			const validator = conditional({ when: query, check: [FailRule(EXPECTED_ERROR)]})

			const error = validator('any', 'any', data, {})
			expect(error)
				.toBe(EXPECTED_ERROR)
		}
	})


	it('should not validate with every negative query', () => {
		const data = { a: '123' }

		const nagetiveQueries = [
			() => false,
			{ a: 'Not123' }
		]

		for (const query of nagetiveQueries) {
			const validator = conditional({ when: query, check: [FailRule(UNEXPECTED_ERROR)]})

			const error = validator('any', 'any', data, {})
			expect(error)
				.not.toBeDefined()
		}
	})


	it('should always use rules with first positive query', () => {
		const validator = conditional(
			{ when: () => false, check: [FailRule(UNEXPECTED_ERROR)] },
			{ when: () => true, check: [FailRule(EXPECTED_ERROR)] },
			{ when: () => true, check: [FailRule(UNEXPECTED_ERROR)] }
		)

		const error = validator('Any', 'key', {}, {})
		expect(error).toBe(EXPECTED_ERROR)
	})


	it('should not throw any error when there is no rules', () => {
		const validator = conditional({
			when: () => true, 	// query is positive
			check: []						// but no rules
		})

		expect(validator('AnyValue', 'AnyKey', {}, {}))
			.toBeUndefined()
	})


	it('should let you to use TsSimpleQuery features as well and support typization', () => {
		interface IData {
			a: number,
			b: number,
		}

		const validator = conditional<IData>({
			when: {
				[AND_OP]: [
					{ a: 3 },
					{ b: 34 },
				]
			},
			check: [FailRule('Query Works')]
		})

		expect(validator('', '', { a: 3, b: 34 }, {}))
			.toBe('Query Works')
		expect(validator('', '', { a: 4, b: 34 }, {}))
			.not.toBeDefined()
		expect(validator('', '', { a: 3, b: 44 }, {}))
			.not.toBeDefined()
	})


	it('should work well with simple model', () => {
		const validator = new ModelValidator(TestModel)

		expect(validator.validate({ shouldValidate: false }))
			.toBe(true)

		expect(validator.validate({ shouldValidate: true, conditionalField: 'valid' }))
			.toBe(true)

		expect(validator.validate({ shouldValidate: true }))
			.not.toBe(true)
		expect(validator.validate({ shouldValidate: true, conditionalField: 'NotValid' }))
			.not.toBe(true)
	})


	it('should return all errors from check-array', () => {
		const validator = conditional({
			when: () => true,
			check: [FailRule(EXPECTED_ERROR), FailRule(EXPECTED_ERROR)]
		})

		const errors = validator('no', 'matter', {}, {})
		expect(errors)
			.toStrictEqual([EXPECTED_ERROR, EXPECTED_ERROR])
	})


	it('should return string[] with ONLY ONE error if that error was already wrapped by its rule', () => {
		const validator = conditional({
			when: () => true,
			check: array({
				element: [model(ItemModel)],
				notValidElement: EXPECTED_ERROR
			})
		})

		const brokenItems: ItemModel[] = [
			{ prop: 'invalid' }
		]

		const errors = validator(brokenItems, 'key', {}, {})
		expect(errors)
			.toStrictEqual([EXPECTED_ERROR])
	})
	

	it('should return string[], NOT (strin | string[])[]', () => {
		/* When two or more rules returns errors like string[]
			conditional should decompose inner arrays
			and return one dimentional array of errors - string[]
		*/

		const validator = conditional({
			when: () => true,
			check: [
				array({
					element: [model(ItemModel)],
					notValidElement: EXPECTED_ERROR
				}),
				array({
					element: [model(ItemModel)],
					notValidElement: EXPECTED_ERROR
				})
			]
		})

		const brokenItems: ItemModel[] = [
			{ prop: 'invalid' },
			{ prop: 'invalid' }
		]

		// Two errors from first array-rule validator and Two from second one
		const expectErrors = [
			EXPECTED_ERROR,
			EXPECTED_ERROR,
			EXPECTED_ERROR,
			EXPECTED_ERROR
		]

		const errors = validator(brokenItems, 'key', {}, {})
		expect(errors)
			.toStrictEqual(expectErrors)
	})
})


class TestModel {
	@validate([required(), boolean()])
	public shouldValidate!: boolean

	@validate([
		conditional({
			when: (m: TestModel) => m.shouldValidate,
			check: [required(), inclusion(['valid'])]
		})
	])
	public conditionalField?: string
}

/** Fails always with result msg */
function FailRule(msg: string): Validator {
	return (_) => {
		return msg
	}
}

const EXPECTED_ERROR = 'Expected Error'
const UNEXPECTED_ERROR = 'Unexpected Error'

class ItemModel {
	@validate([inclusion(['valid'])])
	prop: 'valid'|'invalid'
}
