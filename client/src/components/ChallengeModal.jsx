import React from 'react';
import { Modal, Button, Form, FormControl, ControlLabel } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import { UPDATE_MATCH, DELETE_MATCH } from '../apollo/mutations';
import moment from 'moment';

import Map from './Map.jsx';

const ChallengeModal = (props) => {
  let matchOpponent;
  if (props.challenge) {
    if (props.currentUser === props.challenge.challenger) {
      matchOpponent = props.challenge.opponentUserInfo;
    } else {
      matchOpponent = props.challenge.challengerUserInfo;
    } 

    return (
      <Modal
        show={ props.challengeModalOpen }
        onHide={ props.hideChallengeModal }
        className="accept-challenge-modal"
      >

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            { `Match against ${ matchOpponent.name }` }
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form horizontal className="form-width">
            <ControlLabel>Opponent</ControlLabel>
            <FormControl.Static>
              { matchOpponent.name }
            </FormControl.Static>
            <ControlLabel>Time</ControlLabel>
            <FormControl.Static>
              { moment( new Date( props.challenge.startTime )).calendar() }
            </FormControl.Static>
            <ControlLabel>Court Location</ControlLabel>
            <FormControl.Static>
              { props.challenge.location }
            </FormControl.Static>
          </Form>

          <Map 
            courts={ [props.challenge.court] }
          />
        </Modal.Body>

        { !props.challenge.accepted && <Modal.Footer>
          <Mutation
            mutation={ DELETE_MATCH }
            update={ props.hideChallengeModal }
            variables={{
              id: props.challenge.id,
              input: {
                accepted: true
              }
            }}
          >
            { deleteMatch => (
              <Button
                className="decline-button"
                onClick={ deleteMatch }>
                Decline
              </Button>
            )}
          </Mutation>

          <Mutation
            mutation={ UPDATE_MATCH }
            update={ props.hideChallengeModal }
            variables={{
              id: props.challenge.id,
              input: {
                accepted: true
              }
            }}
          >
            {acceptMatch => (
              <Button
                className="challenge-button"
                bsStyle="primary"
                onClick={ acceptMatch }>
                Accept Challenge
              </Button>
            )}
          </Mutation>
        </Modal.Footer>} 
      </Modal>   
    );
  } else { 
    return null;
  }
};

export default ChallengeModal;
