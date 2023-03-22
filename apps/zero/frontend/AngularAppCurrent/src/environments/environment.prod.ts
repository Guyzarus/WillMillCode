import { DevEnv, traverseClassAndRemoveAutomationForProduction } from "./environment.dev"
import {  mainnet } from '@wagmi/core'

export let environment = {
  production: true
}
class ProdEnv extends DevEnv  {


  constructor(){
    super()
    this.frontendDomain0 ="https://www.niblscoin.com"
    this.backendDomain0 = "https://nibls-flask-backend-0.azurewebsites.net"
    this.blockchainService.chains  = [mainnet]
    traverseClassAndRemoveAutomationForProduction(this)
  }
}


export let ENV =   new ProdEnv()
