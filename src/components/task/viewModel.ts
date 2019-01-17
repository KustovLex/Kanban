import { TaskModel } from "../../models/taskModel";
import { observable, action } from "mobx";
import React from "react";
import { ApplicationStore } from "../../store/applicationStore";

export class TaskViewModel {
  @observable task: TaskModel;
  @observable editable: boolean = false;
  @observable inputRef: React.RefObject<HTMLInputElement>;
  @observable store: ApplicationStore;
  applicationStore: ApplicationStore;

  constructor(task: TaskModel, applicationStore: ApplicationStore) {
    this.task = task;

    this.inputRef = React.createRef();
    this. applicationStore = applicationStore;
  }

  @action
  Edit = () => {
    this.editable = !this.editable;
    return (!this.editable && !this.task.name)
  }

  onDragStart = (ev: any, id: number) =>{
    if (!this.task.name) {
      this.applicationStore.TaskRemove(this.task.id);
      return
    }
    this.applicationStore.DragStart(ev, id);
  }
}