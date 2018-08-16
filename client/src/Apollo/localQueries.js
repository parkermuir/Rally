import gql from 'graphql-tag';

const GET_ALL_USERS = gql`
  {
    getAllUsers{
      id
      name
      phoneNumber
      email
    }
  }
`;

module.exports = {
  GET_ALL_USERS
};