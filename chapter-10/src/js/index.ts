/**
 * 1. 선업 합치기를 가지고 놀아보자.
 */

/**
* a. "6.3.4 컴패니언 객체 패턴"에서 소개한 컴패니언 객체를 값과 타입 대신 네임스페이스와 인터페이스로 재구현하자.
*/

// type Currency = {
//   unit: 'EUR' | 'GBP' | 'JPY' | 'USD'
//   value: number
// }

// let Currency = {
//   DEFAULT: 'USD',
//   from(value: number, unit = Currency.DEFAULT): Currency {
//     return { unit, value}
//   }
// }

interface Currency {
  unit: 'EUR' | 'GBP' | 'JPY' | 'USD'
  value: number
}

namespace Currency {
  export let DEFAULT: Currency['unit'] = 'USD'
  export function from(value: number, unit = Currency.DEFAULT): Currency {
    return {unit, value}
  }
}

let amountDue: Currency = {
  unit: 'JPY',
  value: 1000.1
}

let otherAmountDue = Currency.from(300, 'EUR')

/**
 * b. 열거형에 정적 메서드를 추가하자.
 */

enum Color {
  RED = '#ff0000',
  GREEN = '#00ff00',
  BLUE = '#0000ff'
}

namespace Color {
  export function getClosest(to: string): Color {
    return Color.RED // GREEN BLUE
  }
}

Color.getClosest('##ffa500')
