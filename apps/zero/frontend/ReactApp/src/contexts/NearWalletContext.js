// near api js
import { providers } from 'near-api-js';

// wallet selector UI
import '@near-wallet-selector/modal-ui/styles.css';
import { setupModal } from '@near-wallet-selector/modal-ui';
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png';
import MeteorIconUrl from '@near-wallet-selector/meteor-wallet/assets/meteor-icon.png';
import HereWalletIconUrl from '@near-wallet-selector/here-wallet/assets/here-wallet-icon.png';

// wallet selector options
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";

// react
import { useNavigate } from "react-router-dom";
import { ENV } from 'src/environments/environment';

const THIRTY_TGAS = '30000000000000';
const NO_DEPOSIT = '0';

// Wallet that simplifies using the wallet selector
export class Wallet {
  walletSelector;
  wallet;
  network;
  mintDetails
//   createAccessKeyFor;

  constructor({
    // createAccessKeyFor = undefined,
    network = 'testnet' }) {
    // Login to a wallet passing a contractId will create a local
    // key, so the user skips signing non-payable transactions.
    // Omitting the accountId will result in the user being
    // asked to sign all transactions.
    // this.createAccessKeyFor = createAccessKeyFor
    this.network = 'mainnet'
  }

  // To be called when the website loads
  async startUp() {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [setupMyNearWallet({ iconUrl: MyNearIconUrl }),
        setupMeteorWallet({ iconUrl: MeteorIconUrl }),
        setupHereWallet({ iconUrl: HereWalletIconUrl }),
    ],
    });
    this.mintDetails = this.walletSelector
    const isSignedIn = this.walletSelector.isSignedIn();

    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet();
      this.accountId = this.walletSelector.store.getState().accounts[0].accountId;
    }

    return isSignedIn;
  }

  enableMint() {
    const connectedWallet = this.walletSelector
    return connectedWallet
  }

  // Sign-in method
  signIn() {
    const description = 'Please select a wallet to sign in.';
    const modal = setupModal(this.walletSelector, {
        contractId: ENV.nearContractAddress.contract,
        description });
    modal.show();
    window.selector = this.walletSelector;

  }

  // Sign-out method
  signOut() {
    this.wallet.signOut();
    this.wallet = this.accountId
    // = this.createAccessKeyFor
    = null;
  }
}
