
// wallet selector options
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import NearIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import SenderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";


//wallet selector UI
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal } from '@near-wallet-selector/modal-ui';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';
import { ENV } from 'src/environments/environment';
import { WMLError } from 'src/core/utility/common-utils';



export const NearWalletPopup = async (walletProps, event) => {
    try{
        const {setNearAccount, setNearConnector} = walletProps

        const walletSelector = await setupWalletSelector({
            network: "mainnet",
            modules: [
              setupMyNearWallet({ iconUrl: MyNearIconUrl }),
              setupNearWallet({ iconUrl: NearIconUrl }),
              setupSender({ iconUrl: SenderIconUrl }),
            ],
        })

        const isSignedIn = walletSelector.isSignedIn()
        window.selector = walletSelector
        if(isSignedIn) {
            setNearAccount(walletSelector.store.getState().accounts[0].accountId)
            setNearConnector(walletSelector)
            return "Connected"
        }
        if(!isSignedIn && event ) {
            const modal = setupModal(walletSelector, {
                contractId: ENV.nearContractAddress.contract,
                description: "Please select a wallet to sign in.."
              });
              modal.show();
        }
    }
    catch(e){
        return new WMLError({
            msg:"Issue Connecting With Near"
        })
    }

}


