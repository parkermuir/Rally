const models = require('./index.js');
let { Op } = models;

const resolvers = {

  User: {

    /*--- USER TYPE RESOLVERS ---*/
    completedMatches: async ({ email }) => {
      try {
        return await models.Match.findAll({
          where: {
            [Op.or]: [
              { challenger: email },
              { opponent: email }
            ],
            completed: true
          }
        });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    pendingMatches: async ({ email }) => {
      try {
        return await models.Match.findAll({
          where: {
            [Op.or]: [
              { challenger: email },
              { opponent: email }
            ],
            completed: false,
            accepted: true
          }
        });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    challengesSent: async ({ email }) => {
      try {
        return await models.Match.findAll({
          where: {
            challenger: email,
            accepted: false
          }
        });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    challengesReceived: async ({ email }) => {
      try {
        return await models.Match.findAll({
          where: {
            opponent: email,
            accepted: false
          }
        });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    }
  },

  Match: {

    /*--- MATCH TYPE RESOLVERS ---*/
    court: async ({ location }) => {
      try {
        return await models.Court.findOne({ where: { name: location }});
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    challengerUserInfo: async({ challenger }) => {
      try {
        return await models.User.findOne({ where: { email: challenger }});
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    opponentUserInfo: async({ opponent }) => {
      try {
        return await models.User.findOne({ where: { email: opponent } });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    }

  },

  Query: {

    /*--- USER QUERIES ---*/
    checkEmailIsUnique: async ( _, { email } ) => {
      let result = await models.User.findOne({ where: { email }});
      if ( !result ) {
        return true;
      } else {
        return false;
      } 
    },

    getAllUsers: async ( ) => {
      try {
        return await models.User.findAll({});
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    getUsersByTier: async ( _, { tier, email } ) => {
      try {
        return await models.User.findAll({
          where: {
            tier,
            [Op.not]: {
              email
            }
          }
        });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    getUserByEmail: async( _, { email } ) => {
      try {
        return await models.User.findOne({ where: { email }});
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },
    
    getAllCourts: async ( ) => {
      try {
        return await models.Court.findAll({});
      } catch ( error ) {
        console.error( error );
        return false;
      }
    }

  },
    
  Mutation: {

    /*--- USER MUTATIONS ---*/
    createUser: async ( _, { input } ) => {
      try {
        return await models.User.create( input );
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    updateUser: async ( _, { input, email } ) => {
      try {
        return await models.User.findOne({
          where: { email }
        })
          .then(( user ) => {
            return user.updateAttributes( input );
          });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    /*--- MATCH MUTATIONS ---*/
    createMatch: async ( _, { input } ) => {
      try {
        return await models.Match.create( input );
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    updateMatch: async ( _, { input, id } ) => {
      try {
        return await models.Match.findOne({
          where: { id }
        })
          .then(( match ) => {
            match.updateAttributes( input );
            return true;
          });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    deleteMatch: async ( _, { id } ) => {
      try {
        return await models.Match.destroy({
          where: { id }
        });
      } catch (error) {
        console.error(error);
        return false;
      }

    },

    /*--- COURT MUTATIONS ---*/
    createCourt: async ( _, { input } ) => {
      try {
        return await models.Court.create( input );
      } catch ( error ) {
        console.error( error );
        return false;
      }
    },

    updateCourt: async ( _, { input, location } ) => {
      try {
        return await models.Court.findOne({
          where: { location }
        })
          .then( court => {
            court.updateAttributes( input );
            return true;
          });
      } catch ( error ) {
        console.error( error );
        return false;
      }
    }
  }
};

module.exports = resolvers;
