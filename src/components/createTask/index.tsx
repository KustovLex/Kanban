import { inject, observer } from "mobx-react";
import React from "react";
import { ApplicationStore } from "../../store/applicationStore";
import "./style.scss";
import { CreateTaskViewModel } from "./viewModel";

interface IProps {}

interface IInjectedProps {
  applicationStore: ApplicationStore;
}

@inject("applicationStore")
@observer
export class CreateTask extends React.Component<IProps> {
  viewModel: CreateTaskViewModel;

  get injected() {
    return (this.props as unknown) as IInjectedProps;
  }

  constructor(props: IProps) {
    super(props);

    this.viewModel = new CreateTaskViewModel(this.injected.applicationStore);
  }

  componentDidMount() {}

  TaskAdd = (e: any) => {
    e.preventDefault();
    this.viewModel.TaskAdd();
  };

  Reset = () => {
    this.injected.applicationStore.Reset();
  };

  render() {
    return (
      <div className="task-create">
        <div className="col">
          <div className="task-create__title">Create new task</div>
          <div className="task-create__input">
            <form onSubmit={e => this.TaskAdd(e)}>
              <input ref={this.viewModel.inputRef} />
              <button
                type="submit"
                className="btn btn--success"
                onClick={e => this.TaskAdd(e)}
              >
                Add
              </button>
            </form>
          </div>
        </div>
        <div className="col">
          <div className="btn btn--default" onClick={() => this.Reset()}>
            Reset
          </div>
        </div>
      </div>
    );
  }
}
