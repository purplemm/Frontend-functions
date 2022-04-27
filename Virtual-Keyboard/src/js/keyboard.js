export class Keyboard {
  #containerEl;
  #switchEl;
  #fontSelectEl;
  #inputGroupEl;
  #inputEl;
  #keyboardEl;
  #keyPress = false;
  #mouseDown = false;

  constructor() {
    this.#assignElement();
    this.#addEvent();
  }

  #assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
  }

  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    this.#inputEl.addEventListener("input", this.#onInput);
    document.addEventListener("keydown", this.#onKeyDown.bind(this)); // 함수 안에서 this를 사용하는 경우 해당 this는 전역객체(window)를 바라보기 때문에 bind 해줘야함
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onChangeTheme(e) {
    document.documentElement.setAttribute(
      "theme",
      e.target.checked ? "dark-mode" : ""
    );
  }

  #onChangeFont(e) {
    document.body.style.fontFamily = e.target.value;
  }

  #onInput(e) {
    e.target.value = e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }

  #onKeyDown(e) {
    if (this.#mouseDown) return;
    this.#keyPress = true;

    // 키보드 문제로 한/영키 인식을 못해서 아래와 같이 코드 변경
    // this.#inputGroupEl.classList.toggle(
    //   "error",
    //   /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.key)
    // );

    // toggle 함수의 첫번째 파라미터는 toggle 시킬 클래스, 두번째 파라미터는 true, false 여부
    this.#inputGroupEl.classList.toggle("error", e.key === "Process");

    this.#keyboardEl
      .querySelector(`[data-code=${e.code}]`)
      ?.classList.add("active"); // optional chaining 문법 : ?사용으로 객체의 존재 여부를 확인하고, 존재하지 않을 경우 에러가 발생하는 대신 null 또는 undefined를 return함.
  }

  #onKeyUp(e) {
    if (this.#mouseDown) return;
    this.#keyPress = false;

    this.#keyboardEl
      .querySelector(`[data-code=${e.code}]`)
      ?.classList.remove("active");
  }

  #onMouseDown(e) {
    if (this.#keyPress) return;
    this.#mouseDown = true;
    e.target.closest("div.key").classList.add("active");
    console.log(e.target.closest("div.key"));
  }

  #onMouseUp(e) {
    if (this.#keyPress) return;
    this.#mouseDown = false;

    const keyEl = e.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;

    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    }
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }

    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }
  // 자바스크립트에서는 Boolean타입으로 변경은 Boolean 또는 부정연산자(!)를 사용하여 Boolean값을 만들어낸다. 부정연산자는 의미그대로 !을 사용하면 Boolean() 반대의 값을 리턴한다. *type casting
}
