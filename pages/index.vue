<template>
  <div sm="px-16" class="relative h-full">
    <w-header class="flex items-center justify-between text-fs18">
      <NuxtLink to="/" class="cursor-pointer flex items-center space-x-1 text-fs24 text-white">
        <img class="w-12 h-12" src="/logo.png" alt="">
        <span class="text-primary-500">EthwSwap</span>
      </NuxtLink>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <div @click="selectNetwork = true" hover="bg-primary-400" active="bg-primary-600"
            class="bg-primary-500 flex items-center space-x-1 text-white px-2 h-10 leading-10  rounded-full cursor-pointer text-white">
            <img v-if="walletStore.netId === 10001" class="w-6 rounded-full" src="/ETH.png" alt="" />
            <span v-if="walletStore.netId === 10001" class="sm:block hidden">Ethereum</span>
            <i i-carbon-chevron-down class="inline-block text-fs24 sm:block hidden"></i>
          </div>
          <Transition enter-from-class="opacity-0 scale-95 duration-150 ease-out"
            enter-to-class="opacity-100 scale-100 duration-150 ease-out"
            leave-from-class="opacity-100 scale-100 duration-150 ease-in"
            leave-to-class="opacity-0 scale-95 duration-150 ease-in">
            <div v-show="selectNetwork" ref="selectNetworkRef"
              class="absolute z-10 -ml-4 mt-2 w-screen max-w-260px transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 z-9999">
              <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div class="relative grid gap-6 bg-white p-4">
                  <div class="text-black">{{ $t('home.选择网络') }}</div>
                  <div :class="walletStore.netId === 10001 ? 'bg-primary-400' : ''" @click="walletStore.changeNetwork(10001), selectNetwork = false"
                    class="-m-3 rounded-lg p-3 cursor-pointer">
                    <div class="flex items-start">
                      <img class="w-6 rounded-full" src="/ETH.png" alt="" />
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">ETHW(Await)</p>
                      </div>
                    </div>
                    <a href="https://etherscan.io/" target="_blank" rel="noopener noreferrer">
                      <div class="text-sm text-gray-500 mt-2 flex items-center justify-between">
                        <span>EthereumPoW</span>
                        <i i-carbon-link class="inline-block"></i>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <w-button class="!px-2" @click="clickConnect" v-if="!walletStore.isConnected">
          <span class="sm:block hidden">{{ !walletStore.isAddressLoad ? $t('header.连接钱包') : $t('header.连接中~~~')
          }}</span>
          <i class="text-fs20 transition sm:hidden block text-white" i-carbon-wallet></i>
        </w-button>
        <div v-if="walletStore.isConnected" class="bg-[#255461] text-white rounded-full px-2 h-10 leading-10">
          {{ walletStore.ellipsisAccount }}
        </div>
        <span hover="text-primary-500" class="transition delay-50 text-white" v-for="locale in availableLocales"
          :key="locale.code">
          <NuxtLink :to="switchLocalePath(locale.code) || ''">
            <i i-carbon-language class="inline-block text-fs24"></i>
          </NuxtLink>
        </span>
        <!-- <DarkToggle /> -->
      </div>
    </w-header>
    <div class="sm:pt-20 pt-12 flex flex-col justify-between h-full-5rem">
      <div sm="px-0 max-w-1200px mx-auto" class="px-4 w-full">
        <div class="text-center text-fs32">{{ $t('home.介绍') }}</div>
        <div class="bg-[#255461] p-4 rounded-2xl shadow-2xl relative mt-10 max-w-460px mx-auto">
          <div v-show="walletStore.isLoading"
            class="absolute w-full h-full left-0 top-0 bg-black text-white z-999 opacity-85 rounded-2xl">
            <div class="flex items-center justify-center space-x-2 h-full">
              <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span class="text-fs28 text-primary-500">{{ $t('header.加载中~~~') }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between pb-2">
            <div class="text-fs22 text-white">{{ $t('home.设置') }}</div>
            <div class="relative">
              <i @click="showSettings = true" i-carbon-settings hover="text-primary-500"
                class="text-white inline-block cursor-pointer"></i>
              <Transition enter-from-class="opacity-0 scale-95 duration-150 ease-out"
                enter-to-class="opacity-100 scale-100 duration-150 ease-out"
                leave-from-class="opacity-100 scale-100 duration-150 ease-in"
                leave-to-class="opacity-0 scale-95 duration-150 ease-in">
                <div v-show="showSettings" ref="showSettingsRef"
                  class="absolute right-0 z-10 mt-2 w-260px origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="overflow-hidden">
                    <div class="relative grid gap-4 p-4">
                      <div class="text-black text-fs18">{{ $t('home.交易设置') }}</div>
                      <div class="">
                        <p class="text-base font-medium text-gray-900">Gas Price</p>
                        <w-input class="bg-[#255461] border-0 !text-white text-fs18" v-model="gasPrice"
                          :placeholder="walletStore.gasPrice"></w-input>
                      </div>

                      <div class="">
                        <p class="text-base font-medium text-gray-900">Gas Limit</p>
                        <w-input class="bg-[#255461] border-0 !text-white text-fs18" v-model="getGasLimit"
                          :placeholder="walletStore.getGasLimit"></w-input>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <div :class="isReverse ? 'flex-col-reverse' : ''" class="flex flex-col mt-4">
            <div :hover="!isReverse ? 'border-primary-500' : ''"
              class="bg-[#012a35] rounded-xl p-4 border border-[#012a35]">
              <div class="flex items-center justify-between space-x-2">
                <input :disabled="isReverse" @input="getEthAndTokenPrice(1)"
                  class="bg-transparent border-0 !text-white !px-0 w-0 flex-1 text-fs24 box-border text-black border outline-none"
                  v-model="fromValue" placeholder="0.00" />
                <div class="px-4 py-2 rounded-full flex items-center space-x-2 border-primary-500 bg-primary-800">
                  <img class="w-6 rounded-full" src="/ETH.png" alt="" />
                  <span class="text-white">WETH</span>
                </div>
              </div>
              <div v-if="walletStore.isConnected" class="flex items-center justify-end space-x-2 mt-2 text-[#8f96ac]">
                <span>{{$t('home.余额')}}: {{ walletStore.limitInputNum(walletStore.fromBalance, 20, 4) }}</span>
              </div>
            </div>
            <div class="text-center py-2">
              <div @click="changeIsReverse" hover="bg-primary-400" active="bg-primary-600"
                class="bg-primary-500 w-8 h-8 mx-auto flex items-center justify-center rounded-full cursor-pointer">
                <i i-carbon-arrow-down class="text-white inline-block"></i>
              </div>
            </div>
            <div :hover="isReverse ? 'border-primary-500' : ''"
              class="bg-[#012a35] rounded-xl p-4 border border-[#012a35]">
              <div class="flex items-center justify-between space-x-2">
                <input :disabled="!isReverse" @input="getEthAndTokenPrice(2)"
                  class="bg-transparent border-0 !text-white !px-0 w-0 flex-1 text-fs24 box-border text-black border outline-none"
                  v-model="toValue" placeholder="0.00" />
                <div @click="changeMetamask(2)" hover="bg-primary-700" active="bg-primary-900"
                  class="bg-primary-800 rounded-full text-white cursor-pointer px-4 py-2 flex items-center space-x-2">
                  <img v-if="toItem.name" class="w-6 rounded-full" :src="toItem.icon" alt="" />
                  <div class="">{{ toItem.name || $t('home.选择代币') }}</div>
                  <i i-carbon-chevron-down class="text-white inline-block"></i>
                </div>
              </div>
              <div v-if="walletStore.isConnected && toItem.name"
                class="flex items-center justify-end space-x-2 mt-2 text-[#8f96ac]">
                <span>{{$t('home.余额')}}: {{ walletStore.limitInputNum(walletStore.tokenBalance, 20, 4) }}</span>
              </div>
            </div>
          </div>
          <div @click="!walletStore.isConnected ? clickConnect() : (formItem.name && toItem.name ? clickTrade() : '')"
            :class="!walletStore.isConnected || (formItem.name && toItem.name) ? 'cursor-pointer bg-primary-500' : 'bg-[#012a35] opacity-50'"
            class="rounded-xl p-4 text-fs22 text-white text-center mt-6 flex items-center justify-center space-x-2">
            <svg v-if="quoteDataPadding" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ !walletStore.isConnected ? (!walletStore.isAddressLoad ? $t('header.连接钱包') : $t('header.连接中~~~')) :
            (!formItem.name || !toItem.name ? $t('home.选择代币') : $t('home.交易')) }}</span>
          </div>
        </div>
        <div xl="grid" class="grid-cols-3 gap-6 mt-16 hidden text-fs14 leading-6 text-primary-500">
          <div class="bg-[#012a35] border border-primary-500 rounded-lg p-4">
            <span class="text-fs16 text-white">{{ $t('home.witty1') }}</span><br />
            {{$t('home.witty2')}}<br />
            {{$t('home.witty3')}}<br />
            {{$t('home.witty4')}}<br />
            {{$t('home.witty5')}}
          </div>
          <div class="bg-[#012a35] border border-primary-500 rounded-lg p-4">
            <span class="text-fs16 text-white">{{$t('home.witty6')}}</span><br />
            {{$t('home.witty7')}}<br />
            {{$t('home.witty8')}}<br />
            {{$t('home.witty9')}}
          </div>
          <div class="bg-[#012a35] border border-primary-500 rounded-lg p-4">
            <span class="text-fs16 text-white">{{$t('home.witty10')}}</span><br />
            {{$t('home.witty11')}}<br />
            {{$t('home.witty12')}}<br />
            {{$t('home.witty13')}}
          </div>
        </div>
      </div>
      <div class="p-4 text-fs12 mt-16">
        <div class="flex items-center space-x-4">
          <span class="hover:text-primary-500 text-white cursor-pointer text-fs16" @click="FAQModal = true">FAQ</span>
        </div>
        <div class="flex items-center justify-between space-x-2 mt-2">
          <div class="text-white opacity-60">Media inquires for Ethwswap Labs - Contact ethwswap@protonmail.com</div>
          <div class="flex items-center space-x-3">
            <NuxtLink hover="text-primary-500 opacity-100" class="text-fs24 transition delay-50 text-white opacity-60"
              to="https://twitter.com/EthwSwap" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578a9.3 9.3 0 0 1-2.958 1.13a4.66 4.66 0 0 0-7.938 4.25a13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568a4.692 4.692 0 0 1-2.104.08a4.661 4.661 0 0 0 4.352 3.234a9.348 9.348 0 0 1-5.786 1.995a9.5 9.5 0 0 1-1.112-.065a13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254c0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41l.002-.003Z" />
              </svg>
            </NuxtLink>
            <NuxtLink hover="text-primary-500 opacity-100" class="text-fs24 transition delay-50 text-white opacity-60"
              to="https://discord.gg/ZC4KykPamV" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0a12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055a20.03 20.03 0 0 0 5.993 2.98a.078.078 0 0 0 .084-.026a13.83 13.83 0 0 0 1.226-1.963a.074.074 0 0 0-.041-.104a13.201 13.201 0 0 1-1.872-.878a.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-2.981a.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028ZM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38c0-1.312.956-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.956 2.38-2.157 2.38Zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38c0-1.312.955-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.946 2.38-2.157 2.38Z" />
              </svg>
            </NuxtLink>
            <NuxtLink hover="text-primary-500 opacity-100" class="text-fs24 transition delay-50 text-white opacity-60"
              to="https://t.me/ethwswap_en" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd"
                  d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12S5.373 0 12 0s12 5.373 12 12ZM12.43 8.859c-1.167.485-3.5 1.49-6.998 3.014c-.568.226-.866.447-.893.663c-.046.366.412.51 1.034.705c.085.027.173.054.263.084c.613.199 1.437.432 1.865.441c.389.008.823-.152 1.302-.48c3.268-2.207 4.955-3.322 5.061-3.346c.075-.017.179-.039.249.024c.07.062.063.18.056.212c-.046.193-1.84 1.862-2.77 2.726c-.29.269-.495.46-.537.504c-.094.097-.19.19-.282.279c-.57.548-.996.96.024 1.632c.49.323.882.59 1.273.856c.427.291.853.581 1.405.943c.14.092.274.187.405.28c.497.355.944.673 1.496.623c.32-.03.652-.331.82-1.23c.397-2.126 1.179-6.73 1.36-8.628a2.111 2.111 0 0 0-.02-.472a.506.506 0 0 0-.172-.325c-.143-.117-.365-.142-.465-.14c-.451.008-1.143.249-4.476 1.635Z"
                  clip-rule="evenodd" />
              </svg>
            </NuxtLink>
            <NuxtLink hover="text-primary-500 opacity-100" class="text-fs24 transition delay-50 text-white opacity-60"
              i-carbon-logo-github to="https://github.com/ethwswap/EthwSwap" target="_blank"></NuxtLink>
            <NuxtLink hover="text-primary-500 opacity-100" class="text-fs24 transition delay-50 text-white opacity-60"
              to="https://etherscan.io/address/0xd78195e2815932f2986214c462e6bf209f326b3a#code" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 32 32">
                <g fill="currentColor" fill-rule="evenodd">
                  <path
                    d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16zm7.994-15.781L16.498 4L9 16.22l7.498 4.353l7.496-4.354zM24 17.616l-7.502 4.351L9 17.617l7.498 10.378L24 17.616z" />
                  <g fill-rule="nonzero">
                    <path fill-opacity=".298" d="M16.498 4v8.87l7.497 3.35zm0 17.968v6.027L24 17.616z" />
                    <path fill-opacity=".801" d="m16.498 20.573l7.497-4.353l-7.497-3.348z" />
                    <path fill-opacity=".298" d="m9 16.22l7.498 4.353v-7.701z" />
                  </g>
                </g>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-show="tokenModal" class="fixed top-0 left-0 w-full h-full bg-black z-999 opacity-75"></div>
      <Transition enter-from-class="opacity-0 scale-95 duration-150 ease-out"
        enter-to-class="opacity-100 scale-100 duration-150 ease-out"
        leave-from-class="opacity-100 scale-100 duration-150 ease-in"
        leave-to-class="opacity-0 scale-95 duration-150 ease-in">
        <div v-show="tokenModal" ref="tokenModalRef"
          class="flex items-center justify-center absolute left-1/2 -ml-190px top-1/2 -mt-120px w-380px p-4 rounded-lg bg-[#012a35] text-white z-999">
          <div class="w-full">
            <div class="flex items-center justify-between">
              <div>{{ $t('home.选择代币') }}</div>
              <i @click="tokenModal = false" i-carbon-close hover="text-primary-500"
                class="text-white inline-block text-fs22 cursor-pointer"></i>
            </div>
            <div class="grid grid-cols-3 gap-2 mt-4 pb-4">
              <div @click="clickToken(item)" v-for="(item, index) in data.tokenList" :key="index"
                hover="border-primary-500 bg-primary-800"
                class="p-2 rounded-lg border border-[#40444f] flex items-center space-x-2 cursor-pointer">
                <img class="w-6 rounded-full" :src="item.icon" alt="" />
                <span>{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div>
      <Transition enter-from-class="opacity-0 scale-95 duration-150 ease-out"
        enter-to-class="opacity-100 scale-100 duration-150 ease-out"
        leave-from-class="opacity-100 scale-100 duration-150 ease-in"
        leave-to-class="opacity-0 scale-95 duration-150 ease-in">
        <div v-show="walletStore.approveState" :class="walletStore.approveState == 1 ? 'bg-primary-500' : 'bg-red'"
          class="flex items-center justify-center absolute right-4 top-4 px-4 py-2 rounded-2xl text-white z-999 flex items-center space-x-2">
          <i class="bg-white" v-if="walletStore.approveState == 1" i-carbon-checkmark-filled></i>
          <i class="bg-white" v-if="walletStore.approveState == 2" i-carbon-checkmark-filled-error></i>
          <span>{{walletStore.tipsMessage}}</span>
        </div>
      </Transition>
    </div>

    <div>
      <div v-show="FAQModal" class="fixed top-0 left-0 w-full h-full bg-black z-999 opacity-75"></div>
      <Transition enter-from-class="opacity-0 scale-95 duration-150 ease-out"
        enter-to-class="opacity-100 scale-100 duration-150 ease-out"
        leave-from-class="opacity-100 scale-100 duration-150 ease-in"
        leave-to-class="opacity-0 scale-95 duration-150 ease-in">
        <div v-show="FAQModal" ref="FAQModalRef" sm="w-600px left-1/2 top-1/6 -ml-300px h-3/4 rounded-lg"
          class="flex items-center justify-center absolute left-0 top-0 w-full h-screen p-4 bg-[#012a35] text-white z-999">
          <div class="w-full h-full">
            <div class="flex items-center justify-between">
              <div>FAQ</div>
              <i @click="FAQModal = false" i-carbon-close hover="text-primary-500"
                class="text-white inline-block text-fs22 cursor-pointer"></i>
            </div>
            <div class="my-4 overflow-auto h-full-6rem space-y-3 text-fs14 leading-6 text-primary-500">
              <p>
                <span class="text-white">{{$t('home.FAQ1')}}</span><br />
                {{$t('home.FAQ2')}}
              </p>
              <p>
                {{$t('home.FAQ3')}}<br />
                {{$t('home.FAQ4')}}
              </p>
              <p>
                {{$t('home.FAQ5')}}
              </p>
              <p>
                <span class="text-white">{{$t('home.FAQ6')}}</span><br />
                {{$t('home.FAQ7')}}
              </p>
              <p>
                {{$t('home.FAQ8')}}
              </p>
              <p>
                {{$t('home.FAQ9')}}
              </p>
              <p>
                <span class="text-white">{{$t('home.FAQ10')}}</span><br />
                {{$t('home.FAQ11')}}<br />
                {{$t('home.FAQ12')}}<br />
                {{$t('home.FAQ13')}}<br />
                {{$t('home.FAQ14')}}
              </p>
              <p class="text-red underline">
                {{$t('home.FAQ15')}}
              </p>
              <p>
                <span class="text-white">{{$t('home.FAQ16')}}</span><br />
                {{$t('home.FAQ17')}}<br />
                {{$t('home.FAQ18')}}
              </p>
              <p>
                <span class="text-white">{{$t('home.FAQ19')}}</span><br />
                {{$t('home.FAQ20')}}<br />
                {{$t('home.FAQ21')}}
              </p>
            </div>
            <div>
              <w-button class="w-full" @click="closeIsShowFAQModal">
                {{$t('home.完成阅读(不再提示)')}}
              </w-button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocaleObject, useI18n } from '#i18n'
