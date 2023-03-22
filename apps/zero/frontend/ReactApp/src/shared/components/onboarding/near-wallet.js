// near wallet:
import { Wallet } from "src/contexts/NearWalletContext";

// Wallet provider:
// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({network: "mainnet"});
export default wallet;
