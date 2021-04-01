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
    }
  }
`;
