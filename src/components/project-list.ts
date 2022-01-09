/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/drag-drop.ts" />

namespace App {

  /**
   * ProjectList Class
   */
   export class ProjectList
   extends Component<HTMLDivElement, HTMLElement>
   implements DraggTarget
 {
   assignedProjects: Project[];

   /**
    * constructor
    *
    * @param type
    */
   constructor(private type: "active" | "finished") {
     super("project-list", "app", false, `${type}-projects`);
     this.assignedProjects = [];

     this.configure();
     this.renderContent();
   }
   @autobind
   dragOverHandler(event: DragEvent): void {
     if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
       event.preventDefault(); // Dropを許可する。privent=防ぐ
       const listEl = this.element.querySelector("ul")!;
       listEl.classList.add("droppable");
     }
   }

   @autobind
   dropHandler(event: DragEvent): void {
     const prjId = event.dataTransfer!.getData("text/plain");
     projectState.moveProject(
       prjId,
       this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
     );
   }

   @autobind
   dragLeaveHandler(_: DragEvent): void {
     const listEl = this.element.querySelector("ul")!;
     listEl.classList.remove("droppable");
   }
   configure() {
     this.element.addEventListener("dragover", this.dragOverHandler);
     this.element.addEventListener("drop", this.dropHandler);
     this.element.addEventListener("dragleave", this.dragLeaveHandler);
     // プロジェクト追加時実行する関数の登録
     projectState.addListener((projects: Project[]) => {
       // 関数のtrue false で追加かどうかが決まる
       const relevantProjects = projects.filter((prj) => {
         if (this.type == "active") {
           return prj.status === ProjectStatus.Active;
         }
         return prj.status === ProjectStatus.Finished;
       });
       this.assignedProjects = relevantProjects; // `relevant`関連する れればんと
       this.renderProjects();
     });
   }

   renderContent() {
     const listId = `${this.type}-project-list`;
     this.element.querySelector("ul")!.id = listId;
     this.element.querySelector("h2")!.textContent =
       this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";
   }

   /**
    * プロジェクト追加時実行される関数
    */
   private renderProjects() {
     const listEl = document.getElementById(
       `${this.type}-project-list`
     )! as HTMLUListElement;
     listEl.innerHTML = "";
     for (const prjItem of this.assignedProjects) {
       new ProjectItem(listEl.id, prjItem);
     }
   }
 }
}
