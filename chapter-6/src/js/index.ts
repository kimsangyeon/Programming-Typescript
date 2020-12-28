/**
 * 1. 다음 각 타입 쌍에서 첫 번째 타입을 두 번째 타입에 할당할 수 있는지 정하고, 그 이유를 설명해보자.
 *    서브타입과 가변성 관점에서 고민해보고, 확신이 서지 않으면 이 장의 처음 부분에서 설명한 규칙들을 확인하자.
 *    (그래도 잘 모르겠으면 코드 편집기에 직업 코드를 입력해서 확인해보자!)
 */

// a. 1과 number
// O : 1은 number의 하위 이므로
let a: number;
a = 1 as 1;

// b. number와 1
// X : number는 1의 상위 이므로
let b: 1;
b = 2 as number;

// c. string과 number | string
// O : string은 number | string 하위
let c: number | string;
c = 'foo' as string;

// d. Boolean과 number
// X : 숫자와 불린은 관계가 없음
let d: number;
d = true as boolean;


// e. number[]와 (number | string)[]
// O : number[]는 (number | string)[] 하위
let e: (number | string)[]
e = [1] as number[];

// f. (number | string)[]과 number[]
// X : (number | string)[]이 상위
let f: number[]
f = ['foo'] as (number | string)[]
f = [1] as (number | string)[]

// g. {a: true}와 {a: boolean}
// O : {a: true}는 {a: boolean} 하위
let g: {a: boolean}
g = {a: true} as {a: boolean}

// h. {a: {b: [string]}}과 {a: {b: [number | string]}}
let h: {a: {b: [number | string]}}
h = {a: {b: ['foo']}} as {a: {b: [string]}}

// i. (a: number) => string과 (b: number) => string
let i: (b: number) => string
i = ((b: number) => 'c') as (b: number) => string

// j. (a: number) => string과 (a: string) => string
let j: (a: string) => string
j = ((a: number) => 'b') as (a: number) => string

// k. (a: number | string) => string과 (a: string) => string
let k: (a: string) => string
k = ((a: number | string) => 'k') as (a: number | string) => string

// l. E.X (열거형 enum E {X = 'X}에 정의됨)와 F.X (열거형 enum F {X='X}에 정의됨)
// 서로 다른 열거형을 할당 할 수 없다.
enum E {
  X = 'X'
}
enum F {
  X = 'X'
}
let l: F.X
l = E.X as E.X


/**
 * 2. type O = {a: {b: {c: string}}}라는 객체 타입이 있을 때 keyof O는 무슨 타입을 반환할까?
 *    O['a']['b']는 무슨 타입인가?
 */

type O = {a: {b: {c: string}}}
type P = keyof O // 'a'
type Q = O['a']['b'] // {c: string}


/**
 * 3. T나 U에 속하지만 둘 다에는 속하지 않는 타입을 구하는 Exclusive<T, U>를 구현하자.
 *    예를 들어 Exclusie<1 | 2 | 3, 2 | 3 | 4>의 결과는 1 | 4 다.
 *    타입 검사기가 Exclusive<1 | 2, 2 | 4>를 어떻게 평가하는지 단계별로 서술하자.
 */

type Exclusive<T, U> = Exclude<T, U> | Exclude<U, T>

type R = Exclusive<1 | 2 | 3, 2 | 3 | 4> // 1 | 4
type U = Exclusive<1 | 2, 2 | 4> // 1 | 4

/**
 * 4. 6.6.3 확실한 할당 어서션에서 소개한 예제를 확실한 할당 어서션을 사용하지 않도록 재구현하자.
 */

let globalCache = {
  get(key: string) {
    return 'user'
  }
}

function fetchUser() {
  return globalCache.get('userId')
}

let userId = fetchUser()
userId.toUpperCase()
