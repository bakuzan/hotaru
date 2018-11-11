import gql from 'graphql-tag';

const seriesBase = gql`
  fragment SeriesBase on Series {
    id
    name
    displayImage
  }
`;

const characterBase = gql`
  fragment CharacterBase on Character {
    id
    name
    displayImage
  }
`;

const leagueTableBase = gql`
  fragment LeagueTableBase on LeagueCharacter {
    id
    name
    displayImage
  }
`;

const versusBase = gql`
  fragment VersusBase on Versus {
    id
    characters {
      id
      name
      displayImage
    }
    winnerId
  }
`;

const leagueInstanceFields = gql`
  fragment LeagueFields on HTRInstance {
    id
    name
    settings {
      isComplete
      limit
      layout
    }
  }
`;
const ongoingLeagueFields = gql`
  fragment OngoingLeagueFields on HTRTemplate {
    id
    name
    instances {
      ...LeagueFields
    }
  }
  ${leagueInstanceFields}
`;

export default {
  seriesBase,
  characterBase,
  versusBase,
  leagueInstanceFields,
  ongoingLeagueFields,
  leagueTableBase
};
