<template lang="pug">
    div.importpage-container
        q-dialog(v-model="isOpen" stack-buttons prevent-close @cancel="onCancel"  @hide="onHide")
            span(slot="title") {{$t('homePage.overview.importSection.title')}}
            //- div(slot="message")
            //-     span(slot="message") {{$t('common.walletId')}} : {{walletId}}
            div(slot='body')
                q-field(:error="errorUploadShown" :error-label="label.required" orientation='vertical')
                    q-uploader(:float-label="label.uploadDesc"  color="primary"  @add="add" @remove:cancel="remove" url='' inverted hide-upload-button hide-upload-progress class='upload-container')
            template(slot="buttons" slot-scope="props")
                    q-btn(flat :label="label.import" @click.native="importClick" color='black' :disable='!btnEnable')
                    q-btn(flat :label="label.cancel" @click="props.cancel")
</template>
<script>
import popup from '../../../../src/util/notify'
import bch from 'bitcoincashjs'
import { Promise } from 'bluebird'
import { QSpinnerFacebook } from 'quasar'
import { mapState, mapActions } from 'vuex'
let { warning } = popup
export default {
  data () {
    return {
      label: {
        cancel: this.$t('common.cancel'),
        required: this.$t('account.required'),
        import: this.$t('homePage.overview.importSection.importWallet'),
        uploadDesc: this.$t('homePage.overview.importSection.uploadDesc')
      },
      fileData: '',
      fileAdded: null,
      filename: '',
      validatedStatusArr: [],
      importStatusArr: [],
      loadingOptions: { spinner: QSpinnerFacebook, spinnerColor: 'light-blue', message: this.$t('homePage.overview.importSection.loadingText'), messageColor: 'white' }
    }
  },
  computed: {
    ...mapState({
      config_nethasfetched: state => state.configModule.nethasfetched
    }),
    errorUploadShown () {
      if (this.fileAdded) {
        return false
      } else {
        return true
      }
    },
    btnEnable () {
      if (this.fileAdded) {
        return true
      } else {
        return false
      }
    }
  },
  props: [ 'isOpen' ],
  methods: {
    ...mapActions(['accountModule/account_addAddress']),
    onHide () {
      this.$emit('importHideEmit')
      this.importStatusArr = []
    },
    onCancel () {
      this.$emit('importHideEmit')
      this.isOpen = false
    },
    importClick () {
      let self = this
      self.readFile(self.fileAdded).then(data => {
        self.validate(data)
      })
    },
    add (files) {
      this.fileAdded = files[0]
    },
    remove (file) {
      this.fileAdded = null
    },
    readFile (file) {
      let reader = new FileReader()
      reader.readAsText(file)
      return new Promise((resolve, reject) => {
        reader.onload = function (e) {
          resolve(reader.result)
        }
      })
    },
    validate (backup) {
      var self = this
      if (!self.config_nethasfetched) {
        warning(self.$t('tips.commonError'), self)
        return
      }
      self.$q.loading.show(self.loadingOptions)
      try {
        var wallet = JSON.parse(backup)
        let completed = 0
        let total = wallet.addresses.length
        let next = function () {
          return importAddress(wallet.addresses[completed])
        }
        let validated = {
          addresses: []
        }
        var importAddress = function (address) {
          if (completed === total) {
            let params = {
              statusObjImport: self.importStatusArr,
              validated: validated
            }
            self.$emit('importHideEmit')
            self.$emit('importHandleObjEmit', params)
            return
          }
          let item = {}
          try {
            var addr = address.address
            if (address.privkey) {
              addr = new bch.PrivateKey(address.privkey).toAddress().toString()
            }
            if (bch.Address.isValid(addr.toString(), bch.Networks.defaultNetwork.name)) {
              validated.addresses.push(address)
              // item.message = self.$t('homePage.overview.validate.validated')
              // item.status = 'success'
              // item.address = address.address
              // item.icon = 'done'
              // item.color = 'primary'
              if (address.privkey) {
                let params = {
                  address: address.address,
                  privKey: address.privkey
                }
                self['accountModule/account_addAddress'](params).then(resData => {
                  if (resData && resData.code === 0) {
                    item.message = self.$t('homePage.overview.importSection.imported')
                    item.status = 'success'
                    item.address = address.address
                    item.icon = 'done'
                    item.color = 'primary'
                  } else {
                    item.message = self.$t('homePage.overview.validate.errorDuring')
                    item.status = 'fail'
                    item.address = address.address
                    item.icon = 'close'
                    item.color = 'amber'
                  }
                  self.importStatusArr.push(item)
                  completed++
                  return next()
                }).catch(() => {
                  item.message = self.$t('homePage.overview.validate.errorDuring')
                  item.status = 'fail'
                  item.address = address.address
                  item.icon = 'close'
                  item.color = 'amber'
                  self.importStatusArr.push(item)
                  completed++
                  return next()
                })
              } else if (address.pubkey) {
                let params = {
                  address: address.address,
                  privKey: undefined,
                  pubKey: address.pubkey
                }
                self['accountModule/account_addAddress'](params).then(resData => {
                  if (resData && resData.code === 0) {
                    item.message = self.$t('homePage.overview.importSection.imported')
                    item.status = 'success'
                    item.address = address.address
                    item.icon = 'done'
                    item.color = 'primary'
                  } else {
                    item.message = self.$t('homePage.overview.validate.errorDuring')
                    item.status = 'fail'
                    item.address = address.address
                    item.icon = 'close'
                    item.color = 'amber'
                  }
                  self.importStatusArr.push(item)
                  completed++
                  return next()
                }).catch(() => {
                  item.message = self.$t('homePage.overview.validate.errorDuring')
                  item.status = 'fail'
                  item.address = address.address
                  item.icon = 'close'
                  item.color = 'amber'
                  self.importStatusArr.push(item)
                  completed++
                  return next()
                })
              } else {
                let params = {
                  address: address.address
                }
                self['accountModule/account_addAddress'](params).then(resData => {
                  if (resData && resData.code === 0) {
                    item.message = self.$t('homePage.overview.importSection.imported')
                    item.status = 'success'
                    item.address = address.address
                    item.icon = 'done'
                    item.color = 'primary'
                  } else {
                    item.message = self.$t('homePage.overview.validate.errorDuring')
                    item.status = 'fail'
                    item.address = address.address
                    item.icon = 'close'
                    item.color = 'amber'
                  }
                  self.importStatusArr.push(item)
                  completed++
                  return next()
                }).catch(() => {
                  item.message = self.$t('homePage.overview.validate.errorDuring')
                  item.status = 'fail'
                  item.address = address.address
                  item.icon = 'close'
                  item.color = 'amber'
                  self.importStatusArr.push(item)
                  completed++
                  return next()
                })
              }
            } else {
              item.message = self.$t('homePage.overview.validate.invalid')
              item.status = 'fail'
              item.address = address.address
              item.icon = 'close'
              item.color = 'amber'
              self.importStatusArr.push(item)
              completed++
              return next()
            }
          } catch (e) {
            item.message = self.$t('homePage.overview.validate.errorValid') + ' ' + e
            item.status = 'fail'
            item.address = address.address
            item.icon = 'close'
            item.color = 'amber'
            self.importStatusArr.push(item)
            completed++
            return next()
          }
        }
        next()
      } catch (e) {
        self.$q.loading.hide()
        warning(self.$t('homePage.overview.validate.errorDuring') + e, self)
      }
    }
    // validate (backup) {
    //   var self = this
    //   self.$q.loading.show(loadingOptions)
    //   try {
    //     var wallet = JSON.parse(backup)
    //     let addresses = wallet.addresses
    //     let proArr = []
    //     for (let i = 0; i < addresses.length; i++) {
    //       proArr.push(self.importItem(addresses[i]))
    //     }
    //     Promise.all(proArr).then(resArr => {
    //       self.$q.loading.hide()
    //     }).catch(error => {
    //       self.$q.loading.hide()
    //     })

    //     async function runPromisesInSequence (promises) {
    //       for (let promise of promises) {
    //       }
    //     }
    //     var sequence=Promise.resolve()
    //     proArr.forEach(item=>{
    //       sequence=sequence.then(item)
    //     })
    //     eslint-disable-next-line
    //     async function readFiles (addresses) {
    //       for (const address of addresses) {
    //         await self.importItem(address)
    //       }
    //     };
    //     readFiles(addresses)
    //   } catch (e) {
    //     self.$q.loading.hide()
    //     warning(self.$t('homePage.overview.validate.errorDuring') + e, self)
    //   }
    // },
    // importItem (address) {
    //   var self = this
    //   return new Promise((resolve, reject) => {
    //     let item = {}
    //     try {
    //       var addr = address.address
    //       if (address.privkey) {
    //         addr = new bch.PrivateKey(address.privkey).toAddress().toString()
    //       }
    //       if (bch.Address.isValid(addr.toString())) {
    //         if (address.privkey) {
    //           let params = {
    //             address: address.address,
    //             privKey: address.privkey
    //           }
    //           self['accountModule/account_addAddress'](params).then(resData => {
    //             if (resData && resData.code === 0) {
    //               item.message = self.$t('homePage.overview.importSection.imported')
    //               item.status = 'success'
    //               item.address = address.address
    //               item.icon = 'done'
    //               item.color = 'primary'
    //               resolve(item)
    //             } else {
    //               reject(resData.message)
    //             }
    //           }).catch(error => {
    //             reject(error)
    //           })
    //         } else if (address.pubkey) {
    //           let params = {
    //             address: address.address,
    //             privKey: undefined,
    //             pubKey: address.pubkey
    //           }
    //           self['accountModule/account_addAddress'](params).then(resData => {
    //             if (resData && resData.code === 0) {
    //               item.message = self.$t('homePage.overview.importSection.imported')
    //               item.status = 'success'
    //               item.address = address.address
    //               item.icon = 'done'
    //               item.color = 'primary'
    //               resolve(item)
    //             } else {
    //               reject(resData.message)
    //             }
    //           }).catch(error => {
    //             reject(error)
    //           })
    //         } else {
    //           let params = {
    //             address: address.address
    //           }
    //           self['accountModule/account_addAddress'](params).then(resData => {
    //             if (resData.code === 0) {
    //               item.message = self.$t('homePage.overview.importSection.imported')
    //               item.status = 'success'
    //               item.address = address.address
    //               item.icon = 'done'
    //               item.color = 'primary'
    //               resolve(item)
    //             } else {
    //               reject(resData.message)
    //             }
    //           }).catch(error => {
    //             reject(error)
    //           })
    //         }
    //       } else {
    //         item.message = self.$t('homePage.overview.validate.invalid')
    //         item.status = 'fail'
    //         item.address = address.address
    //         item.icon = 'close'
    //         item.color = 'amber'
    //         resolve(item)
    //       }
    //     } catch (e) {
    //       item.message = self.$t('homePage.overview.validate.errorValid') + ' ' + e
    //       item.status = 'fail'
    //       item.address = address.address
    //       item.icon = 'close'
    //       item.color = 'amber'
    //       resolve(item)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">
.importpage-container{

}
.upload-container{
    .q-uploader-pick-button{
      margin-right: 5%;
    }
  }
</style>
