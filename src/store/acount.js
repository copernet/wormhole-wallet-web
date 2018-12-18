/**
 * store all status about account
 */
import commonUtil from '../../src/util/common'
import request from '../../src/util/request'
import cryptoUtil from '../../src/util/cryptoUtil'
import router from './../router'
export const accountModule = {
  namespaced: true,
  state: {
    account_settings: {},
    account_validating: false,
    account_uuid: '',
    account_nonce: '',
    account_walletkey: '',
    account_walletKeyTemp: '',
    account_asymkey: {},
    account_wallet: {},
    account_loggedin: false,
    account_encodedpub: '',
    account_logininprogress: false,
    account_mfa: '',
    account_asq: '',
    account_addresses: {},
    account_assets: {}
  },
  getters: {

  },
  mutations: {
    set_account_settings (state, settings) {
      state.account_settings = settings
    },
    set_account_validating (state, validating) {
      state.account_validating = validating
    },
    set_account_uuid (state, uuid) {
      state.account_uuid = uuid
    },
    set_account_nonce (state, nonce) {
      state.account_nonce = nonce
    },
    set_account_walletkey (state, walletkey) {
      state.account_walletkey = walletkey
    },
    set_account_walletkeytemp (state, walletkeyTemp) {
      state.account_walletKeyTemp = walletkeyTemp
    },
    set_account_asymkey (state, asymkey) {
      state.account_asymkey = asymkey
    },
    set_account_wallet (state, wallet) {
      state.account_wallet = wallet
    },
    set_account_wallet_email (state, email) {
      state.account_wallet.email = email
    },
    set_account_loggedin (state, loggedin) {
      state.account_loggedin = loggedin
    },
    set_account_encodedpub (state, encodedpub) {
      state.account_encodedpub = encodedpub
    },
    set_account_logininprogress (state, logininprogress) {
      state.account_logininprogress = logininprogress
    },
    set_account_mfa (state, mfa) {
      state.account_mfa = mfa
    },
    set_account_asq (state, asq) {
      state.account_asq = asq
    },
    set_account_addresses (state, addresses) {
      state.account_addresses = addresses
    },
    set_account_assets (state, assets) {
      state.account_assets = assets
    }
  },
  actions: {
    /**
     * func: create account
     * @param {*} context
     * @param {*} form
     */
    account_create (context, form) {
      return new Promise((resolve, reject) => {
        var uuid = ''
        if (!context.account_validating) {
          uuid = commonUtil.generateUUID()
          context.commit('set_account_uuid', uuid)
          var wallet = {
            uuid: uuid,
            addresses: [],
            email: form.valueEmail
          }
          var createData = {}
          request.wallet_challenge(uuid).then(resData => {
            if (resData.code === 0) {
              let data = resData.result
              let nonce = cryptoUtil.generateNonceForDifficulty(data.pow_challenge)
              context.commit('set_account_nonce', nonce)
              let walletKey = cryptoUtil.generateSymmetricKey(form.valuePassword, data.salt)
              context.commit('set_account_walletkey', walletKey)
              let encryptedWallet = cryptoUtil.encryptObject(wallet, walletKey)
              let asymKey = cryptoUtil.generateAsymmetricPair()
              context.commit('set_account_asymkey', asymKey)
              createData = {
                email: form.valueEmail,
                nonce: nonce,
                public_key: asymKey.pubPem,
                uuid: uuid,
                wallet: encryptedWallet,
                recaptcha_response_field: form.recaptcha_response_field
              }
              return request.wallet_create(createData)
            } else {
              resolve(resData)
            }
          }).then(result => {
            if (result.code === 0) {
              context.commit('set_account_validating', false)
              context.commit('set_account_settings', {
                firstLogin: true
              })
              context.commit('set_account_wallet', wallet)
              context.commit('set_account_loggedin', true)
              context.dispatch('wallet_init', wallet, { root: true })
              resolve(result)
            } else {
              resolve(result)
            }
          }).catch(error => {
            context.commit('set_account_validating', false)
            reject(error)
          })
        }
      })
    },
    /**
     *
     * @param {*} context
     * @param {*} params uuid passphrase mfatoken
     */
    account_verify (context, params) {
      return new Promise((resolve, reject) => {
        var loginData = {}
        request.wallet_challenge(params.uuid).then(resData => {
          if (resData.code === 0) {
            let data = resData.result
            let nonce = cryptoUtil.generateNonceForDifficulty(data.pow_challenge)
            context.commit('set_account_nonce', nonce)
            let walletKeyTemp = cryptoUtil.generateSymmetricKey(params.passphrase, data.salt)
            context.commit('set_account_walletkeytemp', walletKeyTemp)
            let asymKey = cryptoUtil.generateAsymmetricPair()
            context.commit('set_account_asymkey', asymKey)
            let encodedPub = asymKey.pubPem
            context.commit('set_account_encodedpub', encodedPub)
            loginData = {
              nonce: nonce,
              public_key: encodedPub,
              uuid: params.uuid
            }
            let mfatoken = params.mfatoken
            if (mfatoken) {
              loginData.mfatoken = params.mfatoken
            }
            request.wallet_login(loginData).then(loginResData => {
              resolve(loginResData)
            }).catch(error => {
              reject(error)
            })
          } else {
            resolve(resData)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    account_login (context, params) {
      return new Promise((resolve, reject) => {
        if (!context.account_logininprogress) {
          context.commit('set_account_logininprogress', true)
          context.commit('set_account_uuid', params.uuid)
          context.dispatch('account_verify', params).then(resData => {
            if (resData && resData.code === 0) {
              var data = resData.result
              context.commit('set_account_logininprogress', false)
              try {
                var wallet = cryptoUtil.decryptObject(data.wallet, context.state.account_walletKeyTemp)
                context.commit('set_account_wallet', wallet)
                context.commit('set_account_walletkey', context.state.account_walletKeyTemp)
                context.commit('set_account_mfa', data.mfa)
                context.commit('set_account_asq', data.asq)
                context.commit('set_account_settings', {
                  firstLogin: false
                })
                context.commit('set_account_loggedin', true)
                context.dispatch('wallet_init', wallet, { root: true })
                resolve(resData)
              } catch (e) {
                reject({ badPassword: true })
              }
            } else {
              resolve(resData)
            }
          }).catch(error => {
            context.commit('set_account_logininprogress', false)
            reject(error)
          })
        } else {
          reject('Login in progress')
        }
      })
    },
    account_saveSession (context) {
      return new Promise((resolve, reject) => {
        if (context.state.account_loggedin) {
          request.wallet_challenge(context.state.account_uuid).then(resData => {
            if (resData.code === 0) {
              var data = resData.result
              var encryptedWallet = cryptoUtil.encryptObject(context.state.account_wallet, context.state.account_walletkey)
              var challenge = data.challenge
              var signature = cryptoUtil.createSignedObject(challenge, context.state.account_asymkey.privKey)
              return request.wallet_update({
                uuid: context.state.account_uuid,
                wallet: encryptedWallet,
                signature: signature,
                email: context.state.account_wallet.email
              })
            } else {
              resolve(resData)
            }
          }).then(resData => {
            if (resData && resData.code === 0) {
              resolve(resData)
            } else {
              // context.dispatch('account_logout')
              resolve(resData)
            }
          }).catch(error => {
            // context.dispatch('account_logout')
            reject(error)
          })
        } else {
          reject('have not logged in')
        }
      })
    },
    account_updateMFA (context, params) {
      return new Promise((resolve, reject) => {
        if (context.state.account_loggedin) {
          request.wallet_challenge(context.state.account_uuid).then(resData => {
            if (resData.code === 0) {
              var data = resData.result
              var challenge = data.challenge
              var signature = cryptoUtil.createSignedObject(challenge, context.state.account_asymkey.privKey)
              return request.wallet_update({
                uuid: context.state.account_uuid,
                mfa_secret: params.secret,
                mfa_token: params.token,
                mfa_action: params.action,
                signature: signature,
                question: params.asq,
                answer: params.asa
              })
            } else {
              resolve(resData)
            }
          })
            .then(resData => {
              if (resData && resData.code === 0) {
                context.commit('set_account_asq', params.asq)
                resolve(resData)
              } else {
                resolve(resData)
              }
            })
            .catch(error => {
              reject(error)
              context.dispatch('account_logout')
            })
        } else {
          reject('have not loggend')
        }
      })
    },
    /**
     *
     * @param {*} address
     * @param {*} privKey
     * @param {*} pubKey
     */
    account_addAddress (context, params) {
      let wallet = context.state.account_wallet
      for (let i in wallet.addresses) {
        if (wallet.addresses[i].address === params.address) {
          if (params.privKey) {
            wallet.addresses[i].privKey = params.privKey
            wallet.addresses[i].pubkey = undefined
          }
          if (params.pubKey) {
            if (wallet.addresses[i].privKey) {
              throw new Error('Address: ' + params.address + 'has already a private key.')
            }
            wallet.addresses[i].pubkey = params.pubKey
          }
          context.commit('set_account_wallet', wallet)
          return new Promise((resolve, reject) => {
            context.dispatch('account_saveSession').then(resData => {
              if (resData.code === 0) {
                context.dispatch('wallet_addAddress', [params.address], { root: true })
                resolve(resData)
              } else {
                resolve(resData)
              }
            }).catch(error => {
              reject(error)
            })
          })
        }
      }
      var rawaddress = {
        'address': params.address,
        'privkey': params.privKey,
        'pubkey': params.pubKey
      }
      wallet.addresses.push(rawaddress)
      context.commit('set_account_wallet', wallet)
      return new Promise((resolve, reject) => {
        context.dispatch('account_saveSession').then(resData => {
          if (resData.code === 0) {
            context.dispatch('wallet_addAddress', [params.address], { root: true })
            resolve(resData)
          } else {
            resolve(resData)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    account_removeAddress (context, addressHash) {
      let wallet = context.state.account_wallet
      if (wallet.addresses.length === 1) {
        return false
      }
      for (var i = 0; i < wallet.addresses.length; i++) {
        if (wallet.addresses[i].address === addressHash) {
          var remove = wallet.addresses.splice(i, 1)[0]
          context.commit('set_account_wallet', wallet)
          return new Promise((resolve, reject) => {
            context.dispatch('account_saveSession').then(resData => {
              if (resData.code === 0) {
                context.dispatch('wallet_removeAddress', remove.address, { root: true })
                resolve(resData)
              } else {
                resolve(resData)
              }
            }).catch(error => {
              reject(error)
            })
          })
        }
      }
    },
    account_logout (context) {
      context.commit('set_account_uuid', '')
      context.commit('set_account_walletkey', '')
      context.commit('set_account_walletkeytemp', '')
      context.commit('set_account_asymkey', {})
      context.commit('set_account_wallet', {})
      context.commit('set_account_mfa', '')
      context.commit('set_account_addresses', {})
      context.commit('set_account_assets', {})
      context.commit('set_account_loggedin', false)
      context.dispatch('wallet_destroy', null, { root: true })
      router.replace('/login')
    }
  }
}
