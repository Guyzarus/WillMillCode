import React from "react";
import { generateClassPrefix } from "src/core/utility/common-utils";

// styles
import "./styles.scss";

// mui
import { DataGrid, GridColDef, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';


export class PovTableParams<T> {
  constructor(params:Partial<PovTableParams<T>>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  rows:Array<T> =[]
  columns:GridColDef[] = []
  loading:boolean = true
  onCellClick:GridEventListener<"cellClick">
}



export default function PovTable(props:{params:PovTableParams<any>}) {
  const classPrefix = generateClassPrefix("PovTable");
  let {params}= props
  return (
    <div className="PovTable">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>
        <DataGrid
            rows={params.rows}
            columns={params.columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            loading={params.loading}
            onCellClick={params.onCellClick}
          />
        </div>
      </div>
    </div>
  );
}
