import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

class GoogleLoginButton extends Component {
  gapiLoad = () => {
    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', {
        callback: function () {
          // Handle gapi.client initialization.
          resolve()
        },
        onerror: function () {
          reject(new Error('Load gapi client failed'))
        },
        timeout: 5000, // 5 seconds.
        ontimeout: function () {
          // Handle timeout.
          reject(new Error('Load gapi client timeout'))
        }
      })
    })
  }

  login = async () => {
    try {
      await this.gapiLoad()
      console.log('gapi loaded')
      let googleAuth = await window.gapi.auth2.getAuthInstance()
      if (!googleAuth || !googleAuth.isSignedIn.get()) {
        const client = await window.gapi.auth2.init({
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          scope: process.env.REACT_APP_GOOGLE_API_SCOPE,
          discoveryDocs: process.env.REACT_APP_GOOGLE_API_DISCOVERY_DOCS
        })

        // set option to display account selection everytime
        // This is what differs from react-google-login
        let options = new window.gapi.auth2.SigninOptionsBuilder()
        options.setPrompt('select_account')
        const res = await client.signIn(options)

        const basicProfile = res.getBasicProfile()
        const authResponse = res.getAuthResponse()
        res.googleId = basicProfile.getId()
        res.tokenObj = authResponse
        res.idToken = authResponse.id_token
        res.accessToken = authResponse.access_token
        res.profileObj = {
          googleId: basicProfile.getId(),
          imageUrl: basicProfile.getImageUrl(),
          email: basicProfile.getEmail(),
          name: basicProfile.getName(),
          givenName: basicProfile.getGivenName(),
          familyName: basicProfile.getFamilyName()
        }
        this.props.onSuccess(res)
      }
    } catch (e) {
      this.props.onFailure(e)
    }
  }

  render () {
    const { disabled } = this.props
    return (
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={() => this.login()}
        disabled={disabled}
      >
        Sign in with Google
      </Button>
    )
  }
}

export default GoogleLoginButton