const { locale, locales, t } = useI18n()
const walletStore = useWalletStore();
const switchLocalePath = useSwitchLocalePath()
const fromValue = ref('1')
const toValue = ref('')
const isReverse = ref(false)
const gasPrice = ref('')
const getGasLimit = ref('')

const data = reactive({
  tokenList: [
    {
      name: 'DAI',
      icon: '/DAI.png',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
    },
    {
      name: 'USDC',
      icon: '/USDC.png',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
    },
    {
      name: 'USDT',
      icon: '/USDT.png',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
    },
    {
      name: 'WBTC',
      icon: '/WBTC.png',
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      decimals: 8,
    },
  ]
})

const availableLocales = computed(() => {
  return (locales.value as LocaleObject[]).filter(i => i.code !== locale.value)
})

onMounted(async () => {

  FAQModal.value = walletStore.isShowFAQModal

  await walletStore.getGasPrice()
  gasPrice.value = walletStore.$state.gasPrice
  getGasLimit.value = walletStore.$state.getGasLimit

  if (walletStore.netId !== 10001) {
    walletStore.changeNetwork(10001)
  }

  onChangeAccounts()
})

const onChangeAccounts = async () => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts: any[]) => {
      // User account disconnected
      walletStore.setAddredd(accounts[0])
      if (typeof accounts[0] === 'undefined') {
        walletStore.isConnected = false
      }
      walletStore.isConnected = true
      window.web3.eth.getBalance(accounts[0]).then((balance: number) => {
        walletStore.balance = balance
      })
    })
  }
}

