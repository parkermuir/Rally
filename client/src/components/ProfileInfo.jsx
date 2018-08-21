import React from 'react';
import { Form, FormGroup, FormControl, Col, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import Mutations, { Mutation } from 'react-apollo';

import TierModal from './TierModal.jsx';
import { UPDATE_USER } from '../apollo/mutations.js';

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openElo: false,
      username: '',
      phoneNumber: '',
      location: '',
      skillTier: 'Skill Tier',
      tierModal: false
    };
    this.handleHide = this.handleHide.bind(this);
    this.handleUsernameInput = this.handleUsernameInput.bind(this);
    this.handlePhoneNumberInput = this.handlePhoneNumberInput.bind(this);
    this.handleLocationInput = this.handleLocationInput.bind(this);
    this.handleSkillSelect = this.handleSkillSelect.bind(this);
    this.toggleTierModal = this.toggleTierModal.bind(this);
  }

  toggleTierModal() {
    this.setState({
      tierModal: !this.state.tierModal 
    });
  }

  handleHide() {
    this.setState({ openElo: false });
  }

  handleUsernameInput(e) {
    this.setState({username: e.target.value});
  }

  handlePhoneNumberInput(e) {
    this.setState({phoneNumber: e.target.value});
  }

  handleLocationInput(e) {
    this.setState({location: e.target.value});
  }

  handleSkillSelect(e) {
    this.setState({skillTier: e});
  }

  render() {
    return (
      <div>
        <h3>Add Info</h3>
        <Form horizontal>
          <FormGroup onChange={ this.handleUsernameInput } controlId="formHorizontalUsername" >
            <Col sm={2}>
              Username
            </Col>
            <Col sm={4}>
              <FormControl type="username" placeholder="Username" />
            </Col>
          </FormGroup>

          <FormGroup onChange={ this.handlePhoneNumberInput }>
            <Col sm={2}>
              Phone Number
            </Col>
            <Col sm={4}>
              <FormControl placeholder="Phone Number" />
            </Col>
          </FormGroup>
          
          <DropdownButton
            onSelect={this.handleSkillSelect}
            bsSize="large"
            title={this.state.skillTier}
            id="dropdown-size-large"
          >
            <MenuItem eventKey="1">1</MenuItem>
            <MenuItem eventKey="2">2</MenuItem>
            <MenuItem eventKey="3">3</MenuItem>
            <MenuItem eventKey="4">4</MenuItem>
          </DropdownButton>
          <Button
            onClick={ this.toggleTierModal }
            bsStyle="primary" 
            bsSize="small">
             How do I know my tier?
          </Button>
        
          <FormGroup>
            <Col smOffset={2} sm={4}>
              <Mutation
                mutation={ UPDATE_USER }
                variables={{
                  email: this.props.userProfile.email,
                  name: this.state.username,
                  phoneNumber: this.state.phoneNumber
                }}>
                { updateUser => (
                  <Button onClick={ updateUser }>
                    Submit
                  </Button>
                ) }
              </Mutation>
            </Col>
          </FormGroup>
        </Form>

        <TierModal
          tierModal={ this.state.tierModal }
          toggleTierModal={ this.toggleTierModal }
        />
      </div>
    );
  }
}


export default ProfileInfo;