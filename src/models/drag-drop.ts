namespace App {
  // Drag & Drop
  export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHndler(event: DragEvent): void;
  }
  /**
   * ドラッグされる場所
   */
  export interface DraggTarget {
    // dropしていい場所化を伝える
    dragOverHandler(event: DragEvent): void;
    // dropする
    dropHandler(event: DragEvent): void;
    // drag後のエフェクト的な
    dragLeaveHandler(event: DragEvent): void;
  }
}
