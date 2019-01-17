import { observable } from "mobx";
import React from "react";
import { ApplicationStore } from "../../store/applicationStore";

export class CreateTaskViewModel {
  @observable inputRef: React.RefObject<HTMLInputElement>;
  applicationStore: ApplicationStore;

  constructor(applicationStore: ApplicationStore) {
    this.inputRef = React.createRef();
    this.applicationStore = applicationStore;
  }

  private GetName = () => {
    let input = this.inputRef.current;
    let name = input ? input.value : "";
    input && (input.value = "");
    return name;
  };

  TaskAdd =() =>{
    this.applicationStore.TaskAdd(this.GetName());
  }
}
