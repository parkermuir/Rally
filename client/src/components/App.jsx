import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ApolloProvider, Query } from 'react-apollo';
import { BounceLoader } from 'react-spinners';

import firebase from '../../../firebase/firebase.js';
import NavBar from './NavBar.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import ProfileView from './ProfileView.jsx';
import MatchmakingView from './MatchmakingView.jsx';
import MatchesView from './MatchesView.jsx';
import { CHECK_EMAIL_IS_UNIQUE, GET_USER_BY_EMAIL, GET_USER_PROFILE_DATA } from '../apollo/queries.js';
import Footer from './Footer.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      googleUserData: null,
      playerData: null,
      loading: true
    };

    this.guestSignIn = this.guestSignIn.bind(this);
    this.authListener = this.authListener.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.googleSignOut = this.googleSignOut.bind(this);
    this.mapDBPlayerDataToState = this.mapDBPlayerDataToState.bind(this);
  }

  componentDidMount () {
    this.authListener();
  }

  /* --- GOOGLE AUTH FUNCTIONS --- */
  authListener () {
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        this.setState({
          googleUserData: Object.assign( {}, user.providerData[0] ),
          loading: false
        });
      } else {
        this.setState({
          googleUserData: null,
          loading: false
        });
      }
    });
  }
  googleSignIn () {
    this.setState({
      loading: true
    });

    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect( provider )
      .then( () => {
        return;
      })
      .catch( (err) => {
        console.error( err );
      });
  }
  googleSignOut () {
    this.setState({
      googleUserData: null
    });

    firebase.auth().signOut()
      .then( () => {
        return;
      })
      .catch( ( err ) => {
        console.error( err );
      });
  }

  guestSignIn () {
    this.setState({
      googleUserData: {
        email: 'guest@guest.com',
        displayName: 'Jane Doe'
      }
    });
  }

  /* --- UPDATING USER INFO FROM DB --- */
  mapDBPlayerDataToState ( dbData ) {
    this.setState({
      playerData: dbData
    });
  }

  render () {
    if ( this.state.loading ) {
      return (
        <div className="loading-spinner">
          <BounceLoader
            sizeUnit={'px'}
            size={200}
            color={'black'}
            loading={ this.state.loading }
          />
        </div>
      );
    }
    return (
      <ApolloProvider client={ this.props.client }>
        <NavBar
          guestSignIn={ this.guestSignIn }
          googleSignOut={ this.googleSignOut }
          googleSignIn={ this.googleSignIn }
          googleUserData={ this.state.googleUserData }
          playerData={ this.state.playerData }
        />
        <Switch>
          <Route exact path='/' render={ () => {
            if ( this.state.googleUserData ) {
              return <Redirect to='/signup'/>;
            } else {
              return <Redirect to='/login' />;
            }
          }}/>
          <Route path='/login' render={ () => {
            if ( this.state.googleUserData ) {
              return <Redirect to='/signup'/>;
            } else {
              return <Login googleSignIn={ this.googleSignIn }/>;
            }
          }}/>
          <Route path='/signup' render={ () => {
            { if ( this.state.googleUserData ) {
              return (
                <Query
                  query={ CHECK_EMAIL_IS_UNIQUE }
                  variables={{ email: this.state.googleUserData.email }}
                  fetchPolicy='no-cache'
                >
                  {({ loading, error, data }) => {
                    if ( loading ) { return <p>Loading...</p>; }
                    if ( error ) { return <p>Error! ${ error }</p>; }
                    let result = data.checkEmailIsUnique || false;
                    if ( result === false ) {
                      return <Redirect to='/matchmaking'/>;
                    } else {
                      return <Signup
                        googleUserData={ this.state.googleUserData }
                        mapGoogleDataToProfile={ this.mapGoogleDataToProfile }
                      />;
                    }
                  }}
                </Query>
              );
            } else {
              return null;
            } }
          }}/>
          <Route path='/matchmaking' render={ () => (
            <Query
              query={ GET_USER_BY_EMAIL }
              variables={{ email: this.state.googleUserData.email }}
              pollInterval={ 500 }
            >
              {({ loading, error, data }) => {
                if ( loading ) { return <p>Loading...</p>; }
                if ( error ) { return <p>Error! ${ error }</p>; }
                return <MatchmakingView
                  playerData = { data.getUserByEmail }
                  dbPlayerData={ data.getUserByEmail } 
                  mapGoogleDataToProfile={ this.mapGoogleDataToProfile }
                  mapDBPlayerDataToState={ this.mapDBPlayerDataToState }
                />;
              }}
            </Query>
          )}/>
          <Route path='/matches' render={ () =>
            <MatchesView
              googleUserData={ this.state.googleUserData }
              playerData={ this.state.playerData }
            />
          }/>;
          <Route path='/profile' render={ () =>
            <Query
              query={ GET_USER_PROFILE_DATA }
              variables={{ email: this.state.googleUserData.email }}
              pollInterval={ 500 }
            >
              {({ loading, error, data }) => {
                if ( loading ) { return <p>Loading...</p>; }
                if ( error ) { return <p>Error! ${ error }</p>; }
                return <ProfileView 
                  googleUserData={ this.state.googleUserData }
                  playerData={ data.getUserByEmail }
                />;
              }}
            </Query>
          }/>
        </Switch>

        <Footer/>
        
      </ApolloProvider>
    );
  }
}

export default App;
