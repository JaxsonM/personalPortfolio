/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createSpotifyUserToken = /* GraphQL */ `mutation CreateSpotifyUserToken(
  $input: CreateSpotifyUserTokenInput!
  $condition: ModelSpotifyUserTokenConditionInput
) {
  createSpotifyUserToken(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSpotifyUserTokenMutationVariables,
  APITypes.CreateSpotifyUserTokenMutation
>;
export const updateSpotifyUserToken = /* GraphQL */ `mutation UpdateSpotifyUserToken(
  $input: UpdateSpotifyUserTokenInput!
  $condition: ModelSpotifyUserTokenConditionInput
) {
  updateSpotifyUserToken(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSpotifyUserTokenMutationVariables,
  APITypes.UpdateSpotifyUserTokenMutation
>;
export const deleteSpotifyUserToken = /* GraphQL */ `mutation DeleteSpotifyUserToken(
  $input: DeleteSpotifyUserTokenInput!
  $condition: ModelSpotifyUserTokenConditionInput
) {
  deleteSpotifyUserToken(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSpotifyUserTokenMutationVariables,
  APITypes.DeleteSpotifyUserTokenMutation
>;
