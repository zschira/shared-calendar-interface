import { gql } from '@apollo/client';

export const ADD_EVENT = gql`
  mutation AddEvent($location: String!, $newEvent: EventInput!) {
    addEvent(location: $location, newEvent: $newEvent) {
      _id
    }
  }
`;

export const REMOVE_EVENT = gql`
  mutation RemoveEvent($location: String!, $id: ID!) {
    removeEvent(location: $location, id: $id) {
      _id
    }
  }
`;

export const ADD_RESOURCE = gql`
  mutation AddResource($location: String!, $newResource: ResourceInput!) {
    addResource(location: $location, newResource: $newResource) {
      _id
    }
  }
`;
