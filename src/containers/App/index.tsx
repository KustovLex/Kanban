import React, { Component } from "react";
import "./style.scss";
import { Kanban } from "../../components/kanban";
import { Provider } from "mobx-react";
import { ApplicationStore } from "../../store/applicationStore";

export class App extends Component {
  render() {
    return (
      <Provider applicationStore={new ApplicationStore()}>
        <Kanban />
      </Provider>
    );
  }
}
