export type toFixedLengthStringUtilParams = {
  value: number;
  fixedDigits?: number;
}

export function toFixedLengthStringUtil({ value, fixedDigits }: toFixedLengthStringUtilParams): string {
  let stringValue: string = value.toString()

  if (!fixedDigits) return stringValue

  let lenDiff: number = stringValue.length - fixedDigits

  while (lenDiff < 0) {
    stringValue = '0'.concat(stringValue)
    lenDiff += 1
  }

  if (lenDiff > 0) {
    stringValue = value.toPrecision(fixedDigits)
  }

  return stringValue
}