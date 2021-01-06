/**
 * 1. 인수 하나와 콜백 함수 하나를 취하는 함수를 인수로 받아서 프로미스를 반환하는 함수로 래핑해주는 범용 promisify 함수를 구현하자.
 *    제대로 구현했다면 다음처럼 사용할 수 있어야 한다.
 */

import { readFile } from 'fs'

let readFilePromise = promisify(readFile)
readFilePromise('./myfile.ts')
  .then(result => console.log('success reading file', result.toString()))
  .catch(error => console.error('error reading file', error))

function promisify<T, A>(
  f: (arg: A, f: (error: unknown, result: T | null) => void) => void
): (arg: A) => Promise<T> {
  return (arg: A) => new Promise<T>((resolve, reject) =>
    f(arg, (error, result) => {
      if (error) {
        return reject(error)
      }
      if (result === null) {
        return reject(null)
      }
      resolve(result)
    })
  )
}


/**
 * 2. 237쪽의 "타입 안전 프로토콜"에서는 타입 안전 행렬 계산 프로토콜 절반을 구현했다.
 *    메인 스레드에서 실행되는 이 절반을 기초로, 웹 워커 스레드에서 실행되는 나머지 절반을 구현하자.
 */

type Matrix = number[][]

type MatrixProtocol = {
  determinant: {
    in: [Matrix]
    out: number
  }
  'dot-product': {
    in: [Matrix, Matrix]
    out: Matrix
  }
  invert: {
    in: [Matrix]
    out: Matrix
  }
}

// MainThread.ts
type Protocol = {
  [command: string]: {
    in: unknown[]
    out: unknown
  }
}

function createProtocol<P extends Protocol>(script: string) {
  return <K extends keyof P>(command: K) => (...args: P[K]['in']) =>
    new Promise<P[K]['out']>((resolve, reject) => {
      let worker = new Worker(script)
      worker.onerror = reject
      worker.onmessage = event => resolve(event.data.data)
      worker.postMessage({command, args})
    })
}

let runWithMatrixProtocol = createProtocol<MatrixProtocol>(
  'MatrixWorkerScript.js'
)
let paralleDeterminant = runWithMatrixProtocol('determinant')

paralleDeterminant([[1, 2], [3, 4]]).then(
  determinant => console.log(determinant)
)


// WorkerScript.js
let handlers: {
  [C in keyof MatrixProtocol]: (
    ...args: MatrixProtocol[C]['in']
  ) => MatrixProtocol[C]['out']
} = {
  determinant(matrix) {
    return determinant(matrix)
  },
  ['dot-product'](a, b) {
    return dotProduct(a, b)
  },
  invert(matrix) {
    return invert(matrix)
  }
}

onmessage = <C extends keyof MatrixProtocol>({
  data: {command, args}
}: {
  data: {command: C, args: MatrixProtocol[C]['in']}
}) => {
  let handler = handlers[command]
  let result = handler(...args)
  postMessage(result)
}

declare function determinant(matrix: Matrix): number
declare function dotProduct(matrixA: Matrix, matrixB: Matrix): Matrix
declare function invert(matrix: Matrix): Matrix
