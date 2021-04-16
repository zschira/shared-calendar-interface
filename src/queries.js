import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query Events($location: String!, $filters: FilterParameters!) {
    events(location: $location, filters: $filters) {
      _id
      title
      description
      startStr
      endStr
      rrule
      duration
      allDay
      resources {
        _id
        tags
      }
    }
  }
`;

export const GET_RESOURCES = gql`
  query Resources($location: String!, $filters: FilterParameters!) {
    resources(location: $location, filters: $filters) {
      _id
      title
      description
      providing
      tags
      event {
        _id
      }
    }
  }
`;

export const GET_RESOURCE = gql`
  query Resources($location: String!, $id: String!) {
    resources(location: $location, id: $id) {
      _id
      title
      description
      providing
      tags
      event {
        _id
      }
    }
  }
`;
