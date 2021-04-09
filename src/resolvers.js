import { gql } from '@apollo/client';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SchemaLink } from '@apollo/client/link/schema';
import IpfsHttpClient from 'ipfs-http-client';
import OrbitDB from 'orbit-db';

import OrbitHandler from './orbit_handler'

const typeDefs = gql`
  type Event {
    _id: ID!
    title: String!
    description: String!
    startStr: String!
    endStr: String
    rrule: String
    duration: Int
    allDay: Boolean!
    resources: [Resource]!
  }

  type Resource {
    _id: ID!
    title: String!
    description: String!
    providing: Boolean!
    tags: [String]!
    event: Event
  }

  input EventInput {
    _id: ID!
    title: String!
    description: String!
    startStr: String!
    endStr: String
    rrule: String
    duration: Int
    allDay: Boolean!
  }

  input ResourceInput {
    _id: ID!
    title: String!
    description: String!
    providing: Boolean!
    tags: [String]!
    event: ID
  }

  input FilterParameters {
    startStr: String
    endStr: String
    tags: [String]!
  }

  type Query {
    events(location: String!, filters: FilterParameters!): [Event]!
    event(location: String!, id: ID!): Event
    resources(location: String!, filters: FilterParameters!): [Resource]!
    resource(location: String!, id: ID!): Resource
  }

  type Mutation {
    addEvent(location: String!, newEvent: EventInput!): ID!
    removeEvent(location: String!, id: ID!): ID!
    addResource(location: String!, newResource: ResourceInput!): ID!
  }
`;

/*
    author: Author!
    resources: [Resource]!
    resources(location: String!): [Resource]
    event(id: ID!): Event
    resource(id: ID!): Resource
    author(id: ID!): Author

  type Author {
    id: ID!
    name: String!
    events: [Event]!
    resources: [Resource]!
  }
  */


const resolvers = {
  Query: {
    events: (parent, args, {orbitHandler}, info) => {
      return orbitHandler.getEvents('places/' + args.location, args.filters);
    }
  },

  Mutation: {
    addEvent: (parent, args, {orbitHandler}, info) => {
      return orbitHandler.addEvent('places/' + args.location, args.newEvent);
    },

    removeEvent: (parent, args, {orbitHandler}, info) => {
      return orbitHandler.removeEvent('places/' + args.location, args.id);
    },

    addResource: (parent, args, {orbitHandler}, info) => {
      return orbitHandler.addResource('places/' + args.location, args.newResource);
    }
  }
};

export function createSchemaLink() {
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  let orbitHandler = new OrbitHandler(IpfsHttpClient, OrbitDB);

  return new SchemaLink({
    schema,
    context: {
      orbitHandler: orbitHandler
    }
  });
}
