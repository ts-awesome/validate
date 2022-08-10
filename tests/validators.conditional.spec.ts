import { boolean, inclusion, ModelValidator, required, validate } from "../src"
import { conditional } from "../src/validators/conditional"


describe('validators.conditional', () => {
  it('should not validate the field when condition is false', () => {
		const validator = new ModelValidator(TestModel1)

		expect(validator.validate({ haveYouHadCancer: false }))
			.toBe(true)
  })

	it('should validate the field when condition is true', () => {
		const validator = new ModelValidator(TestModel1)

		expect(validator.validate({ haveYouHadCancer: true, cancerType: 'type1' }))
			.toBe(true)
  })

	it('should throw an error when condition is true, but the field is not valid', () => {
		const validator = new ModelValidator(TestModel1)

		expect(validator.validate({ haveYouHadCancer: true }))
			.not.toBe(true)

		expect(validator.validate({ haveYouHadCancer: true, cancerType: 'notValid' }))
			.not.toBe(true)
  })


	it('should not throw any error when check is an empty array', () => {
		const validator = new ModelValidator(TestModel2)

		expect(validator.validate({ haveYouHadCancer: false }))
			.toBe(true)

		expect(validator.validate({ haveYouHadCancer: true }))
			.toBe(true)

		expect(validator.validate({ haveYouHadCancer: true, cancerType: 'ProbablyInvalidType' }))
			.toBe(true)
	})
})


class TestModel1 {
	@validate([required(), boolean()])
	public haveYouHadCancer!: boolean

	@validate([
		conditional({
			when: (m: TestModel1) => m.haveYouHadCancer,
			check: [required(), inclusion(['type1', 'type2'])]
		})
	])
	public cancerType?: string
}

class TestModel2 {
	@validate([required(), boolean()])
	public haveYouHadCancer!: boolean

	@validate([
		conditional({
			when: (m: TestModel1) => m.haveYouHadCancer,
			check: []
		})
	])
	public cancerType?: string
}
