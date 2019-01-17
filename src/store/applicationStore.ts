import * as _ from "lodash";
import { action, observable, reaction } from "mobx";
import { ColumnModel } from "../models/columnModel";
import { TaskModel } from "../models/taskModel";

export class ApplicationStore {
  @observable columns: Array<ColumnModel>;
  @observable tasks: Array<TaskModel>;
  taskDrag: any;
  indexPlaceholder: number;

  constructor() {
    this.columns = new Array<ColumnModel>();
    this.tasks = new Array<TaskModel>();

    reaction(() => this.tasks.map(task => task.name) , (data, reaction) => {
      let store = {
        columns: this.columns,
        tasks: this.tasks
      }
      localStorage.setItem("kanban", JSON.stringify(store));
    });

    const localStore = localStorage.getItem("kanban");
    if(localStore){
      const store = JSON.parse(localStore);
      this.columns = store.columns;
      this.tasks = store.tasks;
    }else{
      this.initColumns();
      this.initTasks();
    }
  }

  getTaskById = (id: number) => {
    return this.tasks.find(a => a.id == id) || new TaskModel();
  };

  getTasks = (id: number) => {
    return this.tasks.filter(a => a.parent == id) || new Array<TaskModel>();
  };

  @action
  initColumns = () => {
    this.columns = [
      {
        id: +_.uniqueId(),
        name: "Do",
        default: true
      },
      {
        id: +_.uniqueId(),
        name: "Doing",
        default: false
      },
      {
        id: +_.uniqueId(),
        name: "Done",
        default: false
      }
    ];
  };

  @action
  initTasks = () => {
    this.columns.forEach(column => {
      let task: TaskModel = {
        id: +_.uniqueId(),
        name: "Task" + column.id,
        parent: column.id,
        placeholder: false
      };
      this.tasks.push(task);
    });
  };

  DragStart = (ev: any, id: number) => {
    this.taskDrag = ev.currentTarget;
  };

  @action
  DragOver = (ev: any, idColumn: number) => {
    ev.stopPropagation();
    ev.preventDefault();
    if(ev.target.classList.contains('column__inner')){
      let placeholder = this.tasks.find(a=>a.placeholder && a.parent == idColumn);
      if(!placeholder){
        this.tasks.push({
          id: +_.uniqueId(),
          name: "placeholder",
          parent: idColumn,
          placeholder: true
        });
      }
    }
    var taskTarget = ev.target.closest(".task");

    if (ev.target.closest(".task--placeholder")) return;

    let idTaskTargeted = taskTarget && taskTarget.dataset.id;
    if (idTaskTargeted == this.taskDrag.dataset.id) return;

    let taskTop = taskTarget && this.cumulativeTop(taskTarget);
    let taskHeight = taskTarget && taskTarget.clientHeight;
    let previewTask = taskTarget && taskTarget.previousSibling;
    let nextTask = taskTarget && taskTarget.nextSibling;

    if (ev.clientY <= taskTop + taskHeight / 2 && ev.clientY >= taskTop) {
      if (previewTask && previewTask.classList.contains("task--placeholder"))
        return;
      if (nextTask && nextTask.classList.contains("task--placeholder"))
        this.removePlaceholder();
      if (previewTask && this.taskDrag == previewTask) return;
      let indexTaskTargeted: number = this.tasks.indexOf(
        this.tasks.find(a => a.id == idTaskTargeted) || new TaskModel()
      );
      indexTaskTargeted >= 0 &&
        this.tasks.splice(indexTaskTargeted, 0, {
          id: +_.uniqueId(),
          name: "placeholder",
          parent: idColumn,
          placeholder: true
        });
    } else if (
      ev.clientY > taskTop + taskHeight / 2 &&
      ev.clientY <= taskTop + taskHeight
    ) {
      if (nextTask && nextTask.classList.contains("task--placeholder")) return;
      if (previewTask && previewTask.classList.contains("task--placeholder"))
        this.removePlaceholder();
      if (nextTask && this.taskDrag == nextTask) return;
      let indexTaskTargeted: number = this.tasks.indexOf(
        this.tasks.find(a => a.id == idTaskTargeted) || new TaskModel()
      );
      indexTaskTargeted >= 0 &&
        this.tasks.splice(indexTaskTargeted + 1, 0, {
          id: +_.uniqueId(),
          name: "placeholder",
          parent: idColumn,
          placeholder: true
        });
    }
  };

  onDragLeave = (ev: any) => {
    (ev.relatedTarget && ev.relatedTarget.classList.contains("column")) && this.removePlaceholder();
  };

  @action
  Drop = (ev: any, idColumn: number) => {
    let task = this.tasks.find(a => a.id == this.taskDrag.dataset.id);
    let taskIndex = task ? this.tasks.indexOf(task) : -1;
    let placwholderIndex = this.findPlaceholder();
    if (placwholderIndex >= 0 && taskIndex >= 0 && task) {
      task.parent = idColumn;
      this.tasks.splice(taskIndex, 1);
      let placwholderIndex = this.findPlaceholder();
      this.tasks.splice(placwholderIndex, 1, task);
    }
  };

  @action
  TaskEdit = (id: number, name: string) => {
    this.tasks.map(item => {
      item.id === id && (item.name = name);
    });
  };

  @action
  TaskRemove = (id: number) => {
    let task = this.tasks.find(a => a.id == id);
    if (task != undefined) {
      this.tasks.splice(this.tasks.indexOf(task), 1);
    }
  };

  @action
  TaskAdd = (name: string) => {
    if (!name) return;
    if (this.columns.length <= 0) return;
    let column = this.columns.find(a => a.default);
    let parent = column ? column.id : this.columns[0].id;
    let task: TaskModel = {
      id: +_.uniqueId(),
      name: name,
      parent: parent,
      placeholder: false
    };

    let taskFirst = this.tasks.find(a => a.parent == parent) || new TaskModel();
    let indexOfFirst = this.tasks.indexOf(taskFirst);
    this.tasks.splice(indexOfFirst, 0, task);
  };

  @action
  Reset = () =>{
    this.tasks = new Array<TaskModel>();
  }

  private cumulativeTop = (element: any) => {
    let top: number = 0;
    do {
      top += element.offsetTop || 0;
      element = element.offsetParent;
    } while (element);

    return top;
  };

  private findPlaceholder = () => {
    let indexPlaceholder: number = this.tasks.indexOf(
      this.tasks.find(a => a.placeholder) || new TaskModel()
    );
    return indexPlaceholder;
  };

  @action
  private removePlaceholder = () => {
    let index = this.findPlaceholder();
    index >= 0 && this.tasks.splice(index, 1);
  };
}