const clickConnect = () => {
  if (!walletStore.isAddressLoad) {
    if (!walletStore.isConnected) {
      walletStore.useWeb3()
    }
  }
}

let tokenModal = ref(false)
const tokenModalRef = ref(null)
let currentSelectState = 1
// state: 1.from 2.to
const changeMetamask = (state: number) => {
  currentSelectState = state
  tokenModal.value = !tokenModal.value
}
onClickOutside(
  tokenModalRef,
  (event) => {
    tokenModal.value = false
  },
)

let FAQModal = ref(false)
const FAQModalRef = ref(null)
onClickOutside(
  FAQModalRef,
  (event) => {
    FAQModal.value = false
  },
)

let selectNetwork = ref(false)
const selectNetworkRef = ref(null)
onClickOutside(
  selectNetworkRef,
  (event) => {
    selectNetwork.value = false
  },
)

let showSettings = ref(false)
const showSettingsRef = ref(null)
onClickOutside(
  showSettingsRef,
  (event) => {
    showSettings.value = false
  },
)

const formItem = ref({
  name: 'WETH',
  icon: '/ETH.png',
  address: walletStore.fromAddress,
  decimals: 18,
})
const toItem = ref({
  name: '',
  icon: '',
  address: '',
  decimals: 0,
})
// 选择token
const clickToken = async (item: any) => {
  if (currentSelectState == 1) {
    formItem.value = item
  } else {
    walletStore.setTokenAddress(item.address)
    walletStore.getTokenBalance(item.address)
    walletStore.getTokenDecimals(item.address)
    toItem.value = item
  }
  getEthAndTokenPrice(0)
  tokenModal.value = false
}

