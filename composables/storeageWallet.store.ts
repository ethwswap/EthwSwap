import { defineStore } from 'pinia'
import ETHABI from '~~/abi/ETH.json'
import ETHWSwapABI from '~~/abi/ETHWSwap.json'


export const useWalletStore = defineStore({
  id: 'Ethwswap',
  // Extended configuration
  persist: {
    // Enable cache
    enabled: true,
    strategies: [
      {
        key: 'Ethwswap', // The default key is the id of the above store, and the key can be customized
        // sessionStorage、localStorage、cookie
        storage: 'sessionStorage', // The default is sessionStorage session storage, which can be set to localStorage local long storage
        paths: ['isShowFAQModal']
      }
    ]
  },
  state: () => ({
    // Whether the wallet operation is loading
    isLoading: false,
    isLoadingTime: 0,
    ethBalance: 0,
    fromBalance: 0,
    fromAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    tokenAddress: '',
    tokenBalance: 0,
    tokenDecimals: 0,
    address: '',
    netId: 1,
    isAddressLoad: false,
    ellipsisAccount: '',
    balance: 0,
    isConnected: false,
    contractAddress: '0xD78195E2815932F2986214C462E6Bf209F326B3a',
    getGasLimit: '500000',
    gasPrice: '0',
    approveStateTime: 0,
    // 0.Not show 1.success 2.error
    approveState: 0,
    tipsMessage: '',
    currentBlockNumber: 0,
    isShowFAQModal: true,
  }),
  getters: {
    getAddress: (state) => state.address,
  },
  actions: {
    setIsShowFAQModal(state: boolean){
      this.isShowFAQModal = state
    },
    closeLoading() {
      this.isLoadingTime = window.setTimeout(() => {
        this.isLoading = false
        clearTimeout(this.isLoadingTime)
      }, 1000);
    },
    closeApproveState() {
      this.approveStateTime = window.setTimeout(() => {
        this.approveState = 0
        clearTimeout(this.approveStateTime)
      }, 3000);
    },
    limitInputNum(value: any, before: any, after: any, state = true) {
      value = value.toString().replace("。", ".");
      let newBefore = parseFloat(before);
      let newAfter = parseFloat(after);
      value = value.replace(/[^ \d.]|\s|^\./g, "");
      value = value.replace(/^0{2,}/g, "0");
      if (state) {
        value = value.replace(/\.{2,}/g, ".");
      } else {
        value = value.replace(/\./g, "");
      }
      value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      if (value.indexOf(".") >= 0) {
        value =
          value.split(".")[0].slice(0, newBefore) +
          "." +
          value.split(".")[1].slice(0, newAfter);
        return value;
      } else {
        value = value.slice(0, newBefore);
        return parseFloat(value) || value;
      }
    },
    // Set the token address
    setTokenAddress(address: any) {
      this.tokenAddress = address
    },
    //Create ETH instance
    getEthObj(address: string) {
      //设置
      let contract = new window.web3.eth.Contract(ETHWSwapABI, address);
      return contract;
    },
    //Create token instance
    getTokenObj(address: string) {
      let contract = new window.web3.eth.Contract(ETHABI, address);
      return contract;
    },
    // Get ETH balance
    async getEthBalance() {
      await window.web3.eth.getBalance(this.address).then((balance: any) => {
        this.ethBalance = window.web3.utils.fromWei(balance);
      });
    },
    // Get token balance
    async getTokenBalance(address: string, state = 'toBalance') {
      let token = this.getTokenObj(address);
      let tokenBalance = await token.methods.balanceOf(this.address).call();
      let tokenDecimals = await token.methods.decimals().call();
      if (state === 'toBalance') {
        this.tokenBalance = this.limitInputNum(tokenBalance / (10 ** tokenDecimals), 20, 4)
      } else if (state === 'fromBalance') {
        this.fromBalance = this.limitInputNum(tokenBalance / (10 ** tokenDecimals), 20, 4)
      }
    },
    // Get Token Accuracy
    async getTokenDecimals(address: string) {
      let token = this.getTokenObj(address);
      this.tokenDecimals = await token.methods.decimals().call();
    },
    //  Get Block Number
    async getBlockNumber(){
      await window.web3.eth.getBlockNumber().then((res: any) => {
        this.currentBlockNumber = res
      });
    },
    // Call the contract to trade
    async getTrade(formAddress: string, toAddress: string, amountIn: number, gasPrice: any, getGasLimit: any) {
      let token = this.getEthObj(this.contractAddress);
      let amountBigNum
      if (this.contractAddress == formAddress) {
        // ETH
        amountBigNum = 18
      } else {
        // Token
        await this.getTokenDecimals(formAddress)
        amountBigNum = this.tokenDecimals
      }
      let getTime = new Date().getTime() + (1000 * 60 * 5)
      getTime = Number((getTime / 1000).toFixed(0))

      amountIn = amountIn * (10 ** amountBigNum)
      let coinContract = new window.web3.eth.Contract(ETHABI, formAddress);

      this.isLoading = true
      // approve
      await coinContract.methods.approve(this.contractAddress, `${amountIn}`).send({
        from: this.address,
        gasPrice: gasPrice,
        gasLimit: getGasLimit,
      }, (error: any, transactionHash: any) => {
        if (!error) {
          this.approveState = 1
          this.tipsMessage = 'Authorization succeeded'
        } else {
          this.approveState = 2
          this.tipsMessage = 'Authorization failed'
        }
        this.closeApproveState()
      }).then(async (receipt: { status: any; }) => {
        // console.log('approve success')
      }).finally(() => {
        this.closeLoading()
      })

      this.isLoading = true
      token.methods.swapExactTokenIn(formAddress, toAddress, `${amountIn}`, getTime).send({
        from: this.address,
        gasPrice: gasPrice,
        gasLimit: getGasLimit,
      }, (error: any, transactionHash: any) => {
        if (!error) {
          this.approveState = 1
          this.tipsMessage = 'Authorized transaction succeeded'
        } else {
          this.approveState = 2
          this.tipsMessage = 'Authorization transaction failed'
        }
        this.closeApproveState()
      }).then(async (receipt: { status: any; }) => {
        await this.getEthBalance()
        let tokenAddress = this.contractAddress == formAddress ? toAddress : formAddress
        await this.getTokenBalance(tokenAddress)
      }).finally(() => {
        this.closeLoading()
      })
    },
    async getGasPrice() {
      if (process.client) {
        var web3 = new window.Web3(window.ethereum);
        this.gasPrice = await web3.eth.getGasPrice()
        this.netId = await web3.eth.net.getId()
      }
    },
    // state: 1.ETH network 10001.ETHW network
    async changeNetwork(state: number) {
      if (process.client) {
        if (window.ethereum) {
          var web3 = new window.Web3(window.ethereum);
          let toHexNetId = await web3.utils.toHex(state)
          if (state == 1) {
            window.ethereum
              .request({
                method: 'wallet_switchEthereumChain',
                params: [
                  {
                    chainId: toHexNetId
                  },
                ],
              })
              .then(async () => {
                await this.getGasPrice()
                await this.getEthBalance()
                await this.getBalanceAndBalance()
              })
              .catch((e) => {

              })
          } else if (state == 4) {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: toHexNetId }],
              });
              await this.getGasPrice()
              await this.getEthBalance()
              await this.getBalanceAndBalance()
            } catch (error) {
              if (error.code === 4902) {
                try {
                  window.ethereum
                    .request({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                          chainId: toHexNetId,
                          chainName: 'RinkebyETH',
                          nativeCurrency: {
                            name: 'RinkebyETH',
                            symbol: 'ETH',
                            decimals: 18,
                          },
                          rpcUrls: ['https://rinkeby.infura.io/v3/'],
                          blockExplorerUrls: ['https://rinkeby.etherscan.io'],
                        },
                      ],
                    })
                    .then(async () => {
                      await this.getGasPrice()
                      await this.getEthBalance()
                      await this.getBalanceAndBalance()
                    })
                    .catch((e) => {

                    })
                } catch (error) {

                }
              }
            }
          } else if (state == 10001) {
            window.ethereum
              .request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: toHexNetId,
                    chainName: 'ETHW',
                    nativeCurrency: {
                      name: 'ETHW',
                      symbol: 'ETHW',
                      decimals: 18,
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/'],
                  },
                ],
              })
              .then(async () => {
                await this.getGasPrice()
                await this.getEthBalance()
                await this.getBalanceAndBalance()
              })
              .catch((e) => {

              })
          }
        }
      }
    },
    async getBalanceAndBalance() {
      if (this.tokenAddress) {
        await this.getTokenBalance(this.tokenAddress)
        await this.getTokenDecimals(this.tokenAddress)
      } else {
        await this.getTokenBalance(this.fromAddress, 'fromBalance')
      }
    },
    async Approve(contract: any, addr: any, value: any, callback: any) {
      contract.methods
        .approve(addr, value)
        .call()
        .then((res: any) => {
          this.approveState = 1
          this.tipsMessage = 'Authorized transaction succeeded'
          callback(res);
        })
        .catch((err) => {
          this.approveState = 2
          this.tipsMessage = 'Authorization transaction failed'
        });
    },
    async initWeb3(){
      window.web3 = new window.Web3(window.ethereum)
    },
    async useWeb3() {
      if (process.client) {
        if (window.ethereum) {
          this.isLoading = true
          // Using Metamsak or Token Pocket
          await window.ethereum.send('eth_requestAccounts')
          await this.initWeb3()
          const accounts = await window.web3.eth.getAccounts()
          this.isAddressLoad = true
          this.setAddredd(accounts[0])
          this.ellipsisAccount = this.trimmedAccount()
          const balance = await window.web3.eth.getBalance(accounts[0])
          this.isAddressLoad = false
          this.balance = balance
          this.isConnected = true

          await this.getBlockNumber()

          window.ethereum.on('accountsChanged', (accounts: any[]) => {
            // User account disconnected
            this.setAddredd(accounts[0])
            if (typeof accounts[0] === 'undefined') {
              this.isConnected = false
            }
            this.isConnected = true
            window.web3.eth.getBalance(accounts[0]).then((balance: number) => {
              this.balance = balance
            })
          })

          await this.getTokenBalance(this.fromAddress, 'fromBalance')
          this.closeLoading()

        } else {
          this.isConnected = false
        }
      }
    },
    setAddredd(address: string) {
      this.address = address
      this.ellipsisAccount = this.trimmedAccount()
    },
    trimmedAccount() {
      let account = this.address
      if (account) {
        return account.substring(0, 6) + '...' + account.substring(account.length - 2, account.length)
      }
      return account
    },
  }
})
