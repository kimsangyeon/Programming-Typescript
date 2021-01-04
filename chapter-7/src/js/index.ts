/**
 * 1. 7장에서 배운 패턴 중 하나로 다음 API의 에러를 처리하는 방법을 설계하자.
 *    이 API에서 모든 동작은 실패할 수 있으며 API의 메서드 시그니처는 자유롭게 바꿀 수 있다.
 *    일련의 동작을 수행하면서 발생할 수 있는 에러를 어떻게 처리할 수 있는지 생각해보자.
 *    (예: 사용자의 ID로 로그인한 다음 친구 목록을 가져오고 각 친구의 이름을 얻음)
 */

// class API {
//   getLoggedInUserId(): UserID
//   getFriendIDs(userID: UserID): UserID[]
//   getUserName(userID: UserID): string
// }

type UserID = unknown
declare class API {
  getLoggedInUserID(): Option<UserID>
  getFriendIDs(userID: UserID): Option<UserID[]>
  getUserName(userID: UserID): Option<string>
}

interface Option<T> {
  flatMap<U>(f: (value: T) => None): None
  flatMap<U>(f: (value: T) => Option<U>): Option<U>
  getOrElse(value: T): T
}

class Some<T> implements Option<T> {
  constructor(private value: T) {}
  flatMap<U>(f: (value: T) => None): None
  flatMap<U>(f: (value: T) => Some<U>): Some<U>
  flatMap<U>(f: (value: T) => Option<U>): Option<U> {
    return f(this.value)
  }
  getOrElse(): T {
    return this.value
  }
}

class None implements Option<never> {
  flatMap(): None {
    return this
  }
  getOrElse<U>(value: U): U {
    return value
  }
}

function listOfOptionsToOptionOfList<T>(list: Option<T>[]): Option<T[]> {
  let empty = {}
  let result = list.map(_ => _.getOrElse(empty as T)).filter(_ => _ !== empty)
  if (result.length) {
    return new Some(result)
  }
  return new None()
}

let api = new API()
let friendsUserNames = api
  .getLoggedInUserID()
  .flatMap(api.getFriendIDs)
  .flatMap(_ => listOfOptionsToOptionOfList(_.map(api.getUserName)))