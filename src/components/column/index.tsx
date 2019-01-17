import { inject, observer } from "mobx-react";
import React from "react";
import { ColumnModel } from "../../models/columnModel";
import { ApplicationStore } from "../../store/applicationStore";
import { Task } from "../task";
import "./style.scss";
import { ColumnViewModel } from "./viewModel";

interface IProps {
  column: ColumnModel;
}

interface IInjectedProps {
  applicationStore: ApplicationStore;
}

@inject("applicationStore")
@observer
export class Column extends React.Component<IProps> {
  ViewModel: ColumnViewModel;

  get injected() {
    return (this.props as unknown) as IInjectedProps;
  }

  constructor(props: IProps) {
    super(props);

    this.ViewModel = new ColumnViewModel(props.column);
  }

  componentDidMount() {}

  onDragOver = (ev: any) => {
    this.injected.applicationStore.DragOver(ev, this.ViewModel.column.id);
  };

  onDragLeave = (ev: any) => {
    this.injected.applicationStore.onDragLeave(ev);
  };

  onDrop = (ev: any, id: number) => {
    this.injected.applicationStore.Drop(ev, id);
  };

  render() {
    return (
      <div className="column" data-id={this.ViewModel.column.id}>
        <div className="column__title">{this.ViewModel.column.name}</div>
        <div
          className="column__inner"
          onDragOver={ev => {
            this.onDragOver(ev);
          }}
          onDrop={ev => this.onDrop(ev, this.ViewModel.column.id)}
          onDragLeave={ev => {
            this.onDragLeave(ev);
          }}
        >
          {this.injected.applicationStore
            .getTasks(this.ViewModel.column.id)
            .map(item => (
              <Task key={item.id} task={item} />
            ))}
        </div>
      </div>
    );
  }
}
