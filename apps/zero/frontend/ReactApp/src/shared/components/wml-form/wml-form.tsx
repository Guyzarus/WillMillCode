import React, { BaseSyntheticEvent, useEffect, useState } from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, WMLImage, WMLUIProperty } from "src/core/utility/common-utils";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
// @ts-ignore
import {    FormControl as ReactiveFormControl,AsyncValidatorFn, ValidatorFn, Validators, FormArray, AbstractControl } from "react-reactive-form";
import { MuiFileInput } from "mui-file-input";
import dayjs from "dayjs";

// material ui
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';


let handleTextFieldOnChange =(self:WMLFormFieldParams)=>(setWMLForm)=>(evt)=>{


  self.formControl.setValue(evt.target.value)
  let errorDisplayList = updateErrorDisplayList(self);
  setChangesToField(self, evt.target.value, errorDisplayList, setWMLForm);
}

let handleDateFieldOnChange =(self:WMLFormDateParams)=>(setWMLForm)=>(evt)=>{

  let dateValue = dayjs.utc(evt.target.value).format(self.dateFormat)
  self.formControl.setValue(dateValue)
  let errorDisplayList = updateErrorDisplayList(self);
  setChangesToField(self, dateValue, errorDisplayList, setWMLForm);
}

let handleFileFieldOnChange =(self:WMLFormFileParams)=>(setWMLForm)=>(evt)=>{


  let files = evt ? [evt].flat(Infinity) :[]
  files= files.slice(0,self.limit)
  let value = files.map((file)=>{
    return new WMLImage({
      value:file
    })
  })
  self.formControl = new FormArray(
    [],
    self.validators,
    self.asyncValidators
  )
  value.forEach((val)=> {
    self.formControl.push(
      new ReactiveFormControl(val)
    )
  })
  self.files = files
  self.reactSetter?.((old) => {
    // @ts-ignore
    let myNew = new self.constructor(old);
    myNew.files = files
    return myNew;
  });
  let errorDisplayList = updateErrorDisplayList(self);
  setChangesToField(self, value, errorDisplayList, setWMLForm);
}

let handleOptionsFieldOnChange =(self:WMLFormDropdownParams)=>(setWMLForm)=>(evt)=>{


  let value = [evt.target.value].flat(Infinity)
  self.formControl = new FormArray(
    [],
    self.validators,
    self.asyncValidators
  )
  value.forEach((val)=> {
    self.formControl.push(
      new ReactiveFormControl(val)
    )
  })

  let errorDisplayList = updateErrorDisplayList(self);
  setChangesToField(self, value, errorDisplayList, setWMLForm);
}

let removeFileFromField =(self:WMLFormFileParams)=>(setWMLForm,fileIndex:number)=>(evt)=>{

  let value = self.value =self.value.filter((val,index)=> fileIndex !== index)
  let files = self.files =self.files.filter((val,index)=> fileIndex !== index)
  let errorDisplayList = updateErrorDisplayList(self);
  self.reactSetter?.((old) => {
    // @ts-ignore
    let myNew = new self.constructor(old);
    myNew.files = files
    return myNew;
  });
  setChangesToField(self, value, errorDisplayList, setWMLForm);
}

function updateErrorDisplayList(self: WMLFormFieldParams) {
  let errorDisplayList = [];
  Object.entries(self.formControl.errors ?? {})
    .forEach((entry) => {
      let [key, val] = entry;
      if (self.errorMsgs[key]) {
        errorDisplayList.push(new WMLUIProperty({ text: self.errorMsgs[key] }));
      }
    });
  return errorDisplayList;
}

let updateErrorDisplayListViaFormSubmission =(self: WMLFormFieldParams)=>(setWMLForm)=>{

  let errorDisplayList =updateErrorDisplayList(self)
  setChangesToField(self, self.value, errorDisplayList, setWMLForm);
}

