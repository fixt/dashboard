import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay'

import {
  Card,
  getSprintlyCard,
  getSprintlyCards,
} from './sprintly';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Card') {
      return getCard(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Card) {
      console.log('in card definition')
      return cardType;
    } else {
      return null;
    }
  }
)

/**
 * Define your own types here
 */

var cardType = new GraphQLObjectType({
  name: 'Card',
  description: 'A Sprintly Card',
  fields: () => ({
    id: globalIdField('Card'),
    title: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    status: {
      type: GraphQLString
    }
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: cardConnection} = connectionDefinitions({
  name: 'Card',
  nodeType: cardType,
  connectionFields: () => ({
    total: {
      type: GraphQLInt,
      resolve: (conn) => {
        return conn.totalCount
      }
    }
  })
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    cards: {
      type: cardConnection,
      args: connectionArgs,
      resolve: async (_, args) => {
        var { objects, totalCount } = await getSprintlyCards(args)
        return {
          ...connectionFromArray(objects, args),
          totalCount
        }
      },
    }
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  //mutation: mutationType
})
