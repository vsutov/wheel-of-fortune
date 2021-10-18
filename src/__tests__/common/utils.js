import { generateFormattedCurrencyString, shufflePrizes, pickSectorColor, easingFormula, buildFontString } from '../../../app/common/utils'

describe('utils', () => {
  describe('generateFormattedCurrencyString', () => {
    let expectedString
    let generatedString

    it('generates string "20 €" with locale et-EE and currency EUR', () => {
      expectedString = '20\xa0€'

      generatedString = generateFormattedCurrencyString(20, 'et-EE', 'EUR')

      expect(generatedString).toStrictEqual(expectedString)
    })

    it('generates string "$ 100" with locale en-US and currency USD', () => {
      expectedString = '$100'

      generatedString = generateFormattedCurrencyString(100, 'en-US', 'USD')

      expect(generatedString).toStrictEqual(expectedString)
    })
  })

  describe('shufflePrizes', () => {
    let array
    let shuffledArray

    it('shuffles numeric array of prizes', () => {
      array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      shuffledArray = shufflePrizes(array)

      expect(shuffledArray).not.toEqual(array)
    })

    it('if only one element, array is untouched', () => {
      array = [23]

      shuffledArray = shufflePrizes(array)

      expect(shuffledArray).toEqual(array)
    })
  })

  describe('pickSectorColor', () => {
    let pickedColor

    it('if it is last level it returns last level accent color no matter the value and prizeIndex', () => {
      pickedColor = pickSectorColor(1337, 2, 1337, 3)

      expect(pickedColor).toStrictEqual('#333333')
    })

    it('if it is second level and value is 0, it returns second level accent color no matter the prizeIndex', () => {
      pickedColor = pickSectorColor(0, 1, 1337, 3)

      expect(pickedColor).toStrictEqual('#515151')
    })

    it('else it returns color dependant on level and prizeIndex', () => {
      const pickedColorLevel1Sector1 = pickSectorColor(10, 0, 0, 1337)
      const pickedColorLevel1Sector2 = pickSectorColor(10, 0, 1, 1337)
      const pickedColorLevel2Sector1 = pickSectorColor(10, 1, 0, 1337)
      const pickedColorLevel2Sector3 = pickSectorColor(10, 1, 1, 1337)

      expect(pickedColorLevel1Sector1).toStrictEqual('#C9C9C9')
      expect(pickedColorLevel1Sector2).toStrictEqual('#757575')
      expect(pickedColorLevel2Sector1).toStrictEqual('#a3a3a3')
      expect(pickedColorLevel2Sector3).toStrictEqual('#727170')
    })
  })

  describe('easingFormula', () => {
    it('calculates eased angle using Penner\'s OutQuart', () => {
      const wheel = {
        startAngle: 25,
        endAngle: Math.PI * 2,
        totalSteps: 360,
        currentStep: 0
      }

      expect(easingFormula(wheel)).toStrictEqual(50)
    })
  })

  describe('buildFontString', () => {
    let expectedString
    let receivedString

    describe('builds font string for sector with text', () => {
      it('and first level', () => {
        expectedString = 'bold 21pt Helvetica, Arial'
        receivedString = buildFontString(123, 0)

        expect(receivedString).toStrictEqual(expectedString)
      })

      it('and second level', () => {
        expectedString = 'bold 40pt Helvetica, Arial'
        receivedString = buildFontString(123, 1)

        expect(receivedString).toStrictEqual(expectedString)
      })

      it('and third level', () => {
        expectedString = 'bold 105pt Helvetica, Arial'
        receivedString = buildFontString(123, 2)

        expect(receivedString).toStrictEqual(expectedString)
      })
    })

    describe('builds font string for sector with icon', () => {
      it('and first level', () => {
        expectedString = 'bold 32pt IcoFont'
        receivedString = buildFontString(0, 0)

        expect(receivedString).toStrictEqual(expectedString)
      })

      it('and second level', () => {
        expectedString = 'bold 60pt IcoFont'
        receivedString = buildFontString(0, 1)

        expect(receivedString).toStrictEqual(expectedString)
      })

      it('and third level', () => {
        expectedString = 'bold 158pt IcoFont'
        receivedString = buildFontString(0, 2)

        expect(receivedString).toStrictEqual(expectedString)
      })
    })
  })
})
