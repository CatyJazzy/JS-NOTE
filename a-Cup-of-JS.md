# ☕️ includes()의 동작원리

### (feat. 2차원 배열에서 includes를 써서 특정 배열 포함여부를 확인 못하는 이유)

includes는 문자열과 배열에 쓸 수 있는 메서드다. 문자열이나 배열에서 특정 값이 포함되어 있는지 확인하여 결과에 따라 불리언 값을 반환한다. 그런데 **2차원 배열**에서 includes를 쓰면 어떻게 될까?

아래와 같은 basket 배열이 있다고 생각해보자. 음식의 이름과 개수를 담은 배열을, 다시 배열로 담은 2차원 배열의 형태다.

```jsx
const basket = [
  ["apple", 1],
  ["pizza", 3],
  ["water", 2],
];
```

여기서 [’apple’, 1]이 있는지 includes를 통해 확인하자.

```jsx
console.log(basket.includes(["apple", 1])); // false
```

결과는 false! 안 되지 않을까? 생각은 했겠지만, 정확한 이유는 무엇일까. includes는 `SameValueZero알고리즘`을 통해서 포함 여부를 확인한다. 포함여부를 확인하고자 하는 값을 해당 알고리즘에 기반하여 배열의 요소와 하나씩 확인하는 것이다.

**결론만 말하자면, 배열은 객체에 해당하므로 SameValueZero의 알고리즘에 의해서 같은 객체를 참고하고 있는지 비교하게 되고, 이에 따라 false가 나오는 것이다.**

### 길게 여행을 떠나길 원한다면 . . . 아래를 따라가보자 . . . 🛫

ECMAScript문서에 작성된 SameValueZero 알고리즘 내용은 다음과 같다.

> **7.2.9 SameValueZero ( x, y )**
> The abstract operation SameValueZero takes arguments x (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and y (an [ECMAScript language value](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types)) and returns a Boolean. It determines whether or not the two arguments are the same value (ignoring the difference between +0𝔽 and -0𝔽).
>
> It performs the following steps when called:
>
> 1. If Type(x) is not Type(y), return false.
> 2. If x is a Number then
>    1. Return Number::sameValueZero(x,y).
> 3. Return SameValueNonNumber(x,y)

SameValueZero는 x와 y의 type을 먼저 비교한다. 다를 경우 바로 false를 반환한다. 만약 x의 type이 Number라면 Number::sameValueZero(x,y)의 반환값을 반환한다. 만약 x와 y의 type이 동일하고, x가 Number도 아니라면, SameValueNonNumber(x,y)의 반환값을 반환한다.

(\*\*\* SameValueZero와 [SameValue](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValue)알고리즘의 차이는 x가 Number일 때의 비교로직만 다르다. +0과 -0을 동일하다고 처리하는 것은 SameValueZero다.)

코드로 나타내면 다음과 같다.

```jsx
function sameValueZero(x, y) {
  if (typeof x === "number" && typeof y === "number") {
    // x and y are equal (may be -0 and 0) or they are both NaN
    return x === y || (x !== x && y !== y);
  }
  return x === y;
}
```

➡️ SameValueNonNumber(x,y)의 핵심로직은 다음과 같다.

- x가 null 또는 undefined면 false
- x가 BigInt면 BigInt::equal(x,y) 반환값
- x가 String이면 x와 y의 길이, 위치별 값이 모두 동일하면 true 아니면 false
- x가 Boolean이면, x와 y가 동일하면 true 아니면 false
- 이외에 **x is y**면 true 아니면 false

배열과 배열을 비교한다면, type이 같기 때문에 아래와 같은 규칙을 바탕으로 동일 여부를 판단하게 될 것이다. MDN문서에 기술되어 있는 내용이다. **“동일한 객체를 참조하고 있느냐?”가 핵심**이다. 이를 위해서는 주소값을 비교하게 될 것인데… basket의 [’apple’, 1]과 includes의 searchElement로 넘긴 [’apple’1]은 다른 주소값을 가진다. 따라서 `false`다.

1. 피연산자의 형식이 동일한 경우 다음과 같이 비교됩니다.
   - **객체: 두 피연산자가 동일한 객체를 참조하는 경우에만 `true`를 반환합니다.**
   - 문자열: 두 피연산자가 동일한 순서로 동일한 문자를 갖는 경우에만 `true`를 반환합니다.
   - 숫자: 두 피연산자의 값이 같은 경우에만 `true`를 반환합니다. `+0`과 -`0`은 같은 값으로 취급합니다. 피연산자 중 하나가 `NaN` 이면 `false`를 반환합니다. 따라서 `NaN`은 결코 `NaN`과 같지 않습니다.
   - 불리언: 피연산자가 둘 다 `true`이거나 둘 다 `false`인 경우에만 `true`를 반환합니다.
   - BigInt: 두 피연산자가 동일한 값인 경우에만 `true`를 반환합니다.
   - Symbol: 두 피연산자가 동일한 symbol을 참조하는 경우에만 `true`를 반환합니다.

🔎 **추가적으로 알면 좋은 것**

ECMAScript 사양에서는 두 가지의 종류의 동등 비교에 대해 설명하는 `Identity` 절이 있다. **‘동일성이 없는 값’**이란 고유한 특징만을 가진 값이다. 정수 크기나, 문자열 길이와 같은 특징들을 비교하여 동일한지 판단한다. 이러한 값은 특징만 명시하면 생성할 수 있다.

ex) undefined, null, boolean, string, BigInt

**‘동일성 있는 값’**은 이와 다르게 고유하며 변경 불가능하고 추측할 수 없는 특징인 ‘동일성’을 가지고 있는 유일한 값이다. 일부 값들은 변경 가능하다. 동일성 있는 값들은 특징만으로 생성할 수 없고, 다른 곳에서 참조를 가져와야 한다.

ex) [Symbol.for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)에 의해 생성된 심볼 값을 제외한 모든 심볼 값과 객체다. Date, 배열 등

→ 동일성 ‘없는’ 값과 동일성 ‘있는’ 값은 절대 동일하지 않다.

🧐 ECMAScript문서를 처음 자세하게 본 것 같다. 자바스크립트 값의 종류들을 복습하고, 비교 연산자의 원리를 구체적으로 알게 된 계기가 되었다.
