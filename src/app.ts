enum ProjectStatus {
  Active, Finished
}
/**
 *  Project class （入力値）
 */
class Project {

  constructor(public id: string, public title: string, public description: string, public manday: number, public status: ProjectStatus) {
  }
}

type Listener = (items: Project[]) => void;
/**
 * Project State Management
 */
class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {

  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
  /**
   * プロジェクト追加時
   * @param title 
   * @param description 
   * @param manday 
   */
  addProject(title: string, description: string, manday: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      manday,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    // 登録された関数をすべて実行
    for (const listenerFn of this.listeners) {
      // `slice`はコピーを渡す意味 関数内で変更させないため
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}
// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

/**
 * ProjectList Class
 */
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  /**
   * constructor
   * 
   * @param type 
   */
  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    // プロジェクト追加時実行する関数の登録
    projectState.addListener((projects: Project[]) => {
      // 関数のtrue false で追加かどうかが決まる
      const relevantProjects = projects.filter(prj => {
        if (this.type == 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      })
      this.assignedProjects = relevantProjects; // `relevant`関連する れればんと
      this.renderProjects();
    })

    this.attach();
    this.renderContent();
  }
  /**
   * プロジェクト追加時実行される関数
   */
  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type === 'active' ? '実行中プロジェクト' : '完了プロジェクト';

  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }

}

/**
 * ProjectInput Class
 */
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  // form
  element: HTMLFormElement;
  // 入力項目
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    console.log(this.hostElement);
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

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
    this.attach();
  }
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

  /**
   * イベントの設定
   */
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  /**
   *
   */
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();

const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
