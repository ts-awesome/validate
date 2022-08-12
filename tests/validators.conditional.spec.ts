import { AND_OP } from "@ts-awesome/simple-query"
import { boolean, inclusion, ModelValidator, required, validate } from "../src"
import { Validator } from "../src/interfaces"
import { conditional } from "../src/validators/conditional"


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
				.toStrictEqual([EXPECTED_ERROR])
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
		expect(error).toStrictEqual([EXPECTED_ERROR])
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
			.toStrictEqual(['Query Works'])
		expect(validator('', '', { a: 4, b: 34 }, {}))
			.not.toBeDefined()
		expect(validator('', '', { a: 3, b: 44 }, {}))
			.not.toBeDefined()
	})


	it('should match queries well and validate depends on the relevant rules', () => {
		const NO_ERRORS = undefined
		const ERROR_A = 'ErrorA'
		const ERROR_B = 'ErrorB'

		const validator = conditional(
			{
				when: { a: true },
				check: [inclusion({ within:['a'], message: ERROR_A })]
			},
			{
				check: [inclusion({ within:['b'], message: ERROR_B })]
			}
		)

		const examples = [
			{ model: { a: true, value: 'a' }, returnedError: NO_ERRORS },
			{ model: { a: true, value: 'b' }, returnedError: [ERROR_A] },
			{ model: { a: true, value: 'c' }, returnedError: [ERROR_A] },
			{ model: { a: false, value: 'a' }, returnedError: [ERROR_B] },
			{ model: { a: false, value: 'b' }, returnedError: NO_ERRORS },
			{ model: { a: false, value: 'c' }, returnedError: [ERROR_B] },
		]

		for (const { model, returnedError } of examples) {
			expect(validator(model.value, 'key', model, {}))
				.toStrictEqual(returnedError)
		}
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
