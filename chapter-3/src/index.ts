// 1. 타입스크립트는 다음의 값을 어떻게 추론할까?

let a = 1042; // number

let b = 'apples and oranges'; // string

const c = 'pineapples'; // 'pineapples'

let d = [true, true, false]; // boolean[]

let e = {type: 'ficus'}; // {type: string}

let f = [1, false]; // (number | boolean)[]

const g = [3]; // nunber[]

let h = null; // any

// 2. 다음 코드는 왜 주석에 적힌 에러를 발생시킬까?

let i: 3 = 3;
i = 4; // 에러 TS2322: '4' 타입은 '3' 타입에 할당할 수 없음

let j = [1, 2, 3];
j.push(4);
j.push('5'); // 에러 TS2345: '"5"' 타입의 인수를 'number' 타입의 매개변수에 할당 할 수 없음

let k: never = 4; // 에러 TSTS2322: '4' 타입은 'never' 타입에 할당할 수 없음

let l: unknown = 4;
let m = l * 2; // 에러 TS2571: 'unknown' 타입의 객체임

