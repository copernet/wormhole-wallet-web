const enMessage = {
  account: {
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    formTittle: 'Welcome!',
    formSignTitle: 'Create Your Wallet',
    username: 'Wallet ID',
    usernameHelper: 'Find the Wallet ID in your email, e.g. ',
    password: 'Password',
    login: 'Login',
    email: 'Email',
    confirmPassword: 'Confirm Password',
    invalidEmail: 'Invalid email address',
    required: 'Required',
    invalidPassword: 'at least 8 length and must have three types of UpperCase/LowerCase/Numbers/Symbols',
    passNoMath: 'Passwords do not match',
    signDes: 'I have read and agreed to the ',
    disclaimer: 'Disclaimer',
    termsOfService: 'Terms of Service',
    invalidCredential: 'Sorry, we could not validate your credentials. Please check them and try again',
    attention: {
      title: 'Attention Please',
      imporTipFirstStage: 'We have send your',
      imporTipSecondStage: 'to your email.',
      imporTipSecond: 'Please go to your Email to see.',
      imporDesc: 'Wallet ID is your unique identifier.It is completely individual to you, and it is what you will use to log in and access your wallet.',
      iknow: 'I know'
    },
    usingMfa: "I'm using Multi Factor Authentication",
    mfaTips: "Have not set MFA yet? Login and add one to your account under 'Settings'"
  },
  homePage: {
    propertyHistory: {
      title: 'Property History'
    },
    owners: {
      title: 'Owners',
      address: 'Issuance Address',
      ownerAddress: 'Owner Address',
      id: 'Asset ID',
      name: 'Asset Name'
    },
    tradingHistory: {
      assets: 'assets history',
      bch: 'bch history'
    },
    confirm: {
      title: 'Confirm?',
      ok: 'Agree',
      cancel: 'Disagree'
    },
    menu: {
      myaddress: 'My Address',
      explorer: 'Explorer',
      setting: 'Setting'
    },
    history: {
      chooseAddress: 'Choose Address',
      goHistory: 'History'
    },
    explorer: {
      transactions: {
        exTransactions: 'Transactions'
      },
      assets: {
        exAssets: 'Assets'
      },
      activeCrowdSales: {
        exCrowdSales: 'Active Crowdsales'
      },
      participate: {
        title: 'Participate Crowdsales',
        participate: 'Participate',
        subTitle: 'Participate on Crowdsale',
        toAddress: 'To Address',
        fromAddress: 'From Address',
        sendAmount: 'Send Amount(WHC)',
        fees: 'Miner Fees'
      }
    },
    myWallet: {
      walletName: 'My Wallet',
      walletOverview: 'Overview',
      walletAddresses: 'My Addresses',
      walletAssets: 'Assets',
      walletHistory: 'History',
      walletSend: 'Send',
      create: 'create asset',
      whc: 'WHC',
      lenovoInput: {
        searchPlaceholder: 'Search Property Name Or Property Id',
        empty: 'No Records',
        searchTips: 'Choose Property'
      },
      choseFees: {
        fast: 'Fast',
        normal: 'Normal',
        slow: 'Slow'
      },
      smartP: {
        name: 'Smart Property',
        nameRequired: 'example:RickCoin',
        title: 'Create Smart Property',
        detailTitle: 'Smart Property details',
        issuanceTitle: 'Issuance Details',
        subName: 'Name',
        category: 'Category',
        subCategory: 'Subcategory',
        url: 'Property URL',
        urlHelper: 'Enter a url for more info on the Smart Property',
        smartDes: 'Property Description',
        tokenNum: 'Number of Tokens',
        tokenNumHelper: 'Enter desired amount',
        address: 'Issuance Address',
        fees: 'Miner Fees(BCH)',
        required: '>= 0.00000001 BCH',
        precision: 'precision',
        factorage: 'factorage',
        factorageNeed: 'need 1 WHC',
        balance: 'BCH Balance'
      },
      sendAll: {
        name: 'Send All',
        title: 'Transfer account all Token',
        fromAddress: 'From address',
        toAddress: 'To address'
      },
      airDrop: {
        name: 'Air Drop',
        propertyName: 'Property Name',
        amount: 'Property Amount',
        target: 'Target Property '
      },
      managedP: {
        name: 'Managed Property',
        title: 'Create Managed Property'
      },
      crowdSale: {
        name: 'Crowdsale',
        readName: 'Property Name',
        nameRequired: 'example:RickCoin',
        title: 'Start A Crowdsale',
        detailTitle: 'Smart Property details',
        subName: 'Name',
        category: 'Category',
        subCategory: 'Subcategory',
        url: 'Property URL',
        urlHelper: 'Enter a url for more info on the Smart Property',
        smartDes: 'Smart Property Description',
        subDetails: 'Crowdsale Details',
        deadline: 'Deadline',
        time: 'UTC',
        bonus: 'Weekly Early Bird Bonus Percentage',
        bonusRequired: '0 ~ 255',
        numberPropertiesRequired: '(0.00000001 ~ 100000000)',
        rates: 'Rates',
        per: 'WHC',
        invested: 'Invested',
        address: 'Issuance Address',
        newAddress: 'New Issuance Address',
        required: '>= 0.00000001 BCH',
        fees: 'Miner Fees(BCH)',
        tokens: 'Rates Of Tokens Per Whc',
        precision: 'Precision',
        total_number: 'Number Of Tokens'
      },
      crowdDetails: {
        changeAddress: 'Change Issuer',
        shutDown: 'Revoke',
        submit: 'Submit',
        inputFees: 'Input Fees',
        bought: 'Tokens already bought by participants'
      },
      propertyDetails: {
        smartName: 'Smart Property',
        manageName: 'Managed Property',
        inputAddress: 'Input Address',
        inputFees: 'Fees',
        addProperty: 'Grant Token',
        amount: 'Amount',
        note: 'Note',
        shut: 'Revoke'
      },
      whcDetails: {
        name: 'WHC Details',
        amount: 'Amount',
        note: 'Note',
        url: 'Url',
        precision: 'Amount Precision',
        back: 'Back'
      },
      myAssets: {
        title: 'Create WHC',
        titleDes: 'Issuance Details',
        tokenDes: 'Number of burning BCH',
        issuance: 'Issuance Address',
        fees: 'Miner Fees (>= 0.00000001 BCH)',
        cancel: 'Cancel',
        next: 'Next',
        redeem: 'Redeem Address',
        redeemDes: 'Input Redeem Address',
        name: 'My Assets',
        pId: 'Property ID',
        pName: 'Property Name',
        pAmount: 'Total Amount',
        pUrl: 'Url',
        blockCreateTime: 'Block Time',
        protocol: 'click question mark to know Issuance protocol'
      },
      send: {
        name: 'Send',
        sendBch: '>= 0.00000546 BCH',
        choose: 'Choose coin',
        fromAddress: 'From Address',
        amount: 'Send Amount',
        toAddress: 'To Address',
        add: 'Add BCH Address',
        warning: 'check validity of input data please'
      },
      cancel: 'Cancel',
      next: 'Next'
    },
    success: 'success',
    required: 'required',
    accountSetting: {
      settingGeneral: 'General',
      passwordText: 'Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordDesc: 'Your password is never stored on our servers. We cannot access or reset your password. The only way to restore your wallet is through your backup phrase.Make sure you write down your backup phrase which is the only way to restore access to your wallet in the event of a lost password.',
      emailChange: 'Change Email Address',
      emailDesc: 'Your verified email address is used to send login codes when suspicious or unusual activity is detected, to remind you of your wallet login ID',
      verifyCurrentPass: 'Verify Current Password',
      changePass: 'Change Password',
      walletIdDesc: 'Wallet ID is your unique identifier.It is completely individual to you, and it is what you will use to log in and access your wallet.It is NOT a blockchain address for sending or receiving.',
      walletIdWarn: 'Do not share your Wallet ID with others.',
      changeEmail: 'Change Email',
      mfa: {
        title: 'Setup Multifactor authentication',
        desc: 'Download the applications that support MFA.Do not share your MFA Code with others.(Authy,Google Authenticator, etc..)',
        setupGuide: 'To setup your account to require an MFA device scan the QR code below or manually enter the secret listed below into your MFA Device/Software (Authy,Google Authenticator, etc..)',
        setupTitle: 'MFA Setup',
        yourtokenS: 'Your Token Secret is',
        storeDesc: 'Store this safely and securely because Anyone with this secret will be able to duplicate your MFA authorization codes.',
        entercurr: 'Enter the current code being displayed on your MFA device to validate and complete the setup.',
        personalQue: 'Personal Security Question',
        personalAns: 'Personal Security Question Answer',
        disableTitle: 'Disable MFA',
        disableDesc: 'You currently have an MFA Device setup on your account. Type DISABLE and then enter your current MFA code to deactivate.',
        mfacode: 'MFA Code'
      }
    },
    overview: {
      title: 'Overview',
      walletOptions: 'Wallet Options',
      backup: 'BackUp',
      import: 'Import',
      address: 'Address',
      balance: 'Balance',
      yourWalletId: 'Your Wallet Id',
      export: {
        title: 'Export Wallet',
        backUpName: 'Backup Name',
        enterPass: 'Enter your account password',
        tradeTip: 'Exported trading address',
        watchTip: 'Exported watch address',
        offlineTip: 'Exported offline address',
        error: 'Error exporting ',
        errorDecrypt: 'Error decrypting wallet. Check your details and try again.'
      },
      importSection: {
        title: 'Import a Wallet Backup',
        uploadDesc: 'Upload backup file',
        importWallet: 'Import Wallet',
        imported: 'Imported',
        loadingText: 'Import process is in progress. Hang on...'
      },
      validate: {
        validated: 'validated',
        invalid: 'invalid',
        errorValid: 'Error validateing',
        errorDuring: 'Error during validation'
      },
      unconfirmed: 'unconfirmed',
      confirmed: 'confirmed'
    },
    myaddress: {
      myAddress: 'My Addresses',
      viewBy: 'View By',
      addresses: 'Addresses',
      addAddress: 'Add Address',
      assets: 'Assets',
      createNewAddress: 'Create New Address',
      importAddressWithPri: 'Import Address With Private Key',
      actions: 'Actions',
      pubkey: 'Pubkey',
      signMessage: 'Sign Message',
      removeFromWallet: 'Remove from Wallet',
      yourAddress: 'Your Address',
      signMsgDesc: 'Enter your message below and click sign, to sign it with the signing address',
      signingAddress: 'Signing Address',
      signMsgYourWant: 'The Message that you want to sign',
      signedMsg: 'Signed Message',
      sign: 'Sign',
      removeDesc: 'Remove from your wallet',
      areyousure: 'Are you sure',
      removeDescDetails: "Removing this address from your wallet won't destroy any funds kept in it, but if this is the only place you have your private key stored, you will permanently lose the ability to move or cash them in!",
      removeTips: 'Be very sure your keys are backed up and you mean to do this!',
      yesremove: 'Yes,Remove Address',
      address: 'Address',
      import: {
        title: 'Import a BCH/WHC Private Key',
        enter: 'Enter Private Key',
        key: 'Private Key',
        enbale: 'Enable Sending',
        keyholder: 'enter your private key, formats: hex, b64, WIF, compressed WIF',
        valid: 'Must be a valid Bitcoin Cash address'
      },
      cannotremoveTips: "You can't delete the last address"
    }
  },
  common: {
    change: 'Change',
    cancel: 'Cancel',
    save: 'Save',
    email: 'Email',
    validate: 'Validate',
    send: 'Send',
    walletId: 'Wallet ID',
    submit: 'Submit',
    setup: 'Setup',
    assetsName: 'Assets Name',
    amount: 'Amount',
    copied: 'copied',
    propertyName: 'Property Name'
  },
  tips: {
    registerSuccess: 'Register Success',
    loginSuccess: 'Login Success',
    updateSuccess: 'Update Success',
    addSuccess: 'Add Success',
    commonError: 'System error,please try later'
  },
  index: {
    whcWallet: {
      title: ' Assets Management',
      desc: 'You can create Fixed token,the Crowdsale token,and Managed token'
    },
    yourbank: {
      title: 'Secure Wormhole Wallet',
      desc: 'The safest and most popular wallet for investing and storing wormhole token'
    },
    esayWallet: {
      title: 'The easiest crypto wallet',
      desc: 'Take full control of your tokens by storing them on your own device.'
    },
    securitySlide: {
      title: 'Security',
      desc: 'We never store your password.And Private keys are never sent to the server except in an encrypted form'
    },
    sendReceiveSlide: {
      title: 'Send & Receive',
      desc: 'Whether you’re sending to a friend or transacting for business, Blockchain allows you to send and receive Wormhole Token  with the lowest fees.'
    },
    buySellSlide: {
      title: 'Burn & Assets',
      desc: 'You can get Whc assets by burning the BCH. And then You can create Fixed token,the Crowdsale token,and Managed token'
    },
    welcomeDesc: 'Welcome To Wormhole Wallet ：）',
    whatiswhcwallet: {
      title: 'What Is Wormhole Wallet ？',
      desc: 'Wormhole Wallet is a convenient way for you to organize your crypto-currency addresses. You can think of a Wallet as a portfolio that contains multiple accounts. Each wallet has a Wallet ID. When you create a new wallet we generate a brand new random Wallet ID for you. This ID enables you to login and access your wallet.'
    },
    howshouldget: {
      title: 'How Should I Get WHC ？',
      desc: 'You can get WHC assets by burning the Bitcoin Cash'
    }
  },
  faq: {
    title: 'FAQ',
    one: {
      que: '1.What is WHC？',
      ans: 'Wormhole Cash (WHC) is the native token for Wormhole protocol'
    },
    two: {
      que: '2.How to obtain WHC？',
      ans: 'WHC is generated by the Proof-of-Burn (PoB) mechanism. BCH users can send one or more BCH to address qqqqqqqqqqqqqqqqqqqqqqqqqqqqqu08dsyxz98whc to generate WHC after official launch of Wormhole protocol. If less than one BCH is sent to the address, then no WHC will be generated. This “burn to generate” process is subject to rollback risk of the underlying blockchain. Therefore, WHC can only be generated after 1000 confirmations of the corresponding transaction. 1 BCH can get 100 WHC.'
    },
    three: {
      que: '3.What is the role of WHC?',
      ans: 'Wormhole protocol layer has no control of BCH layer when executing smart contract and in this case there is no way to realize transaction. Besides, we need WHC to serve as gas when executing smart contract to prevent abuse of BCH network,so there is Wormhole Cash (WHC)'
    },
    four: {
      que: '4.What is the role of the wallet ID？',
      ans: "The Wallet ID is your unique identity that you can use to log in or access your wallet. Please note that the wallet ID is not a blockchain address. Please don't share your wallet ID with others"
    },
    five: {
      que: '5.What is ERC-20 token',
      ans: "ERC20 defines a set of rules which need to be met in order for a token to be accepted and called an 'ERC20 Token'. The standard rules apply to all ERC20 Tokens since these rules are required to interact with each other on the Ethereum network. ERC-20 tokens are fungible. This is the «money-like» standard. Each ERC-20 token is completely the same and has completely the same value as others. It’s like dollars – each 5 dollars bill has a value of 5 USD."
    },
    six: {
      que: '6.What is ERC-721 token',
      ans: 'ERC-721 is a free, open standard that describes how to build non-fungible or unique tokens on the Ethereum blockchain. While most tokens are fungible (every token is the same as every other token), ERC-721 tokens are all unique. ERC-721 tokens are non-fungible. This is the «things-like» standard. Each ERC-721 token is different from others – it has other characteristics. As Cryptokitties, where every of them is unique.'
    },
    seven: {
      que: '7.What is the difference between ERC-20 and ERC-721?',
      ans: 'ERC-721 is a free, open standard that describes how to build non-fungible or unique tokens on the Ethereum blockchain. While most tokens are fungible (every token is the same as every other token), ERC-721 tokens are all unique. ERC-721 tokens are non-fungible. This is the «things-like» standard. Each ERC-721 token is different from others – it has other characteristics. As Cryptokitties, where every of them is unique.The main distinguishing feature of ERC-721 from the usual ERC-20 is that this type of tokens is non-fungible (NFT). NFT indicates that each token is unique, that is each token of ERC-721 has a unique Token ID. Moreover, ERC-20 has the standard Token interface. ERC-20 token can be infinitely subdivided into 1018 copies.ERC-721 defines a minimum interface a smart contract must implement to allow unique tokens to be managed, owned, and traded. It does not mandate a standard for token metadata or restrict adding supplemental functions. The minimum unit of ERC-721 token is 1 and it cannot be divided.'
    },
    eight: {
      que: '8.How to create a wallet',
      ans: 'Users can fill in available e-mail on the wallet creation page, set password, complete human-machine authentication and click to register. We will send the wallet ID to a specified mailbox, then users can create wallet via wallet ID and password set earlier.'
    },
    nine: {
      que: '9.How to backup your wallet',
      ans: 'Click "wallet option" button in the top right corner. Click "backup" in the pop-up options. Fill in wallet ID and password in the pop-up box, click the verify button. After authentication, the backup files of wallet will be automatically backed up to the specified directory, then users can complete Wallet backup.'
    },
    ten: {
      que: '10.How to import your wallet',
      ans: 'Click the "wallet option" button in the top right corner. Click "Import" in the pop-up options. Click "+" on the right of pop-up box, select the and upload wallet backup file from users’ wallet backup path, click “OK” to complete the wallet import.'
    },
    eleven: {
      que: '11.How to issue your own ERC-20 token use the Wormhole wallet',
      ans: 'Click "My Address" , click "Asset" in sub menu. Click "Create Assets" in the top right corner of ‘asset page’. Select the assets for your needs in the popup drop-down menu. Fill in the parameters of issued tokens on ‘ Create Asset’ page which will help you issue ERC-20 tokens. Note that WHC will be spent when users create assets.'
    }
  }
}

export default enMessage
