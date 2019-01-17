import { reaction } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { ApplicationStore } from "../../store/applicationStore";
import { Column } from "../column";
import { CreateTask } from "../createTask";
import "./style.scss";

interface IProps {}

interface IInjectedProps {
  applicationStore: ApplicationStore;
}
reaction(() => { true }, () => { console.log("check") })

@inject("applicationStore")
@observer
export class Kanban extends React.Component<IProps> {
  get injected() {
    return this.props as IInjectedProps;
  }

  constructor(props: IProps) {
    super(props);
    reaction(() => { true }, () => { console.log("check") })
  }

  componentDidMount() {
    reaction(() => { true }, () => { console.log("check") })
  }

  render() {
    return (
      <div className="kanban">
        <div className="kanban__header">
          <CreateTask />
        </div>
        <div className="kanban__inner">
          {this.injected.applicationStore.columns.map(item => (
            <Column key={item.id} column={item} />
          ))}
        </div>
      </div>
    );
  }
}