const newQuoteData = ref({
  amount: "",
  amountDecimals: "",
  blockNumber: "",
  gasPriceWei: "",
  gasUseEstimate: "",
  gasUseEstimateQuote: "",
  gasUseEstimateQuoteDecimals: "",
  gasUseEstimateUSD: "",
  quote: "",
  quoteDecimals: "",
  quoteGasAdjusted: "",
  quoteGasAdjustedDecimals: "",
  quoteId: "",
  route: [],
  routeString: "",
})
const quoteDataPadding = ref(false)
// 获取交易对价格
const getEthAndTokenPrice = async (state: number) => {
  if (state === 1) {
    fromValue.value = walletStore.limitInputNum(fromValue.value, 20, 4)
  } else if (state === 2) {
    toValue.value = walletStore.limitInputNum(toValue.value, 20, 4)
  }
  if (!formItem.value.address || (!formItem.value.name || !toItem.value.name)) return
  quoteDataPadding.value = true
  quoteDataPadding.value = false
}

const clickTrade = () => {
  let amountIn = !isReverse.value ? fromValue.value : toValue.value
  let tokenInAddress = !isReverse.value ? formItem.value.address : toItem.value.address
  let tokenOutAddress = !isReverse.value ? toItem.value.address : formItem.value.address
  walletStore.getTrade(tokenInAddress, tokenOutAddress, Number(amountIn), gasPrice.value, getGasLimit.value)
}

const changeIsReverse = () => {
  if (isReverse.value) {
    toValue.value = ''
  } else {
    fromValue.value = ''
  }
  isReverse.value = !isReverse.value
}

const closeIsShowFAQModal = () => {
  walletStore.setIsShowFAQModal(false)
  FAQModal.value = false
}

const inputNum = (value: string) => {
  return value
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(/^\./g, "");
}

</script>