/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateSpotifyUserToken = /* GraphQL */ `subscription OnCreateSpotifyUserToken(
  $filter: ModelSubscriptionSpotifyUserTokenFilterInput
  $owner: String
) {
  onCreateSpotifyUserToken(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSpotifyUserTokenSubscriptionVariables,
  APITypes.OnCreateSpotifyUserTokenSubscription
>;
export const onUpdateSpotifyUserToken = /* GraphQL */ `subscription OnUpdateSpotifyUserToken(
  $filter: ModelSubscriptionSpotifyUserTokenFilterInput
  $owner: String
) {
  onUpdateSpotifyUserToken(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSpotifyUserTokenSubscriptionVariables,
  APITypes.OnUpdateSpotifyUserTokenSubscription
>;
export const onDeleteSpotifyUserToken = /* GraphQL */ `subscription OnDeleteSpotifyUserToken(
  $filter: ModelSubscriptionSpotifyUserTokenFilterInput
  $owner: String
) {
  onDeleteSpotifyUserToken(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSpotifyUserTokenSubscriptionVariables,
  APITypes.OnDeleteSpotifyUserTokenSubscription
>;
