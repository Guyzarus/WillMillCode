import React,{ useState,useEffect } from "react";

// styles
import "./styles.scss";

// utils
import { generateClassPrefix, getArrayFromFirebaseRealtimeDatabase, InputTypes, WMLAPIError, WMLError, WMLFormErrors, WMLOptionsButton, WMLUIProperty, WMLUseEffectFlags } from "src/core/utility/common-utils";
import ShrikhandText, { ShrikhandTextParams } from "src/shared/components/ShrikhandText/Shrikhand";
import { ENV, environment } from "src/environments/environment";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryBtn from "src/shared/components/primaryBtn/primaryBtn";

// i18n
import { useTranslation } from "react-i18next";
import enTranslations from "src/assets/i18n/en/common.json";
import { POVEvent, usePOVEvents } from "src/contexts/POVEventsContext";
import WMLForm, { WMLFormDateParams, WMLFormDropdownParams, WMLFormFieldParams, WMLFormFileParams, WMLFormInputParams, WMLFormParams, WMLFormTextAreaParams } from "src/shared/components/wml-form/wml-form";
import { useOverlayLoading } from "src/contexts/OverlayLoadingContext";
import { ValidatorsFileType } from "src/core/utility/reactive-forms-utils";
import SecondaryBtn from "src/shared/components/secondaryBtn/SecondaryBtn";
import { Validators } from "react-reactive-form";
import { NotifyParams, NotifyParamsSeverityEnum, useNotify } from "src/contexts/NotifyContext";
import { useMapbox } from "src/contexts/MapboxContext";

// firebase
import { child, get, ref as databaseRef, set as databaseSet } from "@firebase/database";
import { FBPOVEventAPIModel, firebaseDB, firebaseDBRef, firebaseStorage, firebaseStorageRef } from "src/api/firebase";
import { deleteObject, listAll, ref  as storageRef, StorageReference, uploadBytes, UploadResult } from "firebase/storage";
import { DatabaseReference, push, update } from "firebase/database";
import { Modal } from "@mui/material";



export class ManageEventsParams extends WMLUIProperty<any,"create" | "edit"> {
  constructor(params:Partial<ManageEventsParams>={}){
    super(params);
    Object.assign(
      this,
      {
        ...params
      }
    )
  }
  title:string
  submit:string
}

enum ManageEventsListFormsEnum {
  PROVISIONS,
  PRICES,
  TIMES
}

