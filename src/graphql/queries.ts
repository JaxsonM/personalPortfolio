/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getSpotifyUserToken = /* GraphQL */ `query GetSpotifyUserToken($id: ID!) {
  getSpotifyUserToken(id: $id) {
    id
    userId
    accessToken
    refreshToken
    expiresAt
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSpotifyUserTokenQueryVariables,
  APITypes.GetSpotifyUserTokenQuery
>;
export const listSpotifyUserTokens = /* GraphQL */ `query ListSpotifyUserTokens(
  $filter: ModelSpotifyUserTokenFilterInput
  $limit: Int
  $nextToken: String
) {
  listSpotifyUserTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      accessToken
      refreshToken
      expiresAt
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSpotifyUserTokensQueryVariables,
  APITypes.ListSpotifyUserTokensQuery
>;
export const spotifyUserTokensByUserId = /* GraphQL */ `query SpotifyUserTokensByUserId(
  $userId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelSpotifyUserTokenFilterInput
  $limit: Int
  $nextToken: String
) {
  spotifyUserTokensByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      accessToken
      refreshToken
      expiresAt
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SpotifyUserTokensByUserIdQueryVariables,
  APITypes.SpotifyUserTokensByUserIdQuery
>;
