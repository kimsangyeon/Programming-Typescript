// 1. 타입스크림트는 함수 타입 시그니처에서 어떤 부분을 추론하는가? 매개변수 타입, 반환 타입 또는 두 가지 모두?
/**
 * - 보통 함수 매개변수 타입은 명시적으로 정의한다.
 * - 타입스크립트는 함수의 본문에서 사용된 타입들을 보고 추론하지만 특별한 상황을 제외하면 매개변수 타입은 추론하지 않는다.
 */

// log 함수의 타입을 Log로 지정하여 Log에 지정된 message 타입으로 타입이 추론되기 때문에 매개변수에 타입을 지정해주지 않아도 추론한다.
type Log = (message: string, userId?: string) => void;

let log: Log = (
  message,
  userId = 'Not signed in',
) => {}

function times (
  f: (index: number) => void,
) {}
// 인라인으로 선언할 경우 times 선언시 지정된 f의 매개변수 타입으로 타입을 추론한다.
times(n => console.log(n));

function f(n) {
  console.log(n);
}
times(f)


// 2. 자바스크립트의 arguments 객체는 타입 안전성을 제공하는가? 그렇지 않다면 무엇으로 대체할 수 있을까?

// arguments 사용시 타입이 any로 추론되어 타입의 안정성을 제공하지 않는다.

// 나머지 매개변수를 이용해 타입지정하여 타입 안정성 제공
function sumVariadicSafe(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}


// 3. 바로 시작되는, 즉 시작 날짜가 바로 지금인 휴가를 예약하는 기능을 구현하려 한다.
//    4.1.9 오버로드된 함수 타입에서 소개한 오버로드된 reserve 함수에 명시적 시작 날짜 없이 목적지만 인수로 받는
//    세 번째 호출 시그니처를 추가하자. 또한 새로 추가한 오버로드된 시그니처를 지원하도록 reserve의 구현도 갱신하자.

type Reservation = string

type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
}

let reserve: Reserve = (
  fromOrDestination: Date | string,
  toOrDestination?: Date | string,
  destination? : string,
) => {
  if (typeof fromOrDestination === 'string') {
    return '목적지 예약';
  } else if (toOrDestination instanceof Date && destination !== undefined) {
    return '편도 여행 예약';
  } else if (typeof toOrDestination === 'string') {
    return '왕복 여행 예약';
  }
}


// 4. 94쪽 한정된 다형성으로 이수의 개수 정하기에서 소개한 call 함수에서 두 번째 인수가 string인 함수여야 정상 동작하도록 구현을 바꿔보자.
//    이를 제외한 모든 함수는 컴파일 타임에 에러를 발생시켜야 한다.

function call<T extends unknown[], R> (
  f: (...args: T) => R,
  ...args: T
): R {
  return f(...args);
}

function fill(value: string, length: number): string[] {
  return Array.from({ length }, () => value);
}

let a = call(fill, 'a', 10);