export default function ManageEvents(props:{params:ManageEventsParams}) {
  const classPrefix = generateClassPrefix("ManageEvents");
  const {params} = props
  let navigate = useNavigate()
  const {t, i18n} = useTranslation('common');
  const {
    events,
    genres,
    provisions,
    deletePOVEvent,
    deleteFirebaseStorageFolder
  } = usePOVEvents();
  const { getLntLngBasedOnLocationText } = useMapbox();
  const {
    setNotifyParams
  } = useNotify()
  const {
    toggleOverlayLoading
  } = useOverlayLoading()


  const title = new ShrikhandTextParams({
    text:params.title,
    type:"h1"
  })
  const returnToAdminBtn = new WMLOptionsButton({
    text:t("global.back"),
    click:()=>{
      navigate(ENV.nav.urls.admin)
    }
  })
  const submitBtn =new WMLOptionsButton({
    text:params.submit,
    click:()=>{
      navigate(ENV.nav.urls.admin)
    }
  })

  const [deleteEventIsPresent,setdeleteEventIsPresent] = useState(false)
  function handleEventDeleteOnClose() {
    setdeleteEventIsPresent(false)
  }
  const deleteEventBtn = new WMLOptionsButton({
    text:t("ManageEvents.edit.delete"),
    click:()=>{
      setdeleteEventIsPresent(true)
    }
  })
  const confirmDeleteEventBtn = new WMLOptionsButton({
    text: t("ManageEvents.edit.delete"),
    click: () => {
      deletePOVEvent(currentAdminEvent.id)
        .then(() => {
          setNotifyParams(
            new NotifyParams({
              isPresent: true,
              text: t("ManageEvents.edit.deleteSuccess"),
            })
          );
          window.location.href = `${ENV.frontendDomain0}${ENV.nav.urls.admin}`;
        })
        .catch(() => {
          setNotifyParams(
            new NotifyParams({
              isPresent: true,
              severity:NotifyParamsSeverityEnum.ERROR,
              text: t("ManageEvents.edit.deleteError")
            })
          );
        })
        .finally(() => {
          setdeleteEventIsPresent(false);
        });
    },
  });

  // dropdowns
  const [formIsOnline,setformIsOnline] = useState(
    enTranslations.ManageEvents.isOnline.map((item, index0) => {
      return new WMLUIProperty({
        text: t("ManageEvents.isOnline."+index0),
        value: index0,
      });
    })
  )
  const [formStates, setformStates] = useState(
    enTranslations.ManageEvents.statesOfUSA.map((item, index0) => {
      return new WMLUIProperty({
        text: t("ManageEvents.statesOfUSA."+index0),
        value: index0,
      });
    })
  );
  const [formCountries, setFormCountries] = useState(
    enTranslations.ManageEvents.countriesOfEarth.map((item, index0) => {
      return new WMLUIProperty({
        text: t("ManageEvents.countriesOfEarth."+index0),
        value: index0,
      });
    })
  );
  const [formCurrencies,setFormCurrencies] = useState(
    enTranslations.ManageEvents.currencies.map((item, index0) => {
      return new WMLUIProperty({
        text: t("ManageEvents.currencies."+index0),
        value: index0,
      });
    })
  )
  const [formTribes,setFormTribes] = useState<WMLUIProperty[]>()
  const [formProvisions,setFormProvisions] = useState<WMLUIProperty[]>()

  // imagesForm
  const [mainImageField,setmainImageField] = useState<WMLFormFileParams>()
  const [altImagesField,setaltImagesField] = useState<WMLFormFileParams>()


  // basicsForm
  const [eventNameField, setEventNameField] = useState<WMLFormFieldParams>()
  const [descriptionField, setDescriptionField] = useState<WMLFormFieldParams>()
  const [tribeNameField, setTribeNameField] = useState<WMLFormDropdownParams>()
  const [hostedByField, setHostedByField] = useState<WMLFormFieldParams>()


  // address form
  const [isOnlineField,setisOnlineField] = useState<WMLFormDropdownParams>()
  const [streetNumberField,setstreetNumberField] = useState<WMLFormFieldParams>()
  const [streetNameField,setstreetNameField] = useState<WMLFormFieldParams>()
  const [unitField,setunitField] = useState<WMLFormFieldParams>()
  const [cityField,setcityField] = useState<WMLFormFieldParams>()
  const [stateField,setstateField] = useState<WMLFormDropdownParams>()
  const [zipField,setzipField] = useState<WMLFormFieldParams>()
  const [countryField,setcountryField] = useState<WMLFormDropdownParams>()

  // vibescore form
  const [densityScoreField,setDensityScoreField] = useState<WMLFormFieldParams>()
  const [diversityScoreField,setDiversityScoreField] = useState<WMLFormFieldParams>()
  const [energyScoreField,setEnergyScoreField] = useState<WMLFormFieldParams>()
  const [friendlinessScoreField,setFriendlinessScoreField] = useState<WMLFormFieldParams>()
  const [amntOfRatingsField,setAmntOfRatingsField] = useState<WMLFormFieldParams>()
  const [calculatedVibeScoreField,setCalculatedVibeScoreField] = useState<WMLFormFieldParams>()


  // prices form
  const addPriceBtn = new WMLOptionsButton({
    text:t("ManageEvents.forms.4.addItem"),
  })
  const removePriceBtn = new WMLOptionsButton({
    text:t("ManageEvents.forms.4.removeItem"),
  })


  // times form
  const addTimeBtn = new WMLOptionsButton({
    text:t("ManageEvents.forms.5.addItem"),
  })
  const removeTimeBtn = new WMLOptionsButton({
    text:t("ManageEvents.forms.5.removeItem"),
  })


  // provisions form
  const addProvisionBtn = new WMLOptionsButton({
    text:t("ManageEvents.forms.6.addItem"),
  })
  const removeProvisionBtn = new WMLOptionsButton({
    text:t("ManageEvents.forms.6.removeItem"),
  })


  // forms
  const [imagesForm,setimagesForm] = useState<WMLFormParams>()
  const [basicsForm,setbasicsForm] = useState<WMLFormParams>()
  const [addressForm,setaddressForm] = useState<WMLFormParams>()
  const [vibeScoreForm,setvibeScoreForm] = useState<WMLFormParams>()
  const [pricesForms,setpricesForms] = useState<WMLFormParams[]>([])
  const [timesForms,settimesForms] = useState<WMLFormParams[]>([])
  const [provisionsForms,setProvisionsForms] = useState<WMLFormParams[]>([])


  //flags
  const [initLoadFormTribes,setinitLoadFormTribes] = useState(WMLUseEffectFlags.ACTIVE)
  const [initLoadFormProvisions,setinitLoadFormProvisions] = useState(WMLUseEffectFlags.PENDING)
  const [initBasicFields,setInitBasicFields] = useState(WMLUseEffectFlags.PENDING)
  const [initBasicForms,setinitBasicForms] = useState(WMLUseEffectFlags.PENDING)

  // form tools
  let listFormsData ={
    [ManageEventsListFormsEnum.PRICES]:{
      reactSetter:setpricesForms,
      fields:()=> {return [
        new WMLFormInputParams({ label: t("ManageEvents.forms.4.fields.ticketName.label") }),
        new WMLFormInputParams({
          label: t("ManageEvents.forms.4.fields.cost.label"),
          validators: [Validators.pattern(/^\d+$/), Validators.required],
          errorMsgs:{
            required:t("ManageEvents.forms.4.fields.cost.errorMsgs.required"),
            pattern:t("ManageEvents.forms.4.fields.cost.errorMsgs.pattern")
          }
        }),
        new WMLFormDropdownParams({ label: t("ManageEvents.forms.4.fields.currency.label"),options:formCurrencies,value:[formCurrencies[0].value],disabled:true }),
      ]}
    },
    [ManageEventsListFormsEnum.TIMES]:{
      reactSetter:settimesForms,
      fields:()=> {return [
        new WMLFormDateParams({ label: t("ManageEvents.forms.5.fields.start.label"), type:"datetime-local" }),
        new WMLFormDateParams({ label: t("ManageEvents.forms.5.fields.end.label"),type:"datetime-local" }),
      ]}
    },
    [ManageEventsListFormsEnum.PROVISIONS]:{
      reactSetter:setProvisionsForms,
      fields:()=> {return [
        new WMLFormDropdownParams({ label: t("ManageEvents.forms.6.fields.name.label"), options:formProvisions,value:[formProvisions[0].value] }),
        new WMLFormTextAreaParams({ label: t("ManageEvents.forms.6.fields.desc.label"),validators:[] }),
      ]}
    },
  }
  let handleAddForm = (choice:ManageEventsListFormsEnum)=>{

    let target = listFormsData[choice]
    target.reactSetter((olds)=>{
      let myNew = olds
      .map((old)=>{
        return new WMLFormParams({
          ...old
        })
      })
      myNew.push(
        new WMLFormParams({
          fields:target.fields()
        })
      )
      return myNew
    })
  }
  let handleRemoveForm =  (index0:number,choice:ManageEventsListFormsEnum)=>{

    let target = listFormsData[choice]
    let holding
    target.reactSetter((olds)=>{
      let myNew = [...olds]
      myNew.splice(index0,1)
      holding =myNew
      return  []
    })

    setTimeout(() => {
      target.reactSetter(holding)
    }, 0);

  }
  function updateBasicForms() {


    setbasicsForm(new WMLFormParams({
      fields: [
        eventNameField,
        tribeNameField,
        hostedByField,
        descriptionField
      ]
    }));

    setimagesForm(new WMLFormParams({
      fields: [
        mainImageField,
        altImagesField
      ]
    }));

    setaddressForm(new WMLFormParams({
      fields: [
        isOnlineField,
        streetNumberField,
        streetNameField,
        unitField,
        cityField,
        stateField,
        zipField,
        countryField,
      ]
    }));

    setvibeScoreForm(new WMLFormParams({
      fields: [
        diversityScoreField,
        densityScoreField,
        energyScoreField,
        friendlinessScoreField,
        amntOfRatingsField,
        calculatedVibeScoreField
      ]
    }));
  }
  async function handleCreateEvent() {

    toggleOverlayLoading(true);
    let result =await checkForFormErrors()
    if(result instanceof WMLError){
      notifyUserOfError(result);
    }
    else {
      let  newPOVEvent = new POVEvent()
      let coords = result
      let apiPrices = transformPricesFromUItoAPI()
      let apiTimes = transformTimesFromUItoAPI()
      let stateText = formStates.find((s) => s.value === stateField.value[0]);
      let countryText = formCountries.find((s) => s.value === countryField.value[0]);
      let newPOVEventRef = push(databaseRef(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.povEvents))
      newPOVEvent.id = newPOVEventRef.key
      let povEventRefApiBody = generateEventAPIBody(coords, stateText, countryText, apiPrices, apiTimes,newPOVEvent)

      if(await clearImagesToBeReplacedForAnEvent(newPOVEvent) instanceof WMLAPIError){
        return
      }
      let uploadBytesForAllImgs = prepareImgsToBeUploaded(povEventRefApiBody,newPOVEvent);
      createEditEventToDatabase(uploadBytesForAllImgs, newPOVEventRef, povEventRefApiBody,newPOVEvent);

    }

  }
  let handleEditEvent= async ()=> {
    toggleOverlayLoading(true);
    let result =await checkForFormErrors()
    if(result instanceof WMLError){
      notifyUserOfError(result);
    }
    else{
      let coords = result
      let apiPrices = transformPricesFromUItoAPI()
      let apiTimes = transformTimesFromUItoAPI()
      let stateText = formStates.find((s) => s.value === stateField.value[0]);
      let countryText = formCountries.find((s) => s.value === countryField.value[0]);
      let povEventRef = databaseRef(firebaseDB,ENV.firebase.realtimeDatabase.endpoints.povEvents+"/"+currentAdminEvent.id)
      let povEventRefApiBody = generateEventAPIBody(coords, stateText, countryText, apiPrices, apiTimes,currentAdminEvent)
      if(await clearImagesToBeReplacedForAnEvent(currentAdminEvent) instanceof WMLAPIError){
        return
      }
      let uploadBytesForAllImgs = prepareImgsToBeUploaded(povEventRefApiBody,currentAdminEvent);
      createEditEventToDatabase(uploadBytesForAllImgs, povEventRef, povEventRefApiBody,currentAdminEvent);
    }
  }

  let checkForFormErrors = async () => {
    let fields = [
      basicsForm.fields,
      addressForm.fields,
      vibeScoreForm.fields,
      provisionsForms.map((prov) => prov.fields),
      timesForms.map((prov) => prov.fields),
      pricesForms.map((prov) => prov.fields),
      imagesForm.fields,
    ].flat(Infinity);
    fields.forEach((field: WMLFormFieldParams)=>{
      field.formControl.patchValue(field.value);
      field.formControl.updateValueAndValidity()
    })
    let hasFormErrors = !fields.every((field: WMLFormFieldParams) => {
      if (field.formControl.errors) {
        console.log(field)
        field.updateErrorDisplayList();
      }
      return field.formControl.errors === null;
    });
    if (hasFormErrors) {
      return new WMLError({
        msg:WMLFormErrors.GENERAL
      })
    }
    return checkAddressAgainstMapbox();

  };
  function createEditEventToDatabase(uploadBytesForAllImgs:Promise<UploadResult>[], povEventRef:DatabaseReference, povEventRefApiBody: FBPOVEventAPIModel,povEvent:POVEvent) {
    Promise.all(uploadBytesForAllImgs)
      .catch(() => {
        setNotifyParams(
          new NotifyParams({
            isPresent: true,
            severity: NotifyParamsSeverityEnum.ERROR,
            text: t("ManageEvents.wmlNotify.fileUploadError")
          })
        );
      })
      .then(() => {
        return update(povEventRef, povEventRefApiBody);
      })
      .then(() => {
        return updateFirebaseEventProvisions(
          povEvent,
          provisionsForms
        );
      })
      .then(() => {
        setNotifyParams(
          new NotifyParams({
            isPresent: true,
            text: t("global.success")
          })
        );
        window.location.reload();
      })
      .catch((err) => {
        console.log(err)
        setNotifyParams(
          new NotifyParams({
            isPresent: true,
            severity: NotifyParamsSeverityEnum.ERROR,
            text: t("ManageEvents.wmlNotify.serverError")
          })
        );
      })
      .finally(() => {
        toggleOverlayLoading(false);
      });
  }

  function prepareImgsToBeUploaded(povEventRefApiBody: FBPOVEventAPIModel,povEvent:POVEvent) {
    let mainImgRoute = ENV.firebase.realtimeDatabase.endpoints.povEvents + "/" + povEvent.id + "/mainImg";
    let povEventMainImageRef = {
      ref: storageRef(firebaseStorage, mainImgRoute),
      file: mainImageField.value[0].value as File
    };
    povEventRefApiBody.mainImgUrl = mainImgRoute;
    povEventRefApiBody.altImgUrls = [];
    let povEventAltImgRefs = altImagesField.value.map(function (wmlImage, index0) {
      let altImgRoute = ENV.firebase.realtimeDatabase.endpoints.povEvents + "/" + povEvent.id + "/altImg" + index0;
      povEventRefApiBody.altImgUrls.push(altImgRoute);
      return {
        ref: storageRef(firebaseStorage, altImgRoute),
        file: wmlImage.value as File
      };
    });
    let uploadBytesForAllImgs = [
      povEventMainImageRef,
      ...povEventAltImgRefs
    ]
      .map((entry) => {
        return uploadBytes(entry.ref, entry.file, { contentType: entry.file.type });
      });
    return uploadBytesForAllImgs;
  }

  async function clearImagesToBeReplacedForAnEvent(povEvent:POVEvent) {
    let povEventImgFolder = ENV.firebase.realtimeDatabase.endpoints.povEvents + "/" + povEvent.id;
    let povEventImgBucketResult;
    try {
      povEventImgBucketResult = await deleteFirebaseStorageFolder(povEventImgFolder);
    }
    catch (e) {
      setNotifyParams(
        new NotifyParams({
          text: t("global.error"),
          isPresent: true,
          severity: NotifyParamsSeverityEnum.ERROR
        })
      );
      toggleOverlayLoading(false);
      return new WMLAPIError({})
    }
  }

  function generateEventAPIBody(coords: any, stateText: WMLUIProperty<any, any>, countryText: WMLUIProperty<any, any>, apiPrices: { currency: string; display: string; major_value: string; value: number; ticketName: any; }[], apiTimes: { start: any; end: any; }[],povEvent:POVEvent) {
    return new FBPOVEventAPIModel({
      address: {
        city: cityField.value,
        coords,
        number: streetNumberField.value,
        state: stateText.text,
        streetName: streetNameField.value,
        unit: unitField.value,
        zip: zipField.value,
        country: countryText.text,
        isOnline: isOnlineField.value[0] === 0 ? true : false,
      },
      desc: descriptionField.value,
      eventbriteId: povEvent.eventbriteId,
      genreId: tribeNameField.value[0],
      hostedBy: hostedByField.value,
      prices: apiPrices,
      schedules: apiTimes,
      vibeScore: povEvent.vibeScore,
      title: eventNameField.value,
    });
  }

  function transformTimesFromUItoAPI() {
    return timesForms.map((form) => {
      let [startField, endField] = form.fields;
      return {
        start: startField.value,
        end: endField.value,
      };
    });
  }

  function transformPricesFromUItoAPI() {
    return pricesForms.map((form) => {
      let [ticketNameField, costField, currencyField] = form.fields;
      let currencyText = formCurrencies.find((c) => c.value === currencyField.value[0]);
      let costFieldValue = parseInt(costField.value);
      return {
        currency: currencyText.text,
        display: `$` + (costFieldValue / 100).toFixed(2),
        major_value: costFieldValue.toString(),
        value: costFieldValue,
        ticketName: ticketNameField.value
      };
    });
  }

  function notifyUserOfError(result: WMLError) {
    let text = {
      [WMLFormErrors.GENERAL]: t("ManageEvents.wmlNotify.generalError"),
      [WMLFormErrors.INVALID_ADDRESS]: t("ManageEvents.wmlNotify.invalidAddress")
    }[result.msg];
    setNotifyParams(
      new NotifyParams({
        isPresent: true,
        severity: NotifyParamsSeverityEnum.ERROR,
        text,
      })
    );
    toggleOverlayLoading(false);
  }

  async function checkAddressAgainstMapbox() {

    let addr = addressForm.fields.reduce((acc, x, i) => {
      let text = x.value;
      if (x.label === "Unit") {
        return acc;
      }
      if (x.constructor.name === "WMLFormDropdownParams") {
        if (x.label === "State") {
          text = formStates.find((state) => {
            return state.value === x.value[0];
          });
        } else if (x.label === "Country") {
          text = formCountries.find((option) => {
            return option.value === x.value[0];
          });
        }
        text = text.text;
      }
      return `${acc} ${text}`;
    }, "");

    let result = await getLntLngBasedOnLocationText(addr);
    if (result.features.length === 0) {
      return new WMLError({
        msg:WMLFormErrors.INVALID_ADDRESS
      })
    } else {
      return  result.features[0].center;
    }
  }
  async function updateFirebaseEventProvisions(
    currentEvent: POVEvent,
    provisionsForms: WMLFormParams[]
  ) {
    let firebaseProvisions = await getArrayFromFirebaseRealtimeDatabase(
      get(child(firebaseDBRef, ENV.firebase.realtimeDatabase.endpoints.povEventsProvisions))
    );

    firebaseProvisions = firebaseProvisions.filter((prov) => {
      return prov.eventId !== currentEvent.id;
    });
    let newProvisions = provisionsForms.map((provForm) => {
      let [nameField, descField] = provForm.fields;

      return {
        eventId: currentEvent.id,
        eventProvisionsId: nameField.value[0],
        eventProvisionsDesc: descField.value === "" ? null : descField.value,
      };
    });
    firebaseProvisions.push(...newProvisions);
    return databaseSet(databaseRef(firebaseDB, ENV.firebase.realtimeDatabase.endpoints.povEventsProvisions), firebaseProvisions);
  }

  // edit features
  const [currentAdminEvent, setCurrentAdminEvent] = useState<POVEvent>(null);
  const [initAdminEvent,setinitAdminEvent] = useState(WMLUseEffectFlags.PENDING)
  const [initPopulateBasicFields,setinitPopulateBasicFields] = useState(WMLUseEffectFlags.PENDING)
  const [initPopulateBaicForms,setinitPopulateBaicForms] = useState(WMLUseEffectFlags.PENDING)
  const [initPopulateImagesFields,setInitPopulateImagesFields] = useState(WMLUseEffectFlags.PENDING)
  const [initPopulateListForms,setInitPopulateListForms] = useState(WMLUseEffectFlags.PENDING)
  let routeParms = useParams();

  useLoadFormTribes();
  useLoadFormProvisions();
  useSetBasicFields();
  useSetBasicForms();
  useInitAdminEvent();
  usePopulateBasicFields();
  usePopulateImagesFields();
  usePopulateListForms();
  usePopulateBaicForms();

  return (
    <div className="ManageEvents">
      <div className={classPrefix("MainPod")}>
        <section className={classPrefix("Pod0")}>
          <ShrikhandText params={title}/>
          <div>
            <PrimaryBtn params={returnToAdminBtn}/>
            {params.type === "edit" && <PrimaryBtn  params={deleteEventBtn}/>}
            <PrimaryBtn onClick={params.type ==="create"? handleCreateEvent : handleEditEvent} params={submitBtn}/>
          </div>
        </section>
        <section className={classPrefix("Pod1")}>
        {
          React.Children.toArray(
            enTranslations.ManageEvents.forms
            .map((formInfo,index0)=>{
              let addBtn
              let removeBtn
              let targetForms
              let choice
              if(index0 >=4){
                choice =  [
                  ManageEventsListFormsEnum.PRICES,
                  ManageEventsListFormsEnum.TIMES,
                  ManageEventsListFormsEnum.PROVISIONS,
                ][index0-4]
                targetForms = [pricesForms,timesForms,provisionsForms][index0-4]
                addBtn =[addPriceBtn,addTimeBtn,addProvisionBtn][index0-4]
                removeBtn =[removePriceBtn,removeTimeBtn,removeProvisionBtn][index0-4]
              }

              return (
                <>
                  <h2>{t("ManageEvents.forms."+index0+".title")}</h2>
                  {[0,1,2,3].includes(index0) &&
                    <WMLForm params={
                      [imagesForm,basicsForm,addressForm,vibeScoreForm][index0]
                    }/>
                  }
                  {[4,5,6].includes(index0) &&
                  <>
                    <PrimaryBtn onClick={()=>handleAddForm(choice)} params={addBtn}/>
                    {
                      targetForms.length > 0 &&
                      React.Children.toArray(
                        targetForms.map((form,index1)=>{
                          return <div className={classPrefix("Pod1Item0")} >
                            <p>{index1.toString()}</p>
                            <WMLForm  params={form}/>
                            <SecondaryBtn onClick={()=>handleRemoveForm(index1,choice)}  params={removeBtn}/>
                          </div>
                        })
                      )
                    }
                    {
                      targetForms.length === 0 &&
                      <p>{t("ManageEvents.forms."+index0+".empty")}</p>
                    }
                  </>

                  }
                </>
              )
            })
          )
        }

        </section>
        <section className={classPrefix("Pod2")}>
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={deleteEventIsPresent}
            onClose={handleEventDeleteOnClose}
          >
            <div className={classPrefix("Pod2Item1")}>
              <h2>{t("ManageEvents.edit.deleteConfirmation")}</h2>
              <PrimaryBtn params={confirmDeleteEventBtn} />
            </div>
          </Modal>
        </section>
      </div>
    </div>
  );


  function useLoadFormTribes() {
    useEffect(() => {
      if (genres.length === 0)
        return;
      if (initLoadFormTribes !== WMLUseEffectFlags.ACTIVE)
        return;
      setFormTribes(genres
        .map((item) => {
          return new WMLUIProperty({
            text: item.name,
            value: item.id
          });
        }));
      setinitLoadFormTribes(WMLUseEffectFlags.COMPLETED);
      setinitLoadFormProvisions(WMLUseEffectFlags.ACTIVE);

    }, [genres, initLoadFormTribes]);
  }

  function useLoadFormProvisions() {
    useEffect(() => {
      if (provisions.length === 0)
        return;
      if (initLoadFormProvisions !== WMLUseEffectFlags.ACTIVE)
        return;
      setFormProvisions(provisions
        .map((item) => {
          return new WMLUIProperty({
            text: item.name,
            value: item.id
          });
        }));
      setinitLoadFormProvisions(WMLUseEffectFlags.COMPLETED);
      setInitBasicFields(WMLUseEffectFlags.ACTIVE);


    }, [provisions, initLoadFormProvisions]);
  }

  function useSetBasicFields() {
    useEffect(() => {
      if (initBasicFields !== WMLUseEffectFlags.ACTIVE)
        return;
      toggleOverlayLoading(true);

      setmainImageField(new WMLFormFileParams({
        reactSetter: setmainImageField,
        validators: [ValidatorsFileType()],
        errorMsgs: {
          required: t("ManageEvents.forms.0.fields.mainImg.errorMsgs.required"),
          fileExt: t("ManageEvents.forms.0.fields.mainImg.errorMsgs.fileExt")
        },
        label: t("ManageEvents.forms.0.fields.mainImg.label")
      }));

      setaltImagesField(new WMLFormFileParams({
        reactSetter: setaltImagesField,
        validators: [ValidatorsFileType()],
        limit: 4,
        errorMsgs: {
          fileExt: t("ManageEvents.forms.0.fields.altImgs.errorMsgs.fileExt")
        },
        label: t("ManageEvents.forms.0.fields.altImgs.label")
      }));

      setEventNameField(new WMLFormInputParams({ reactSetter: setEventNameField, label: t("ManageEvents.forms.1.fields.name.label") }));
      setDescriptionField(new WMLFormTextAreaParams({ reactSetter: setDescriptionField, label: t("ManageEvents.forms.1.fields.desc.label"), style: { flex: "0 0 80%" } }));
      setTribeNameField(new WMLFormDropdownParams({ reactSetter: setTribeNameField, label: t("ManageEvents.forms.1.fields.tribe.label"), options: formTribes }));
      setHostedByField(new WMLFormInputParams({ reactSetter: setHostedByField, label: t("ManageEvents.forms.1.fields.hostedBy.label") }));


      setisOnlineField(new WMLFormDropdownParams({ reactSetter: setisOnlineField, label: t("ManageEvents.forms.2.fields.isOnline.label"), options: formIsOnline, style: { flex: "1 0 50%" } }));
      setstreetNumberField(new WMLFormInputParams({ reactSetter: setstreetNumberField, label: t("ManageEvents.forms.2.fields.streetNumber.label"), inputType: InputTypes.streetNumber }));
      setstreetNameField(new WMLFormInputParams({ reactSetter: setstreetNameField, label: t("ManageEvents.forms.2.fields.streetName.label"), inputType: InputTypes.streetName }));
      setunitField(new WMLFormInputParams({ reactSetter: setunitField, label: t("ManageEvents.forms.2.fields.unit.label"), validators: [], inputType: InputTypes.unit }));
      setcityField(new WMLFormInputParams({ reactSetter: setcityField, label: t("ManageEvents.forms.2.fields.city.label"), inputType: InputTypes.city }));
      setstateField(new WMLFormDropdownParams({ reactSetter: setstateField, label: t("ManageEvents.forms.2.fields.state.label"), options: formStates, inputType: InputTypes.state }));
      setzipField(new WMLFormInputParams({ reactSetter: setzipField, label: t("ManageEvents.forms.2.fields.zip.label"), inputType: InputTypes.postalCode }));
      setcountryField(new WMLFormDropdownParams({ reactSetter: setcountryField, label: t("ManageEvents.forms.2.fields.country.label"), value: [0], disabled: true, options: formCountries, inputType: InputTypes.country }));


      setDiversityScoreField(new WMLFormInputParams({ reactSetter: setDiversityScoreField, disabled: true, label: t("ManageEvents.forms.3.fields.diversityScore.label"), value: 0 }));
      setDensityScoreField(new WMLFormInputParams({ reactSetter: setDensityScoreField, disabled: true, label: t("ManageEvents.forms.3.fields.densityScore.label"), value: 0 }));
      setEnergyScoreField(new WMLFormInputParams({ reactSetter: setEnergyScoreField, disabled: true, label: t("ManageEvents.forms.3.fields.energyScore.label"), value: 0 }));
      setFriendlinessScoreField(new WMLFormInputParams({ reactSetter: setFriendlinessScoreField, disabled: true, label: t("ManageEvents.forms.3.fields.friendlinessScore.label"), value: 0 }));
      setAmntOfRatingsField(new WMLFormInputParams({ reactSetter: setAmntOfRatingsField, disabled: true, label: t("ManageEvents.forms.3.fields.amntOfRatings.label"), value: 0 }));
      setCalculatedVibeScoreField(new WMLFormInputParams({ reactSetter: setAmntOfRatingsField, disabled: true, label: t("ManageEvents.forms.3.fields.calculatedVibeScore.label"), value: 0 }));

      setInitBasicFields(WMLUseEffectFlags.COMPLETED);
      setinitBasicForms(WMLUseEffectFlags.ACTIVE);
    }, [initBasicFields]);
  }

  function useSetBasicForms() {
    useEffect(() => {

      if (initBasicForms !== WMLUseEffectFlags.ACTIVE)return;
      if(params.type === "create"){
        updateBasicForms();
        toggleOverlayLoading(false);
      }

      setinitBasicForms(WMLUseEffectFlags.COMPLETED);
      setinitAdminEvent(WMLUseEffectFlags.ACTIVE)
    }, [initBasicForms]);
  }

  function useInitAdminEvent() {
    useEffect(() => {
      if (initAdminEvent !== WMLUseEffectFlags.ACTIVE)
        return;
      if (events.length === 0)
        return;
      if (params.type === "create") {
        setinitAdminEvent(WMLUseEffectFlags.COMPLETED);
        return;
      }
      else {
        let target = events.find((event) => {
          return routeParms.id === event.id;
        });
        if (!target && events.length !== 0) {
          setNotifyParams(
            new NotifyParams({
              isPresent: true,
              severity:NotifyParamsSeverityEnum.INFO,
              text: "This event may have been deleted. Please try again later or contact support if the issue persists",
            })
          );
          navigate(ENV.nav.urls.admin);
          return;
        }
        else {
          setCurrentAdminEvent(target);
          setinitAdminEvent(WMLUseEffectFlags.COMPLETED);
          setinitPopulateBasicFields(WMLUseEffectFlags.ACTIVE)
        }
      }
    }, [initAdminEvent, events]);
  }

  function usePopulateBasicFields() {
    useEffect(() => {
      if (initPopulateBasicFields !== WMLUseEffectFlags.ACTIVE)
        return;
      let formStateValue = formStates.find((state) => {
        return currentAdminEvent.address.state === state.text;
      }).value;
      let formCountryValue = formCountries.find((target) => {
        return currentAdminEvent.address.country === target.text;
      }).value;
      setEventNameField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.title
        });
        return myNew;
      });

      setTribeNameField((olds) => {
        let myNew = new WMLFormDropdownParams({
          ...olds,
          value:[currentAdminEvent.genre.id]
        });
        return myNew;
      });

      setDescriptionField((olds) => {
        let myNew = new WMLFormTextAreaParams({
          ...olds,
          value: currentAdminEvent.desc
        });
        return myNew;
      });

      setHostedByField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.hostInfo.fullName
        });
        return myNew;
      });


      setisOnlineField((olds) => {
        let myNew = new WMLFormDropdownParams({
          ...olds,
          value: [formIsOnline[1].value]
        });
        return myNew;
      });

      setstreetNumberField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.address.number
        });
        return myNew;
      });

      setstreetNameField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.address.streetName
        });
        return myNew;
      });

      setunitField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.address.unit
        });
        return myNew;
      });

      setcityField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.address.city
        });
        return myNew;
      });

      setstateField((olds) => {
        let myNew = new WMLFormDropdownParams({
          ...olds,
          value: [formStateValue]
        });
        return myNew;
      });

      setzipField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.address.zip
        });
        return myNew;
      });

      setcountryField((olds) => {
        let myNew = new WMLFormDropdownParams({
          ...olds,
          value: [formCountryValue]
        });
        return myNew;
      });

      setDiversityScoreField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.vibeScore.diversity
        });
        return myNew;
      });

      setDensityScoreField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.vibeScore.density
        });
        return myNew;
      });

      setEnergyScoreField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.vibeScore.energy
        });
        return myNew;
      });

      setFriendlinessScoreField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.vibeScore.friendliness
        });
        return myNew;
      });

      setAmntOfRatingsField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.vibeScore.amountOfRatings
        });
        return myNew;
      });

      setCalculatedVibeScoreField((olds) => {
        let myNew = new WMLFormInputParams({
          ...olds,
          value: currentAdminEvent.displayVibeScore
        });
        return myNew;
      });


      setinitPopulateBasicFields(WMLUseEffectFlags.COMPLETED);
      setInitPopulateImagesFields(WMLUseEffectFlags.ACTIVE)

    }, [initPopulateBasicFields]);
  }

  function usePopulateImagesFields() {
    useEffect(() => {
      if (initPopulateImagesFields !== WMLUseEffectFlags.ACTIVE)
        return; (async () => {

          let populateMain = new WMLFormFileParams({
            ...mainImageField,
            value: [currentAdminEvent.mainImg]
          });
          let populateAlt = new WMLFormFileParams({
            ...altImagesField,
            value: currentAdminEvent.altImgs
          });
          try{
            await populateMain.updateFiles([currentAdminEvent.mainImg]);
            await populateAlt.updateFiles(currentAdminEvent.altImgs);
            setmainImageField(populateMain);
            setaltImagesField(populateAlt);
          }
          catch(e) {
            setNotifyParams(
              new NotifyParams({
                severity:NotifyParamsSeverityEnum.ERROR,
                isPresent:true,
                text:t("ManageEvents.wmlNotify.loadImagesFail")
              })
            )
          }
          setInitPopulateImagesFields(WMLUseEffectFlags.COMPLETED);
          setInitPopulateListForms(WMLUseEffectFlags.ACTIVE)

        })();

    }, [initPopulateImagesFields]);
  }

  function usePopulateListForms() {
    useEffect(() => {

      if (initPopulateListForms !== WMLUseEffectFlags.ACTIVE)
        return;
      let provisionsForms = currentAdminEvent.provisions.map((prov) => {
        let chosen = provisions.find((listItem) => listItem.name === prov.name);
        let fields = listFormsData[ManageEventsListFormsEnum.PROVISIONS].fields();
        fields[0].value = [chosen.id];
        fields[1].value = prov.desc;
        return new WMLFormParams({ fields });
      });
      listFormsData[ManageEventsListFormsEnum.PROVISIONS].reactSetter(provisionsForms);

      let timesForms = currentAdminEvent.schedules.map((schedule) => {

        let fields = listFormsData[ManageEventsListFormsEnum.TIMES].fields();
        fields[0].value = schedule.start.utc;
        fields[1].value = schedule.end.utc;
        return new WMLFormParams({ fields });

      });
      listFormsData[ManageEventsListFormsEnum.TIMES].reactSetter(timesForms);

      let pricesForms = currentAdminEvent.prices.map((price) => {
        let fields = listFormsData[ManageEventsListFormsEnum.PRICES].fields();
        fields[0].value = price.ticketName;
        fields[1].value = price.value;
        return new WMLFormParams({ fields });

      });
      listFormsData[ManageEventsListFormsEnum.PRICES].reactSetter(pricesForms);


      setInitPopulateListForms(WMLUseEffectFlags.COMPLETED);
      setinitPopulateBaicForms(WMLUseEffectFlags.ACTIVE);
    }, [initPopulateListForms]);
  }

  function usePopulateBaicForms() {
    useEffect(() => {

      if (initPopulateBaicForms !== WMLUseEffectFlags.ACTIVE)
        return;
      updateBasicForms();
      toggleOverlayLoading(false);
      setinitPopulateBaicForms(WMLUseEffectFlags.COMPLETED);
    }, [initPopulateBaicForms]);
  }
}
