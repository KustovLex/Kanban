import { ColumnModel } from "../../models/columnModel";

export class ColumnViewModel{
  column: ColumnModel;

  constructor(column: ColumnModel){
    this.column = column;
  }
}