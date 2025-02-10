/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateSpotifyUserTokenInput = {
  id?: string | null,
  userId: string,
  accessToken: string,
  refreshToken?: string | null,
  expiresAt?: string | null,
};

export type ModelSpotifyUserTokenConditionInput = {
  userId?: ModelStringInput | null,
  accessToken?: ModelStringInput | null,
  refreshToken?: ModelStringInput | null,
  expiresAt?: ModelStringInput | null,
  and?: Array< ModelSpotifyUserTokenConditionInput | null > | null,
  or?: Array< ModelSpotifyUserTokenConditionInput | null > | null,
  not?: ModelSpotifyUserTokenConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type SpotifyUserToken = {
  __typename: "SpotifyUserToken",
  id: string,
  userId: string,
  accessToken: string,
  refreshToken?: string | null,
  expiresAt?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateSpotifyUserTokenInput = {
  id: string,
  userId?: string | null,
  accessToken?: string | null,
  refreshToken?: string | null,
  expiresAt?: string | null,
};

export type DeleteSpotifyUserTokenInput = {
  id: string,
};

export type ModelSpotifyUserTokenFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelStringInput | null,
  accessToken?: ModelStringInput | null,
  refreshToken?: ModelStringInput | null,
  expiresAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSpotifyUserTokenFilterInput | null > | null,
  or?: Array< ModelSpotifyUserTokenFilterInput | null > | null,
  not?: ModelSpotifyUserTokenFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSpotifyUserTokenConnection = {
  __typename: "ModelSpotifyUserTokenConnection",
  items:  Array<SpotifyUserToken | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionSpotifyUserTokenFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionStringInput | null,
  accessToken?: ModelSubscriptionStringInput | null,
  refreshToken?: ModelSubscriptionStringInput | null,
  expiresAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSpotifyUserTokenFilterInput | null > | null,
  or?: Array< ModelSubscriptionSpotifyUserTokenFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreateSpotifyUserTokenMutationVariables = {
  input: CreateSpotifyUserTokenInput,
  condition?: ModelSpotifyUserTokenConditionInput | null,
};

export type CreateSpotifyUserTokenMutation = {
  createSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateSpotifyUserTokenMutationVariables = {
  input: UpdateSpotifyUserTokenInput,
  condition?: ModelSpotifyUserTokenConditionInput | null,
};

export type UpdateSpotifyUserTokenMutation = {
  updateSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteSpotifyUserTokenMutationVariables = {
  input: DeleteSpotifyUserTokenInput,
  condition?: ModelSpotifyUserTokenConditionInput | null,
};

export type DeleteSpotifyUserTokenMutation = {
  deleteSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetSpotifyUserTokenQueryVariables = {
  id: string,
};

export type GetSpotifyUserTokenQuery = {
  getSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListSpotifyUserTokensQueryVariables = {
  filter?: ModelSpotifyUserTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSpotifyUserTokensQuery = {
  listSpotifyUserTokens?:  {
    __typename: "ModelSpotifyUserTokenConnection",
    items:  Array< {
      __typename: "SpotifyUserToken",
      id: string,
      userId: string,
      accessToken: string,
      refreshToken?: string | null,
      expiresAt?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type SpotifyUserTokensByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSpotifyUserTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SpotifyUserTokensByUserIdQuery = {
  spotifyUserTokensByUserId?:  {
    __typename: "ModelSpotifyUserTokenConnection",
    items:  Array< {
      __typename: "SpotifyUserToken",
      id: string,
      userId: string,
      accessToken: string,
      refreshToken?: string | null,
      expiresAt?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateSpotifyUserTokenSubscriptionVariables = {
  filter?: ModelSubscriptionSpotifyUserTokenFilterInput | null,
  owner?: string | null,
};

export type OnCreateSpotifyUserTokenSubscription = {
  onCreateSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateSpotifyUserTokenSubscriptionVariables = {
  filter?: ModelSubscriptionSpotifyUserTokenFilterInput | null,
  owner?: string | null,
};

export type OnUpdateSpotifyUserTokenSubscription = {
  onUpdateSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteSpotifyUserTokenSubscriptionVariables = {
  filter?: ModelSubscriptionSpotifyUserTokenFilterInput | null,
  owner?: string | null,
};

export type OnDeleteSpotifyUserTokenSubscription = {
  onDeleteSpotifyUserToken?:  {
    __typename: "SpotifyUserToken",
    id: string,
    userId: string,
    accessToken: string,
    refreshToken?: string | null,
    expiresAt?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