function setChangesToField(self: WMLFormFieldParams, value: any, errorDisplayList: any[], setWMLForm: any) {
  self.value = value;
  self.errorDisplayList = errorDisplayList;
  self.reactSetter?.((old) => {
    // @ts-ignore
    let myNew = new self.constructor(old);
    myNew.value = value;
    myNew.errorDisplayList = errorDisplayList;
    return myNew;
  });
  setWMLForm((old) => {
    let myNew = new WMLFormParams(old);
    return myNew;
  });
}
export abstract class WMLFormFieldParams extends WMLUIProperty {
  constructor(params:Partial<WMLFormFieldParams>={}){
    super()
    Object.assign(
      this,
      {
        ...params
      }
    )
    this.formControl = new ReactiveFormControl(
      this.value,
      this.validators,
      this.asyncValidators
    )
  }
  inputType = "input"
  reactSetter:React.Dispatch<React.SetStateAction<any>>
  formControl:AbstractControl
  multiple:true
  label:string
  value:any
  disabled:boolean = false
  type:"input"|"textarea"|"dropdown" | "date" | "time" |"datetime-local"
  errorMsgs:{[k:string]:string} ={
    required:"This field is required"
  }
  errorDisplayList:WMLUIProperty[] =[]
  validators:Array<ValidatorFn> =[Validators.required]
  asyncValidators:Array<AsyncValidatorFn> =[]
  _updateErrorDisplayList:any=updateErrorDisplayListViaFormSubmission(this)
  updateErrorDisplayList
  onChange:(setWMLForm:React.Dispatch<React.SetStateAction<WMLFormParams>>)=>(myEvent:BaseSyntheticEvent | File[])=>void

}

export class WMLFormInputParams extends WMLFormFieldParams {
  constructor(params:Partial<WMLFormInputParams>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params,
        type: "input",
      }
    )


  }
  rows=1
  onChange=handleTextFieldOnChange(this)
}

export class WMLFormTextAreaParams extends WMLFormInputParams {
  constructor(params:Partial<WMLFormTextAreaParams>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params,
        type:"textarea"
      }
    )
  }
  rows=4
  onChange=handleTextFieldOnChange(this)
}

export class WMLFormDropdownParams extends WMLFormFieldParams {
  constructor(params:Partial<WMLFormDropdownParams>={}){
    super(params)
    Object.assign(
      this,
      {
        // value:'',
        ...params,
        type:"dropdown"
      }
    )
    let value = [this.value].flat(Infinity)
    this.formControl = new FormArray(
      value.map((val)=> new ReactiveFormControl(val)),
      this.validators,
      this.asyncValidators
    )

  }

  formControl: FormArray;
  options:WMLUIProperty[] =[]
  value:Array<WMLFormDropdownParams["options"][number]["value"]> = []
  placeholder:string
  onInput
  onChange=handleOptionsFieldOnChange(this)
}
export class WMLFormDateParams extends WMLFormFieldParams {
  constructor(params:Partial<WMLFormInputParams>={}){
    super(params)
    Object.assign(
      this,
      {
        ...params,
      }
    )

  }
  dateFormat="YYYY-MM-DDThh:mm:ss"
  onChange=handleDateFieldOnChange(this)
}

export class WMLFormFileParams extends WMLFormFieldParams {
  constructor(params:Partial<WMLFormFileParams>={}){
    super(params)
    Object.assign(
      this,
      {
        type:"file",
        ...params
      }
    )
    this.value = this.value ??[]
    this.formControl = new FormArray(
      this.value.map((val)=> new ReactiveFormControl(val)),
      this.validators,
      this.asyncValidators
    )


  }

