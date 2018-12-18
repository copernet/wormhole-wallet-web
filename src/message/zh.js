const enMessage = {
  account: {
    signOut: '注销',
    signUp: '注册',
    formTittle: '欢迎!',
    formSignTitle: '创建钱包',
    username: '钱包ID',
    usernameHelper: '在您的邮箱中可找到钱包ID，如',
    password: '密码',
    login: '登录',
    email: '邮箱',
    confirmPassword: '确认密码',
    invalidEmail: '无效的邮件地址',
    required: '必填项',
    invalidPassword: '长度至少为8位，且必须含有大写字母/小写字母/数字/特殊字符中的3种',
    passNoMath: '密码不匹配',
    signDes: '我已阅读并同意 ',
    disclaimer: '免责声明',
    termsOfService: '服务条款',
    invalidCredential: '验证信息有误，请重新输入',
    attention: {
      title: '请注意',
      imporTipFirstStage: '已发送您的',
      imporTipSecondStage: '至您的邮箱',
      imporTipSecond: '请到您邮箱中查看',
      imporDesc: '钱包ID是您独特的身份标识，您可使用它登录或访问您的钱包',
      iknow: '我知道了'
    },
    usingMfa: '我正在使用多重身份验证',
    mfaTips: '尚未设置MFA?请登录并在账户设置中添加'
  },
  homePage: {
    propertyHistory: {
      title: '资产记录'
    },
    owners: {
      title: '持有者列表',
      address: '发行者地址',
      ownerAddress: '持有者地址',
      id: '资产ID',
      name: '资产名称'
    },
    tradingHistory: {
      assets: '资产交易记录',
      bch: 'BCH 交易记录'
    },
    confirm: {
      title: '确定提交?',
      ok: '同意',
      cancel: '不同意'
    },
    menu: {
      myaddress: '我的地址',
      explorer: '浏览',
      setting: '设置'
    },
    history: {
      chooseAddress: '选择地址',
      goHistory: '历史'
    },
    explorer: {
      transactions: {
        exTransactions: '交易'
      },
      assets: {
        exAssets: '资产'
      },
      activeCrowdSales: {
        exCrowdSales: '活跃众筹'
      },
      participate: {
        title: '参与众筹',
        participate: '参与',
        subTitle: '众筹',
        toAddress: '至地址',
        fromAddress: '从地址',
        sendAmount: '发送数量（WHC）',
        fees: '矿工费'
      }
    },
    myWallet: {
      walletName: '我的钱包',
      walletOverview: '概览',
      walletAddresses: '我的地址',
      walletAssets: '资产',
      walletHistory: '历史',
      walletSend: '发送',
      create: '创建资产',
      whc: 'WHC',
      lenovoInput: {
        searchPlaceholder: '搜索资产名称或资产ID',
        empty: '没有记录',
        searchTips: '选择资产'
      },
      choseFees: {
        fast: '快速',
        normal: '正常',
        slow: '慢速'
      },
      smartP: {
        name: '智能资产',
        nameRequired: '如：瑞克币（ Rickcoin）',
        title: '创建智能资产',
        detailTitle: '智能资产详情',
        issuanceTitle: '发行详情',
        subName: '名称',
        category: '分类',
        subCategory: '子分类',
        url: '资产URL',
        urlHelper: '输入URL了解更多智能资产详情',
        smartDes: '资产描述',
        tokenNum: 'Token数量',
        tokenNumHelper: '输入Token数量',
        address: '发行地址',
        fees: '矿工费(BCH)',
        required: '大于或等于0.00000001 BCH',
        precision: '精度',
        factorage: '手续费',
        factorageNeed: '需要一个WHC',
        balance: 'BCH余额'
      },
      sendAll: {
        name: '发送全部',
        title: '转出账户中所有Token',
        fromAddress: '从地址',
        toAddress: '至地址'
      },
      airDrop: {
        name: '空投',
        propertyName: '资产名称',
        amount: '资产数量',
        target: '目标资产'
      },
      managedP: {
        name: '可管理资产',
        title: '创建可管理资产'
      },
      crowdSale: {
        name: '众筹',
        readName: '资产名称',
        nameRequired: '如瑞克币（Rickcoin)',
        title: '开始众筹',
        detailTitle: '智能资产详情',
        subName: '名称',
        category: '分类',
        subCategory: '子分类',
        url: '资产URL',
        urlHelper: '输入url了解更多智能资产详情',
        smartDes: '智能资产描述',
        subDetails: '众筹详情',
        deadline: '截止日期',
        time: 'UTC',
        bonus: '早鸟奖励',
        bonusRequired: '0 ~ 255',
        numberPropertiesRequired: '(0.00000001 ~ 100000000)',
        rates: '费率',
        per: 'WHC',
        invested: '已投资',
        address: '发行地址',
        newAddress: '新的发行地址',
        required: '大于或等于 0.00000001 BCH',
        fees: '矿工费(BCH)',
        tokens: 'Token费率(每Whc)',
        precision: '精度',
        total_number: 'Token数量'
      },
      crowdDetails: {
        changeAddress: '变更发行者',
        shutDown: '销毁',
        submit: '提交',
        inputFees: '输入费用',
        bought: '参与者已购买的Token'
      },
      propertyDetails: {
        smartName: '智能资产',
        manageName: '可管理资产',
        inputAddress: '输入地址',
        inputFees: '费用',
        addProperty: '增发',
        amount: '数量',
        note: '备注',
        shut: '销毁'
      },
      whcDetails: {
        name: 'WHC详情',
        amount: '数量',
        note: '备注',
        url: 'Url',
        precision: '数量精度',
        back: '返回'
      },
      myAssets: {
        title: '创建WHC',
        titleDes: '发行详情',
        tokenDes: '燃烧BCH的数量',
        redeemDes: '输入找零地址',
        issuance: '发行地址',
        fees: '矿工费 (>= 0.00000001 BCH)',
        cancel: '取消',
        next: '下一步',
        redeem: '赎回',
        name: '我的资产',
        pId: '资产ID',
        pName: '资产名称',
        pAmount: '总量',
        pUrl: 'Url',
        blockCreateTime: '区块时间',
        protocol: '单击问号了解发布协议'
      },
      send: {
        name: '发送',
        sendBch: '大于等于0.00000001 BCH',
        choose: '选择币种',
        fromAddress: '从地址',
        amount: '发送数量',
        toAddress: '至地址',
        add: '添加BCH地址',
        warning: '请检查输入数据的有效性'
      },
      cancel: '取消',
      next: '下一步'
    },
    success: '成功',
    required: '必填项',
    accountSetting: {
      settingGeneral: '概览',
      passwordText: '密码',
      currentPassword: '当前密码',
      newPassword: '新密码',
      confirmPassword: '确认密码',
      passwordDesc: '您的密码绝不会存储在我们的服务器中。我们无法访问或重置您的密码。唯有通过验证备份信息您方可恢复钱包。请确保您已写下备份信息，因为这是您在密码丢失的情况下恢复访问钱包的唯一方式。',
      emailChange: '更改邮箱地址',
      emailDesc: '当发现可疑或异常时，您已验证的邮箱地址可用于发送登录码以此提醒您的钱包登录ID',
      verifyCurrentPass: '验证当前密码',
      changePass: '更改密码',
      walletIdDesc: '钱包ID是您独特的身份标识，您可使用它登录或访问您的钱包。请注意钱包ID并非区块链地址。',
      walletIdWarn: '请不要与他人共享您的钱包ID',
      changeEmail: '更改邮箱',
      mfa: {
        title: '设置多因素身份验证',
        desc: '下载支持MFA的应用，不要与他人共享您的MFA码(Authy,Google 验证, 等等..)',
        setupGuide: '设置您的账户需用MFA装置扫描以下二维码，或手动输入密码到您的MFA装置或软件中(Authy,Google 验证, 等等..)',
        setupTitle: 'MFA设置',
        yourtokenS: '您的Token密码是',
        storeDesc: '请妥善保管，因为持有此密码的任何人都可复制您的MFA授权码',
        entercurr: '输入您MFA认证设备上展示的验证码，以验证及设置',
        personalQue: '个人安全问题',
        personalAns: '个人安全问题的答案',
        disableTitle: '取消MFA',
        disableDesc: '您的账户已经设置了MFA。输入“DISABLE"字样以及您MFA认证设备上展示的验证码，以取消MFA',
        mfacode: 'MFA授权码'
      }
    },
    overview: {
      title: '概览',
      walletOptions: '钱包选项',
      backup: '备份',
      import: '导入',
      address: '地址',
      balance: '余额',
      yourWalletId: '钱包ID',
      export: {
        title: '导出钱包',
        backUpName: '备份名称',
        enterPass: '输入账户密码',
        tradeTip: '已导出的交易地址',
        watchTip: '已导出的观察地址',
        offlineTip: '已导出的离线地址',
        error: '错误导出',
        errorDecrypt: '解析钱包出错，请检查后再试.'
      },
      importSection: {
        title: '导入钱包备份',
        uploadDesc: '上传备份文件',
        importWallet: '导入钱包',
        imported: '已导入',
        loadingText: '正在导入地址，请稍候...'
      },
      validate: {
        validated: '已验证',
        invalid: '无效',
        errorValid: '验证错误',
        errorDuring: '验证过程中出现错误'
      },
      unconfirmed: '未确认',
      confirmed: '已确认'
    },
    myaddress: {
      myAddress: '我的地址',
      viewBy: '查看',
      addresses: '地址',
      addAddress: '添加地址',
      assets: '资产',
      createNewAddress: '创建新地址',
      importAddressWithPri: '用私钥导入地址',
      actions: '操作',
      pubkey: '公钥',
      signMessage: '签名信息',
      removeFromWallet: '删除钱包',
      yourAddress: '您的地址',
      signMsgDesc: '请输入您的签名信息并点击签名',
      signingAddress: '正在签名的地址',
      signMsgYourWant: '您想签名的信息',
      signedMsg: '已签名的信息',
      sign: '签名',
      removeDesc: '从您的钱包删除',
      areyousure: '您确定吗？',
      removeDescDetails: '从您的钱包中删除这一地址不会对存储其中的资金有任何损害，但如果您只在这一位置存储私钥，您将永远无法移动或兑现他们。',
      removeTips: '请确认您的钥匙已备份，且您打算这么做',
      yesremove: '是的，删除地址',
      address: '地址',
      import: {
        title: '导入BCH/WHC私钥',
        enter: '输入私钥',
        key: '私钥',
        enbale: '可以发送',
        keyholder: '输入您的私钥，格式：hex, b64, WIF, compressed WIF',
        valid: '必须是一个有效的Bitcoin Cash地址'
      },
      cannotremoveTips: '您不能删除最后一个地址'
    }
  },
  common: {
    change: '更改',
    cancel: '取消',
    save: '保存',
    email: '邮箱',
    validate: '验证',
    send: '发送',
    walletId: '钱包ID',
    submit: '提交',
    setup: '设置',
    assetsName: '资产名称',
    amount: '数量',
    copied: '已复制'
  },
  tips: {
    registerSuccess: '注册成功',
    loginSuccess: '登录成功',
    updateSuccess: '更新成功',
    addSuccess: '添加成功',
    commonError: '系统出错，请稍后尝试'
  },
  index: {
    whcWallet: {
      title: '资产管理',
      desc: '您可以创建固定资产，众筹资产以及可管理资产'
    },
    yourbank: {
      title: '安全的虫洞钱包',
      desc: '安全、受欢迎的虫洞钱包，您尽可安全地投资、储存虫洞资产'
    },
    esayWallet: {
      title: '轻便的加密钱包',
      desc: '您的资产完全保存在您的设备上，您尽在掌握'
    },
    securitySlide: {
      title: '安全',
      desc: '我们绝不会保存您的密码。且私钥只有在层层加密下才会发送到服务器'
    },
    sendReceiveSlide: {
      title: '发送 & 接收',
      desc: '无论您发送给朋友还是进行商业活动，我们将为您提供低费率以发送虫洞资产'
    },
    buySellSlide: {
      title: '燃烧 & 资产',
      desc: '您可通过燃烧BCH获得WHC资产。进而，您可以创建固定资产，众筹资产以及可管理资产'
    },
    welcomeDesc: '虫洞钱包欢迎您：）',
    whatiswhcwallet: {
      title: '什么是虫洞钱包 ？',
      desc: '虫洞钱包可便于您生成加密货币地址，您可把虫洞钱包当作一个包含多个账户的文件夹。每个钱包对应一个钱包ID。当您创建一个新钱包时我们会为您生成一个随机的钱包ID供您登录及认证。'
    },
    howshouldget: {
      title: '如何获得WHC？',
      desc: '您可以通过燃烧Bitcoin Cash获得WHC资产'
    }
  },
  faq: {
    title: 'FAQ',
    one: {
      que: '1.WHC是什么？',
      ans: 'Wormhole Cash(WHC)是Wormhole协议中的基础货币'
    },
    two: {
      que: '2.如何获取WHC？',
      ans: 'WHC通过燃烧生成(Proof-of-Burn)的机制生成出来的，持有BCH的用户可以给bitcoincash:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqu08dsyxz98whc 地址发送最低1个BCH来生成WHC且包含燃烧信息。如果发送的BCH数量低于1BCH或者没有包含燃烧信息，那么将不会有任何的WHC被生成。这个燃烧生成的过程受制于BCH区块链发生回滚的风险，出于安全考虑，协议约定需要在1,000个确认之后，才可以动用生成的WHC。燃烧生成的兑换比例是，每1BCH的燃烧生成100WHC'
    },
    three: {
      que: '3.WHC有什么作用？',
      ans: '在Wormhole协议中实现智能合约的时候Wormhole协议层是不能控制Bitcoin Cash的，这样就无法在Wormhole协议层中实现事务。而且在实现智能合约的时候需要引入Gas作为针对网络滥用的防护措施，也需要Wormhole协议存在一种原生基础货币,所以就有了Wormhole Cash(WHC)'
    },
    four: {
      que: '4.钱包ID有什么作用？',
      ans: '钱包ID是您独特的身份标识，您可使用它登录或访问您的钱包。请注意钱包ID并非区块链地址。请不要与他人共享您的钱包ID'
    },
    five: {
      que: '5.什么是ERC-20代币',
      ans: 'ERC 20是以太坊平台的数据通讯标准或者说规则。遵守这些标准或者规则而发的代币即统称为ERC-20代币'
    },
    six: {
      que: '6.什么是ERC-721代币',
      ans: 'ERC 721是以太坊平台的数据通讯标准或者说规则。遵守这些标准或者规则而发的代币即统称为ERC-721代币'
    },
    seven: {
      que: '7.ERC-20和ERC-721有什么区别',
      ans: 'ERC-721即“Non-Fungible Tokens”，翻译为不可互换的Token,英文简写为"NFT"，简单理解为每个Token都是独一无二的。也就是说ERC-721的每个Token都拥有独立唯一的TokenID编号。另外ERC-20是标准Token接口，ERC-20的Token可以无限细分为1018份，而ERC-721的Token最小的单位为1，无法再分割。'
    },
    eight: {
      que: '8.如何创建钱包',
      ans: '在钱包创建页面，用户可填入自己的可用邮箱，设置密码，完成人机身份验证，点击注册，我们会发送您的钱包ID到指定邮箱，然后通过钱包ID和之前设置的密码登陆钱包即可完成钱包创建'
    },
    nine: {
      que: '9.如何备份钱包',
      ans: '点击右上角的“钱包选项”按钮，在弹出的选项中点击“备份”，在弹出框中填入钱包ID和密码点击验证，验证通过后钱包的备份文件会自动备份到指定目录，即可完成钱包备份。'
    },
    ten: {
      que: '10.如何导入钱包',
      ans: '点击右上角的“钱包选项”按钮，在弹出的选项中点击“导入”，在弹出框中点击右边的“+”，从用户的钱包备份路径中选择钱包备份文件上传，点击确认即可完成钱包导入'
    },
    eleven: {
      que: '11.如何通过Wormhole钱包发行自己的ERC-20代币',
      ans: '点击“我的地址”再展开的二级菜单点击“资产”，在资产页面点击右上角“创建资产”，然后在弹出的下拉菜单中选择适合自己需求的一类资产，在创建资产页面填好要发行Token的各个参数即可发行属于自己的ERC-20代币。在这里值得注意的是：在创建资产时是需要消耗WHC的。'
    }
  }
}

export default enMessage
