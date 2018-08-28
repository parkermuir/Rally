import React from 'react';
import moment from 'moment';
import { Modal, Button, Form, FormControl, ControlLabel, ButtonToolbar, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Mutation } from 'react-apollo';

import { UPDATE_MATCH } from '../apollo/mutations';
class ResultsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWinner: '',
      opponentReview: [],
      goodSport: false,
      rally: false,
      greatServer: false,
    };

    this.handleWinnerSelect = this.handleWinnerSelect.bind(this);
    this.handleOpponentReview = this.handleOpponentReview.bind(this);
  }

  componentDidMount () {
    if ( this.props.winner ) {
      this.setState({
        selectedWinner: this.props.winner
      });
    }
  }

  handleWinnerSelect ( value ) {
    if ( value === 1 ) {
      this.setState({
        selectedWinner: this.props.match.challenger
      });
    } else if ( value === 2 ) {
      this.setState({
        selectedWinner: this.props.match.opponent
      });
    }
  }

  handleOpponentReview ( e ) {
    this.setState({
      opponentReview: e
    });
    console.log('e review', e);
    // if ( value.includes(1) ) {
    //   this.setState({
    //     goodSport: !this.state.goodSport
    //   });
    // } 
    // if ( value.includes(2) ) {
    //   this.setState({
    //     rally: !this.state.rally
    //   });
    // }
    // if ( value.includes(3) ) {
    //   this.setState({
    //     greatServer: !this.state.greatServer
    //   });
    // }
  }

  

  render () {
    return (
      <Modal
        show={ this.props.resultsModalOpen }
        onHide={ this.props.hideResultsModal }
        className="results-modal"
      >

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            { `Your match vs ${ this.props.match.opponent }` }
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form horizontal className="form-width">

            <ControlLabel>Time</ControlLabel>
            <FormControl.Static>
              { moment( new Date( this.props.match.startTime )).calendar() }
            </FormControl.Static>

            <ControlLabel>Court Location</ControlLabel>
            <FormControl.Static>
              { this.props.match.location }
            </FormControl.Static>

            <ControlLabel>Winner</ControlLabel>
            <ButtonToolbar> 
              <ToggleButtonGroup 
                type="radio" 
                name="winner" 
                onChange={ this.handleWinnerSelect } 
              >
                <ToggleButton value={ 1 }>{ this.props.match.challenger }</ToggleButton>
                <ToggleButton value={ 2 }>{ this.props.match.opponent }</ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>

            <ControlLabel>Review Opponent</ControlLabel>
            <ToggleButtonGroup
              type='checkbox'
              // value={ this.state.value }
              onChange={ this.handleOpponentReview }>
              <ToggleButton value={ 1 }>Good Sport</ToggleButton>
              <ToggleButton value={ 2 }>Rally</ToggleButton>
              <ToggleButton value={ 3 }>Great Server</ToggleButton>
            </ToggleButtonGroup>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={ this.props.hideResultsModal }>
            Cancel
          </Button>
          <Mutation
            mutation={ UPDATE_MATCH }
            update={ this.props.hideResultsModal }
          >
            { updateMatch => (
              <Button
                bsStyle="primary"
                onClick={ () => {
                  updateMatch({ variables: {
                    id: this.props.match.id,
                    input: {
                      completed: true,
                      winner: this.state.selectedWinner
                    }
                  }}); 
                }}>
                Submit Results
              </Button>
            )}
          </Mutation>
        </Modal.Footer>

      </Modal>    
    );
  }
}

export default ResultsModal;
