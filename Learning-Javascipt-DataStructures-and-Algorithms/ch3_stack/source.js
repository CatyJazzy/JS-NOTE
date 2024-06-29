function stack() {
  let items = [];

  // 헤드에 요소를 삽입함
  this.push = function (item) {
    items.push(item);
  };

  // 헤드에서 요소를 꺼냄
  this.pop = function () {
    items.pop();
  };

  // 헤드의 최신 요소를 확인 (삭제하지 않음)
  this.peek = function () {
    return items[items.length - 1];
  };

  // 스택이 비어있는지 확인
  this.isEmpty = function () {
    return items.length === 0;
  };

  // 스택 저장 요소의 개수 확인
  this.size = function () {
    return items.length;
  };

  // 스택 초기화
  this.clear = function () {
    items = [];
  };

  // 스택을 출력
  this.print = function () {
    console.log(items);
  };
}

/* 테스트 */
let myStack = new stack();

myStack.push(1);
myStack.push(2);
myStack.push(3);
myStack.pop();
myStack.print();
console.log(myStack.isEmpty());
console.log(myStack.size());
