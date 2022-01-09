import { Component } from "./base-component";
import { Project } from "../models/project";
import { Draggable } from "../models/drag-drop";
import { autobind } from "../decorators/autobind";

/**
 * プロジェクトの1つの表示エリア
 */
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get manday() {
    if (this.project.manday < 20) {
      return this.project.manday.toString() + "人日";
    } else {
      return this.project.manday / 20 + "人月";
    }
  }
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }
  @autobind
  dragStartHandler(event: DragEvent): void {
    // ドラッグ時データ設定できる
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move"; // 移動のエフェクト
  }

  @autobind
  dragEndHndler(_: DragEvent): void {
    console.log("Drag終了");
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHndler);
  }
  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.manday;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
