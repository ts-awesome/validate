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

		for (let i = 0; i < positiveQueries.length; i++) {
			const query = positiveQueries[i]
			const validator = conditional({ query, check: [FailRule(EXPECTED_ERROR)]})

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

		for (let i = 0; i < nagetiveQueries.length; i++) {
			const query = nagetiveQueries[i]
			const validator = conditional({ query, check: [FailRule(UNEXPECTED_ERROR)]})

			const error = validator('any', 'any', data, {})
			expect(error)
				.not.toBeDefined()
		}
	})


	it('should always use rules with first positive query', () => {
		const validator = conditional(
			{ query: () => false, check: [FailRule(UNEXPECTED_ERROR)] },
			{ query: () => true, check: [FailRule(EXPECTED_ERROR)] },
			{ query: () => true, check: [FailRule(UNEXPECTED_ERROR)] }
		)

		const error = validator('Any', 'key', {}, {})
		expect(error).toBe(EXPECTED_ERROR)
	})


	it('should not throw any error when there is no rules', () => {
		const validator = conditional({
			query: () => true, 	// query is positive
			check: []						// but no rules
		})

		expect(validator('AnyValue', 'AnyKey', {}, {}))
			.toBeUndefined()
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
			query: (m: TestModel) => m.shouldValidate,
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
