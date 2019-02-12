import React, { Component } from 'react'
import { connect } from 'react-redux'
import WalletSelection from '../components/WalletSelectionComponent'
import { checkMetamaskConnection, checkLedgerNanoSConnection, selectCrypto, selectWallet } from '../actions'
import { createLoadingSelector, createErrorSelector } from '../selectors'

class WalletSelectionContainer extends Component {
  onWalletSelected = (walletType) => {
    const {
      checkMetamaskConnection,
      checkLedgerNanoSConnection,
      cryptoSelection,
      selectWallet
    } = this.props
    if (walletType === 'ledger' && walletType !== cryptoSelection) {
      checkLedgerNanoSConnection()
    } else if (walletType === 'metamask' && walletType !== cryptoSelection) {
      checkMetamaskConnection()
    }

    selectWallet(walletType)
  }

  render () {
    const {
      selectCrypto,
      walletSelection,
      cryptoSelection,
      ...other
    } = this.props
    return (
      <WalletSelection
        walletType={walletSelection}
        cryptoType={cryptoSelection}
        onCryptoSelected={selectCrypto}
        onWalletSelected={this.onWalletSelected}
        {...other}
      />
    )
  }
}

const checkMetamaskConnectionSelector = createLoadingSelector(['CHECK_METAMASK_CONNECTION'])
const errorSelector = createErrorSelector(['CHECK_METAMASK_CONNECTION'])

const mapDispatchToProps = dispatch => {
  return {
    checkMetamaskConnection: () => dispatch(checkMetamaskConnection(dispatch)),
    checkLedgerNanoSConnection: () => dispatch(checkLedgerNanoSConnection()),
    selectCrypto: (c) => dispatch(selectCrypto(c)),
    selectWallet: (w) => dispatch(selectWallet(w))
  }
}

const mapStateToProps = state => {
  return {
    walletSelection: state.transferReducer.walletSelection,
    cryptoSelection: state.transferReducer.cryptoSelection,
    metamask: state.userReducer.metamask,
    actionsPending: {
      checkMetamaskConnection: checkMetamaskConnectionSelector(state)
    },
    error: errorSelector(state)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletSelectionContainer)