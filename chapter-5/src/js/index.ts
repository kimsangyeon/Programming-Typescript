
/**
 * 1. 클래스와 인터페이스의 차이는 무엇인가?
 * 클래스는 구현, 초기화된 필드 및 가시성 수정자가 있을 수 있다. 또한 Javascript 코드를 생성하여 런타임에 instanceof 검사를 지원한다.
 * 클래스는 유형과 값을 모두 정의한다. 인터페이스는 단지 유형을 정의하고, Javascript 코드를 생성하지 않으며, 형식 수준의 멤버만 포함할 수 있다.
 */

// =======

/**
 * 2. 클래스의 생성자를 private로 선언하면 인스턴스를 만들 수 없고 클래스를 확장할 수도 없다. 생성자를 protected로 선언하면 어떻게 될까? 코드 편집기로 실험해보고 어떤 일이 일어나는지 확인하자.
 */

class A {
  protected constructor() {}
}

class B extends A {} // ok
new A() // error
new B() // error

class C extends A {
  constructor() {
    super();
  }
}

new C();


/**
 * private로 선언된 생성자와 달리 protected로 선언된 생성자 클래스는 확장 할 수 있다. private으로 선언된 생성자와 proteced로 선언된 생성자 그리고 확장된 클래스는 new로 인스턴스 생성이 되지 않는다.
 * 다만 상속받은 class 생성자를 새롭게 생성시 new 인스턴스 생성이 가능하다.
 */


// ======

 /**
  * 3. 5.11.1 팩토리 패턴에서 개발한 코드를 추상화 원칙을 조금 어기는 대신 안전성을 확보할 수 있도록 개선하자. 기존에는 항상 Shoe가 반환되었지만 이번에는 사용자가 Shoe.create('boot')를 호출하면 Boot를 반환하고,
  * Shoe.create('balletFlat')를 호출하면 BalletFlat을 반환할 것임을 컴파일 타임에 알 수 있도록 바꿔보자. (4.1.9 오버로드된 함수 타입 참고)
  */
 
type Shoe = {
  purpose: string
}

class BalletFlat implements Shoe {
  purpose = 'dancing';
}

class Boot implements Shoe {
  purpose = 'woodcutting';
}

class Sneaker implements Shoe {
  purpose = 'walking';
}

type ShoeCreate = {
  create(type: 'balletFlat'): BalletFlat
  create(type: 'boot'): Boot
  create(type: 'sneaker'): Sneaker
}

let Shoe: ShoeCreate = {
  create(type: 'balletFlat' | 'boot' | 'sneaker'): Shoe {
    switch(type) {
      case 'balletFlat': return new BalletFlat();
      case 'boot': return new Boot();
      case 'sneaker': return new Sneaker();
    }
  }
}

Shoe.create('balletFlat') // BalletFlat
Shoe.create('boot') // Boot
Shoe.create('sneaker') // Sneaker


// ========

/**
 * 4. 타입 안전성을 갖춘 빌더 패턴을 설계하는 방법을 고안해보자.
 *    5.11.2 빌더 패턴에서 구현한 빌더 패턴을 다음처럼 확장하자.
 */

 /**
  * a. 최소한 URL과 method를 설정한 다음에만 .send를 호출할 수 있음을 컴파일 타임에 보장한다.
  *    메서드를 특정 순서로만 호출하도록 강제하면 이 기능을 더 쉽게 구현할 수 있을까?
  *    (this 대신 무엇을 반환할 수 있는가?)
  */
class RequestBuilder {
  private data: object | null = null
  protected method: 'get' | 'post' | null = null
  protected url: string | null = null

  setMethod(method: 'get' | 'post'): RequestBuilderMethod {
    return new RequestBuilderMethod().setMethod(method);
  }
  setData(data: object): this {
    this.data = data;
    return this;
  }
}

class RequestBuilderMethod extends RequestBuilder {
  setMethod(method: 'get' | 'post'): this {
    this.method = method;
    return this;
  }
  setURL(url: string): RequestBuilderURL {
    return new RequestBuilderURL().setMethod(this.method).setURL(url);
  }
}

class RequestBuilderURL extends RequestBuilder {
  setURL(url: string): this {
    this.url = url;
    return this;
  }
  send() {
    // ...
  }
}

new RequestBuilder().setData({}).setMethod('get').setURL('typescript.text').send();


/**
 *  b. a의 조건을 만족하면서도 호출자가 원하는 순서대로 메서드들을 호출하도록 허용할 수 있을까?
 *    (타입스크립트의 어떤 기능을 이용하면 각각의 메서드를 호출할 때마다 this에 반환 타입을 추가할 수 있을까?)
 */