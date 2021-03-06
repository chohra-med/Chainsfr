// @flow
import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import DirectTransferFormContainer from '../containers/DirectTransferFormContainer'
import WalletAuthorization from '../containers/WalletAuthorizationContainer'
import Review from '../containers/ReviewContainer'
import queryString from 'query-string'
import paths from '../Paths'
import { Redirect } from 'react-router'

type Props = {
  classes: Object,
  step: number,
  history: Object,
  transferForm: Object,
  online: boolean
}

class DirectTransferComponent extends React.Component<Props> {
  render () {
    const { classes, history, transferForm, online } = this.props
    // recover '&' from encoded '&amp;'
    // used for intercom product tour
    const urlParams = queryString.parse(history.location.search.replace(/amp%3B|amp;/g, ''))
    let step = urlParams.step

    let renderStep

    if (!step || step === 0) {
      renderStep = (
        <Grid item className={classes.formContainer}>
          <DirectTransferFormContainer
            walletSelectionPrefilled={urlParams && urlParams.walletSelection}
            addressPrefilled={urlParams && urlParams.address}
            cryptoTypePrefilled={urlParams && urlParams.cryptoType}
            platformTypePrefilled={urlParams && urlParams.platformType}
            destinationPrefilled={urlParams && (urlParams.destination || '')}
            receiverNamePrefilled={urlParams && (urlParams.receiverName || '')}
            xpubPrefilled={urlParams && urlParams.xpubPrefilled}
            online={online}
          />
        </Grid>
      )
    } else if ((step === '1' || step === '2') && !transferForm.validated) {
      renderStep = <Redirect to={paths.directTransfer} />
    } else if (step === '1') {
      renderStep = (
        <Grid item className={classes.subContainer}>
          <Review online={online} directTransfer />
        </Grid>
      )
    } else if (step === '2') {
      renderStep = (
        <Grid item className={classes.walletAuthorizationContainer}>
          <WalletAuthorization online={online} directTransfer />
        </Grid>
      )
    } else if (step === '3') {
      renderStep = <Redirect push to={paths.receipt} />
    }
    return (
      <Grid container direction='column' alignItems='center'>
        <Grid item className={classes.sectionContainer}>
          <Grid container direction='column' alignItems='stretch'>
            <Grid item>
              <Grid container direction='column' alignItems='center'>
                {renderStep}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

const styles = theme => ({
  formContainer: {
    width: '100%',
    maxWidth: '540px',
    marginTop: 30,
    padding: '30px'
  },
  subContainer: {
    width: '100%',
    maxWidth: '550px',
    margin: '0px 0px 16px 0px',
    padding: '30px'
  },
  walletAuthorizationContainer: {
    width: '100%',
    maxWidth: '550px',
    margin: '0px 0px 16px 0px',
    padding: '30px'
  },
  walletSelectionContainer: {
    width: '100%',
    maxWidth: '1080px',
    margin: '0px 0px 16px 0px'
  },
  sectionContainer: {
    width: '100%',
    maxWidth: '1080px'
  }
})

export default withStyles(styles)(DirectTransferComponent)
