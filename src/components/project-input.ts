/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
   /**
   * ProjectInput Class
   */
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
      // 入力項目
      titleInputElement: HTMLInputElement;
      descriptionInputElement: HTMLInputElement;
      mandayInputElement: HTMLInputElement;
  
      constructor() {
        super("project-input", "app", true, "user-input");
  
        this.titleInputElement = this.element.querySelector(
          "#title"
        ) as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector(
          "#description"
        ) as HTMLInputElement;
        this.mandayInputElement = this.element.querySelector(
          "#manday"
        ) as HTMLInputElement;
        this.configure();
      }
  
      /**
       * イベントの設定
       */
      configure() {
        this.element.addEventListener("submit", this.submitHandler);
      }
  
      renderContent() {}
  
      private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredManday = this.mandayInputElement.value;
        const titleValidatable: Validatable = {
          value: enteredTitle,
          required: true,
        };
        const descriptionValidatable: Validatable = {
          value: enteredDescription,
          required: true,
          minLength: 5,
        };
        const mandayValidatable: Validatable = {
          value: enteredManday,
          required: true,
          min: 1,
          max: 1000,
        };
  
        if (
          !validate(titleValidatable) ||
          !validate(descriptionValidatable) ||
          !validate(mandayValidatable)
        ) {
          alert("入力値が正しくありません。再度お試しください。");
          return;
        } else {
          return [enteredTitle, enteredDescription, +enteredManday];
        }
      }
  
      private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.mandayInputElement.value = "";
      }
  
      @autobind
      private submitHandler(event: Event) {
        // httpリクエストが送られないようにする
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
          const [title, desc, manday] = userInput;
          // プロジェクト追加時 addProject
          projectState.addProject(title, desc, manday);
          console.log(title, desc, manday);
          this.clearInputs();
        }
      }
    }
}
