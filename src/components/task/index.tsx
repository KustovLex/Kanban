import { inject, observer } from "mobx-react";
import React from "react";
import { TaskModel } from "../../models/taskModel";
import { ApplicationStore } from "../../store/applicationStore";
import "./style.scss";
import { TaskViewModel } from "./viewModel";
import { autorun } from "mobx";

interface IProps {
  task: TaskModel;
}

interface IInjectedProps {
  applicationStore: ApplicationStore;
}

@inject("applicationStore")
@observer
export class Task extends React.Component<IProps> {
  viewModel: TaskViewModel;

  get injected() {
    return (this.props as unknown) as IInjectedProps;
  }

  constructor(props: IProps) {
    super(props);

    this.viewModel = new TaskViewModel(props.task, this.injected.applicationStore);
  }

  componentDidMount() {}

  componentDidUpdate() {
    if (this.viewModel.inputRef.current) {
      this.viewModel.inputRef.current.focus();
    }
  }

  onDragStart = (ev: any, id: number) => {
    this.viewModel.onDragStart(ev, id);
  };

  Edit = (e: any) => {
    e.preventDefault();
    this.viewModel.Edit() && this.injected.applicationStore.TaskRemove(this.viewModel.task.id);
  };

  TaskRemove = () => {
    this.injected.applicationStore.TaskRemove(this.viewModel.task.id);
  };

  TaskEdit = (id: number, name: string) => {
    this.injected.applicationStore.TaskEdit(id, name);
  };

  render() {
    return (
      <div
        className={
          !this.viewModel.task.placeholder ? "task" : "task task--placeholder"
        }
        draggable
        onDragStart={ev => this.onDragStart(ev, this.viewModel.task.id)}
        data-id={this.viewModel.task.id}
      >
        {this.viewModel.editable ? (
          <form onSubmit={(e) => this.Edit(e)}>
          <div className="task__edit">
              <input
                ref={this.viewModel.inputRef}
                value={this.viewModel.task.name}
                onChange={evt => {
                  this.TaskEdit(this.viewModel.task.id, evt.target.value);
                }}
              />
              <button type="submitc" className="btn btn--success" onClick={(e) => this.Edit(e)}>
                Save
              </button>
          </div>
          </form>
        ) : (
          <React.Fragment>
            <span
              onClick={e => {
                this.Edit(e);
              }}
            >
              {this.viewModel.task.name}
            </span>
            <div className="task__action">
              <div
                className="btn btn--dunger"
                onClick={() => this.TaskRemove()}
              >
                Remove
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