  updateFiles= async(value?:WMLImage[])=>{
    if(value){
      this.value = value
    }
    for(let val of this.value){
      let response = await fetch(val.src);
      let blob = await response.blob();
      let myFile = new File([blob], val.alt, { type: blob.type })
      val.value = myFile
      this.files.push(myFile)
    }
    return this
  }
  formControl: FormArray;
  value:WMLImage[] =[]
  files:File[]  =[]
  onChange =handleFileFieldOnChange(this)
  removeFile = removeFileFromField(this)
  limit= 1
}
export class WMLFormParams {
  constructor(params:Partial<WMLFormParams>={}){
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  fields:WMLFormFieldParams[] =[]

}


export default function WMLForm(props:{params:WMLFormParams}) {
  const classPrefix = generateClassPrefix("WMLForm");
  const [wmlForm,setWmlForm] = useState<WMLFormParams>()

  useEffect(()=>{

    if(props.params){
      props.params.fields = props.params.fields.map((field)=>{
        field.updateErrorDisplayList = ()=>{
          field._updateErrorDisplayList(setWmlForm)
        }
        return field
      })
      setWmlForm(props.params)
    }

  },[props.params])

  return (
    <div className="WMLForm">
      <div className={classPrefix("MainPod")}>
        <div className={classPrefix("Pod0")}>

          {
            wmlForm && React.Children.toArray(
              wmlForm.fields
              .map((field, index0) => {
                let jsxField
                  if(["textarea","input"].includes(field.type)){
                    let inputField = field as WMLFormInputParams
                    jsxField =<TextField
                    color="warning"
                    type={field.inputType}
                    disabled={field.disabled}
                    error={field.errorDisplayList.length >0}
                    fullWidth
                    label={field.label}
                    variant="filled"
                    defaultValue={field.value}
                    rows={inputField.rows}
                    multiline={field.type === "textarea"}
                    onChange={field.onChange(setWmlForm)} />
                  }
                  else if(field.type === "dropdown"){
                    let dropdownField:WMLFormDropdownParams = field as WMLFormDropdownParams
                    jsxField = <div
                    className={classPrefix("Pod0Item1")}
                    >
                    <InputLabel
                    color="warning"
                    >{field.label}</InputLabel>
                    <Select
                      color="warning"
                      type={dropdownField.inputType}
                      fullWidth={true}
                      multiple={dropdownField?.multiple}
                      value={dropdownField?.value}
                      label={dropdownField?.text}
                      onChange={dropdownField.onChange?.(setWmlForm)}
                    >
                      {
                        React.Children.toArray(
                          dropdownField?.options
                          .map((option,index1)=>{
                            return <MenuItem
                            value={option.value}>{option.text}</MenuItem>
                          })
                        )

                      }
                    </Select>

                    </div>
                  }
                  else if([ "date" ,"time" ,"datetime-local"].includes(field.type)){

                    jsxField = <div>
                      <label>{field.label}</label>
                      <TextField
                      disabled={field.disabled}
                      error={field.errorDisplayList.length >0}
                      fullWidth
                      variant="filled"
                      type={field.type}
                      defaultValue={field.value}
                      multiline={field.type === "textarea"}
                      onChange={field.onChange(setWmlForm)} />
                    </div>

                  }
                  else if(["file"].includes(field.type)){

                    let fileField:WMLFormFileParams = field as unknown as WMLFormFileParams
                    jsxField =
                    <div
                    className={classPrefix("Pod0Item2")}>
                    <label>{field.label}</label>
                    <MuiFileInput
                    color="warning"
                    value={fileField.files}
                    multiple={true}
                    onChange={fileField.onChange(setWmlForm)}
                    />
                      <ul>
                        {
                        React.Children.toArray(
                          fileField.files.map((file, index1) => {
                            return (
                              <li className={classPrefix("Pod0Item3")}  >
                                <span>{file.name}</span>
                                <img className={classPrefix("Pod0Img0")} src={fileField.value[index1].src} alt={fileField.value[index1].alt} />
                                <div  onClick={fileField.removeFile(setWmlForm,index1)}>
                                  <HighlightOffRoundedIcon />
                                </div>
                              </li>
                            );
                          })
                        )
                        }
                      </ul>

                    </div>

                  }
                  return <div style={field.style}  className={classPrefix("Pod0Item0")}>
                    <FormControl
                    disabled={field.disabled}
                    fullWidth
                    error={field.errorDisplayList.length >0}

                    >
                    {jsxField}
                    {
                      React.Children.toArray(
                        field.errorDisplayList
                        .map((error,index0)=>{
                          return <FormHelperText key={index0}>{error.text}</FormHelperText>
                        })
                      )

                    }
                    </FormControl>
                  </div>

              })
            )

          }
        </div>
      </div>
    </div>
  );
}
