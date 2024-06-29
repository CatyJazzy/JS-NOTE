## 함수

---

**`계기`**: 문법 마스터를 위한 학습 노트

**`노트`**

### 지역변수에 대하여

- 함수 내에서 선언한 ‘지역 변수’는 함수 안에서만 접근 가능하다.
- 함수 외부에서 선언한 ‘전역 변수’도 함수 안에서 접근 가능하며, **수정 또한 가능**하다.

```jsx
let name = "Jay"; // 전역 변수

function showName() {
  name = "Bob"; // 접근 후 변경
  console.log(name);
}

console.log(name); // 함수 호출 전이므로 유지 Jay
showName(); // 함수 호출
console.log(name); // 함수 내부에서 변경되어 Bob
```

- 다만, 전역 변수와 같은 이름을 가진 지역 변수가 있을 때, 함수 내부에서 전역 변수는 무시된다.

```jsx
let name = "Jay";

function showName() {
  let name = "Cat";
  console.log(name);
}

showName(); // 함수 내부의 name을 출력 Cat
console.log(name); // 전역 변수는 수정되지 않음 Jay
```

### 기본값의 활용

함수를 선언할 때 넘겨줄 값으로 정의되는 **“매개변수(parameter)”**와 함수 호출 시 넘겨주는 값인 **“인수(argument)”**가 있다. 매개변수의 수보다 인수가 적게 (부족하게) 전달되면, 함수 내부에서 undefined로 처리된다. 이때 기본값을 통해 undefined를 대체할 값을 지정할 수 있다.

```jsx
function showText(name, text = "...") {
  console.log(name + ": " + text);
}

showText("John", "Hi!");
showText("Bob"); // text값이 전달되지 않았으므로 기본값인 "..." 출력
```

위의 코드와 같이 매개변수에 =으로 기본값을 할당하는 것 외에도 다음과 같은 방법을 활용할 수 있다.

(1) 함수 내부에서 인수가 undefined인지 확인하여 기본값 할당

```jsx
function showtext(name, text) {
  // 여기서 확인하여 기본값을 할당
  if (text === undefined) {
    text = "...";
  }
  console.log(name + ": " + text);
}

showText("Bob"); // 기본값인 "..."이 제대로 출력됨
```

(2) or 연산자를 통해 기본값 할당

```jsx
function showtext(name, text) {
  // 여기서 확인하여 기본값을 할당
  text = text || "...";
  console.log(name + ": " + text);
}

showText("Bob"); // 기본값인 "..."이 제대로 출력됨
```

### 함수는 매개변수로 넘겨준 값을 복사하여 사용한다

다음의 코드를 살펴보자. 매개변수를 통해 넘어 온 값은 함수 내부에서 “복사”되어 사용되는 것이다. 따라서, 함수 내부에서 수정을 하거나 변형하여 사용해도 원래의 값에는 영향을 미치지 않는다. (\* 함수 내부에서 전역변수를 사용하는 것과 구분해야 한다.)

```jsx
let person1 = "Jake";
function showText(name, text) {
  name = name + "^_^"; // 여기서 name의 형태를 바꿔도 person1값에는 영향이 없음
  console.log(name + ": " + text);
}

showText(person1, "Hello!"); // 여기선 'Jake^^'이지만,
console.log(person1); // 그대로 'Jake'임
```

### 함수 규칙

함수를 지혜롭고 명확하게 활용하는 것은 코드 작성 시 매우 중요하다. 다음과 같은 것들을 고려해야 한다.

- 하나의 함수는 **“하나의 기능”만을 수행**해야 한다.
- 함수는 **“자기 설명적”**이어야 한다. 이름과 내부 코드로부터 함수가 담당하는 기능이 명확하고 쉽게 드러날 수 있도록 작성해야 한다.

보통 함수의 이름은 다음의 접두사를 이용하여 짓는다. (물론 팀, 조직의 규칙이 있다면 그것이 기준이다)

`get-` : 값을 반환

`calc-` : 무언가를 계산

`create-` : 무언가를 생성

`check-` : 무언가를 확인하고 boolean값을 반환

→ 사용자의 나이를 받아서 이벤트 대상자 여부를 확인하는 checkEvent함수가 있다고 하자. 이 함수에서는 이벤트 대상인지 평가한 결과인 불린값을 반환해야 한다. 그 과정에서 이벤트 안내 문구를 출력한다면 두 가지 기능을 갖게 된다.

→ 사용자에게 입력을 받는 폼을 생성하는 createForm함수가 있다고 하자. 이 함수에서 문서의 내용을 수정하는 기능을 포함하고 있다면, 두 가지 기능을 갖게 된다.

위의 두 예시 모두 적절하지 않다. 특히 특정 값을 반환하는 get-종류 함수에서 무언가를 출력하는 실수를 자주 범한다.

이를 보여주는 또다른 좋은 예시를 살펴보자. n까지의 소수(prime numbers)를 출력하는 showPrimes함수가 있다.

```jsx
function showPrimes(n) {
  nextPrime: for (let i = 2; i < n; i++) {
    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime; // 약수가 있는 경우 이후의 약수 건너뛰고 다음 숫자로!
    }
    alert(i); // 소수를 출력
  }
}
```

이는 (1)소수인지 판단하고, (2)소수를 출력하는 두 가지 기능을 하는 함수이다. 따라서 소수인지 판단하는 함수를 따로 분리할 수 있다. isPrime으로 분리해보자. 더 깔끔하고, 각 함수의 역할이 명확하게 보이는 형태다.

```jsx
function showPrimes(n) {
  for (let i = 2; i < n; i++) {
    if (!isPrime(i)) continue; // 소수가 아닐 경우 다음 숫자로 건너뜀
    alert(i); // 소수 출력
  }
}

function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if (n % i == 0) return false;
  }
  return true;
}
```

- Reference
  [https://ko.javascript.info/function-basics](https://ko.javascript.info/function-basics)

Learning JavaScript Data Structures and Algorithms
