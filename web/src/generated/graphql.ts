import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, QueryFunctionContext } from 'react-query';
import { useFetchData } from '@/hooks/fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ByteArray: any;
  ContractAddress: any;
  Cursor: any;
  DateTime: any;
  Enum: any;
  bool: any;
  felt252: any;
  u8: any;
  u16: any;
  u32: any;
  u64: any;
  u128: any;
  u256: any;
};

export type Erc20__Token = {
  __typename?: 'ERC20__Token';
  amount: Scalars['String'];
  contractAddress: Scalars['String'];
  decimals: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
};

export type Erc721__Token = {
  __typename?: 'ERC721__Token';
  contractAddress: Scalars['String'];
  imagePath: Scalars['String'];
  metadata: Scalars['String'];
  metadataAttributes?: Maybe<Scalars['String']>;
  metadataDescription?: Maybe<Scalars['String']>;
  metadataName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  tokenId: Scalars['String'];
};

export type Erc1155__Token = {
  __typename?: 'ERC1155__Token';
  amount: Scalars['String'];
  contractAddress: Scalars['String'];
  imagePath: Scalars['String'];
  metadata: Scalars['String'];
  metadataAttributes?: Maybe<Scalars['String']>;
  metadataDescription?: Maybe<Scalars['String']>;
  metadataName?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  tokenId: Scalars['String'];
};

export type Erc__Token = Erc20__Token | Erc721__Token | Erc1155__Token;

export type ModelUnion = Dopewars_Bundle | Dopewars_BundleGroup | Dopewars_BundleIssuance | Dopewars_BundleIssued | Dopewars_BundleReferral | Dopewars_BundleRegistered | Dopewars_BundleUpdated | Dopewars_BundleVoucher | Dopewars_Claimed | Dopewars_DailyPurchase | Dopewars_DopewarsItemTier | Dopewars_DopewarsItemTierConfig | Dopewars_DrugConfig | Dopewars_Erc20BalanceEvent | Dopewars_EncounterStatsConfig | Dopewars_Game | Dopewars_GameConfig | Dopewars_GameCreated | Dopewars_GameOver | Dopewars_GameStorePacked | Dopewars_GearInstance | Dopewars_GearTemplate | Dopewars_HighVolatility | Dopewars_HustlerInstance | Dopewars_HustlerTemplate | Dopewars_LocationConfig | Dopewars_MarketConfig | Dopewars_NewHighScore | Dopewars_NewSeason | Dopewars_PaymentConfig | Dopewars_RyoAddress | Dopewars_RyoConfig | Dopewars_Season | Dopewars_SeasonSettings | Dopewars_Starterpack | Dopewars_TradeDrug | Dopewars_TravelEncounter | Dopewars_TravelEncounterResult | Dopewars_Traveled | Dopewars_TrophyCreation | Dopewars_TrophyProgression | Dopewars_UpgradeItem;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Token = {
  __typename?: 'Token';
  tokenMetadata: Erc__Token;
};

export type TokenConnection = {
  __typename?: 'TokenConnection';
  edges?: Maybe<Array<Maybe<TokenEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type TokenEdge = {
  __typename?: 'TokenEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Token>;
};

export type Token__Balance = {
  __typename?: 'Token__Balance';
  tokenMetadata: Erc__Token;
};

export type Token__BalanceConnection = {
  __typename?: 'Token__BalanceConnection';
  edges?: Maybe<Array<Maybe<Token__BalanceEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Token__BalanceEdge = {
  __typename?: 'Token__BalanceEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Token__Balance>;
};

export type Token__Transfer = {
  __typename?: 'Token__Transfer';
  executedAt: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
  tokenMetadata: Erc__Token;
  transactionHash: Scalars['String'];
};

export type Token__TransferConnection = {
  __typename?: 'Token__TransferConnection';
  edges?: Maybe<Array<Maybe<Token__TransferEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Token__TransferEdge = {
  __typename?: 'Token__TransferEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Token__Transfer>;
};

export type World__Call = {
  __typename?: 'World__Call';
  callType?: Maybe<Scalars['String']>;
  calldata?: Maybe<Array<Maybe<Scalars['String']>>>;
  callerAddress?: Maybe<Scalars['String']>;
  contractAddress?: Maybe<Scalars['String']>;
  entrypoint?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type World__Content = {
  __typename?: 'World__Content';
  coverUri?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  iconUri?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  socials?: Maybe<Array<Maybe<World__Social>>>;
  website?: Maybe<Scalars['String']>;
};

export type World__Controller = {
  __typename?: 'World__Controller';
  address: Scalars['String'];
  deployedAt: Scalars['DateTime'];
  id?: Maybe<Scalars['ID']>;
  username: Scalars['String'];
};

export type World__ControllerConnection = {
  __typename?: 'World__ControllerConnection';
  edges?: Maybe<Array<Maybe<World__ControllerEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__ControllerEdge = {
  __typename?: 'World__ControllerEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Controller>;
};

export type World__Entity = {
  __typename?: 'World__Entity';
  createdAt?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['String']>;
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type World__EntityConnection = {
  __typename?: 'World__EntityConnection';
  edges?: Maybe<Array<Maybe<World__EntityEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__EntityEdge = {
  __typename?: 'World__EntityEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Entity>;
};

export type World__Event = {
  __typename?: 'World__Event';
  createdAt?: Maybe<Scalars['DateTime']>;
  data?: Maybe<Array<Maybe<Scalars['String']>>>;
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type World__EventConnection = {
  __typename?: 'World__EventConnection';
  edges?: Maybe<Array<Maybe<World__EventEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__EventEdge = {
  __typename?: 'World__EventEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Event>;
};

export type World__EventMessage = {
  __typename?: 'World__EventMessage';
  createdAt?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['String']>;
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type World__EventMessageConnection = {
  __typename?: 'World__EventMessageConnection';
  edges?: Maybe<Array<Maybe<World__EventMessageEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__EventMessageEdge = {
  __typename?: 'World__EventMessageEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__EventMessage>;
};

export type World__Metadata = {
  __typename?: 'World__Metadata';
  content?: Maybe<World__Content>;
  coverImg?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  executedAt?: Maybe<Scalars['DateTime']>;
  iconImg?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  uri?: Maybe<Scalars['String']>;
  worldAddress: Scalars['String'];
};

export type World__MetadataConnection = {
  __typename?: 'World__MetadataConnection';
  edges?: Maybe<Array<Maybe<World__MetadataEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__MetadataEdge = {
  __typename?: 'World__MetadataEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Metadata>;
};

export type World__Model = {
  __typename?: 'World__Model';
  classHash?: Maybe<Scalars['felt252']>;
  contractAddress?: Maybe<Scalars['felt252']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  namespace?: Maybe<Scalars['String']>;
  transactionHash?: Maybe<Scalars['felt252']>;
};

export type World__ModelConnection = {
  __typename?: 'World__ModelConnection';
  edges?: Maybe<Array<Maybe<World__ModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__ModelEdge = {
  __typename?: 'World__ModelEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Model>;
};

export type World__ModelOrder = {
  direction: OrderDirection;
  field: World__ModelOrderField;
};

export enum World__ModelOrderField {
  ClassHash = 'CLASS_HASH',
  Name = 'NAME'
}

export type World__Mutation = {
  __typename?: 'World__Mutation';
  publishMessage: World__PublishMessageResponse;
};


export type World__MutationPublishMessageArgs = {
  message: Scalars['String'];
  signature?: InputMaybe<Array<Scalars['String']>>;
  worldAddress: Scalars['String'];
};

export type World__PageInfo = {
  __typename?: 'World__PageInfo';
  endCursor?: Maybe<Scalars['Cursor']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type World__PublishMessageResponse = {
  __typename?: 'World__PublishMessageResponse';
  id: Scalars['String'];
};

export type World__Query = {
  __typename?: 'World__Query';
  controller: World__Controller;
  controllers?: Maybe<World__ControllerConnection>;
  dopewarsBundleGroupModels?: Maybe<Dopewars_BundleGroupConnection>;
  dopewarsBundleIssuanceModels?: Maybe<Dopewars_BundleIssuanceConnection>;
  dopewarsBundleIssuedModels?: Maybe<Dopewars_BundleIssuedConnection>;
  dopewarsBundleModels?: Maybe<Dopewars_BundleConnection>;
  dopewarsBundleReferralModels?: Maybe<Dopewars_BundleReferralConnection>;
  dopewarsBundleRegisteredModels?: Maybe<Dopewars_BundleRegisteredConnection>;
  dopewarsBundleUpdatedModels?: Maybe<Dopewars_BundleUpdatedConnection>;
  dopewarsBundleVoucherModels?: Maybe<Dopewars_BundleVoucherConnection>;
  dopewarsClaimedModels?: Maybe<Dopewars_ClaimedConnection>;
  dopewarsDailyPurchaseModels?: Maybe<Dopewars_DailyPurchaseConnection>;
  dopewarsDopewarsItemTierConfigModels?: Maybe<Dopewars_DopewarsItemTierConfigConnection>;
  dopewarsDopewarsItemTierModels?: Maybe<Dopewars_DopewarsItemTierConnection>;
  dopewarsDrugConfigModels?: Maybe<Dopewars_DrugConfigConnection>;
  dopewarsEncounterStatsConfigModels?: Maybe<Dopewars_EncounterStatsConfigConnection>;
  dopewarsErc20BalanceEventModels?: Maybe<Dopewars_Erc20BalanceEventConnection>;
  dopewarsGameConfigModels?: Maybe<Dopewars_GameConfigConnection>;
  dopewarsGameCreatedModels?: Maybe<Dopewars_GameCreatedConnection>;
  dopewarsGameModels?: Maybe<Dopewars_GameConnection>;
  dopewarsGameOverModels?: Maybe<Dopewars_GameOverConnection>;
  dopewarsGameStorePackedModels?: Maybe<Dopewars_GameStorePackedConnection>;
  dopewarsGearInstanceModels?: Maybe<Dopewars_GearInstanceConnection>;
  dopewarsGearTemplateModels?: Maybe<Dopewars_GearTemplateConnection>;
  dopewarsHighVolatilityModels?: Maybe<Dopewars_HighVolatilityConnection>;
  dopewarsHustlerInstanceModels?: Maybe<Dopewars_HustlerInstanceConnection>;
  dopewarsHustlerTemplateModels?: Maybe<Dopewars_HustlerTemplateConnection>;
  dopewarsLocationConfigModels?: Maybe<Dopewars_LocationConfigConnection>;
  dopewarsMarketConfigModels?: Maybe<Dopewars_MarketConfigConnection>;
  dopewarsNewHighScoreModels?: Maybe<Dopewars_NewHighScoreConnection>;
  dopewarsNewSeasonModels?: Maybe<Dopewars_NewSeasonConnection>;
  dopewarsPaymentConfigModels?: Maybe<Dopewars_PaymentConfigConnection>;
  dopewarsRyoAddressModels?: Maybe<Dopewars_RyoAddressConnection>;
  dopewarsRyoConfigModels?: Maybe<Dopewars_RyoConfigConnection>;
  dopewarsSeasonModels?: Maybe<Dopewars_SeasonConnection>;
  dopewarsSeasonSettingsModels?: Maybe<Dopewars_SeasonSettingsConnection>;
  dopewarsStarterpackModels?: Maybe<Dopewars_StarterpackConnection>;
  dopewarsTradeDrugModels?: Maybe<Dopewars_TradeDrugConnection>;
  dopewarsTravelEncounterModels?: Maybe<Dopewars_TravelEncounterConnection>;
  dopewarsTravelEncounterResultModels?: Maybe<Dopewars_TravelEncounterResultConnection>;
  dopewarsTraveledModels?: Maybe<Dopewars_TraveledConnection>;
  dopewarsTrophyCreationModels?: Maybe<Dopewars_TrophyCreationConnection>;
  dopewarsTrophyProgressionModels?: Maybe<Dopewars_TrophyProgressionConnection>;
  dopewarsUpgradeItemModels?: Maybe<Dopewars_UpgradeItemConnection>;
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  eventMessage: World__EventMessage;
  eventMessages?: Maybe<World__EventMessageConnection>;
  events?: Maybe<World__EventConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  token: Token;
  tokenBalances?: Maybe<Token__BalanceConnection>;
  tokenTransfers?: Maybe<Token__TransferConnection>;
  tokens: TokenConnection;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
};


export type World__QueryControllerArgs = {
  id: Scalars['ID'];
};


export type World__QueryControllersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryDopewarsBundleGroupModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleGroupOrder>;
  where?: InputMaybe<Dopewars_BundleGroupWhereInput>;
};


export type World__QueryDopewarsBundleIssuanceModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleIssuanceOrder>;
  where?: InputMaybe<Dopewars_BundleIssuanceWhereInput>;
};


export type World__QueryDopewarsBundleIssuedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleIssuedOrder>;
  where?: InputMaybe<Dopewars_BundleIssuedWhereInput>;
};


export type World__QueryDopewarsBundleModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleOrder>;
  where?: InputMaybe<Dopewars_BundleWhereInput>;
};


export type World__QueryDopewarsBundleReferralModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleReferralOrder>;
  where?: InputMaybe<Dopewars_BundleReferralWhereInput>;
};


export type World__QueryDopewarsBundleRegisteredModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleRegisteredOrder>;
  where?: InputMaybe<Dopewars_BundleRegisteredWhereInput>;
};


export type World__QueryDopewarsBundleUpdatedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleUpdatedOrder>;
  where?: InputMaybe<Dopewars_BundleUpdatedWhereInput>;
};


export type World__QueryDopewarsBundleVoucherModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_BundleVoucherOrder>;
  where?: InputMaybe<Dopewars_BundleVoucherWhereInput>;
};


export type World__QueryDopewarsClaimedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_ClaimedOrder>;
  where?: InputMaybe<Dopewars_ClaimedWhereInput>;
};


export type World__QueryDopewarsDailyPurchaseModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_DailyPurchaseOrder>;
  where?: InputMaybe<Dopewars_DailyPurchaseWhereInput>;
};


export type World__QueryDopewarsDopewarsItemTierConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_DopewarsItemTierConfigOrder>;
  where?: InputMaybe<Dopewars_DopewarsItemTierConfigWhereInput>;
};


export type World__QueryDopewarsDopewarsItemTierModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_DopewarsItemTierOrder>;
  where?: InputMaybe<Dopewars_DopewarsItemTierWhereInput>;
};


export type World__QueryDopewarsDrugConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_DrugConfigOrder>;
  where?: InputMaybe<Dopewars_DrugConfigWhereInput>;
};


export type World__QueryDopewarsEncounterStatsConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_EncounterStatsConfigOrder>;
  where?: InputMaybe<Dopewars_EncounterStatsConfigWhereInput>;
};


export type World__QueryDopewarsErc20BalanceEventModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_Erc20BalanceEventOrder>;
  where?: InputMaybe<Dopewars_Erc20BalanceEventWhereInput>;
};


export type World__QueryDopewarsGameConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameConfigOrder>;
  where?: InputMaybe<Dopewars_GameConfigWhereInput>;
};


export type World__QueryDopewarsGameCreatedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameCreatedOrder>;
  where?: InputMaybe<Dopewars_GameCreatedWhereInput>;
};


export type World__QueryDopewarsGameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameOrder>;
  where?: InputMaybe<Dopewars_GameWhereInput>;
};


export type World__QueryDopewarsGameOverModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameOverOrder>;
  where?: InputMaybe<Dopewars_GameOverWhereInput>;
};


export type World__QueryDopewarsGameStorePackedModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GameStorePackedOrder>;
  where?: InputMaybe<Dopewars_GameStorePackedWhereInput>;
};


export type World__QueryDopewarsGearInstanceModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GearInstanceOrder>;
  where?: InputMaybe<Dopewars_GearInstanceWhereInput>;
};


export type World__QueryDopewarsGearTemplateModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_GearTemplateOrder>;
  where?: InputMaybe<Dopewars_GearTemplateWhereInput>;
};


export type World__QueryDopewarsHighVolatilityModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_HighVolatilityOrder>;
  where?: InputMaybe<Dopewars_HighVolatilityWhereInput>;
};


export type World__QueryDopewarsHustlerInstanceModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_HustlerInstanceOrder>;
  where?: InputMaybe<Dopewars_HustlerInstanceWhereInput>;
};


export type World__QueryDopewarsHustlerTemplateModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_HustlerTemplateOrder>;
  where?: InputMaybe<Dopewars_HustlerTemplateWhereInput>;
};


export type World__QueryDopewarsLocationConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_LocationConfigOrder>;
  where?: InputMaybe<Dopewars_LocationConfigWhereInput>;
};


export type World__QueryDopewarsMarketConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_MarketConfigOrder>;
  where?: InputMaybe<Dopewars_MarketConfigWhereInput>;
};


export type World__QueryDopewarsNewHighScoreModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_NewHighScoreOrder>;
  where?: InputMaybe<Dopewars_NewHighScoreWhereInput>;
};


export type World__QueryDopewarsNewSeasonModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_NewSeasonOrder>;
  where?: InputMaybe<Dopewars_NewSeasonWhereInput>;
};


export type World__QueryDopewarsPaymentConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_PaymentConfigOrder>;
  where?: InputMaybe<Dopewars_PaymentConfigWhereInput>;
};


export type World__QueryDopewarsRyoAddressModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_RyoAddressOrder>;
  where?: InputMaybe<Dopewars_RyoAddressWhereInput>;
};


export type World__QueryDopewarsRyoConfigModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_RyoConfigOrder>;
  where?: InputMaybe<Dopewars_RyoConfigWhereInput>;
};


export type World__QueryDopewarsSeasonModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_SeasonOrder>;
  where?: InputMaybe<Dopewars_SeasonWhereInput>;
};


export type World__QueryDopewarsSeasonSettingsModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_SeasonSettingsOrder>;
  where?: InputMaybe<Dopewars_SeasonSettingsWhereInput>;
};


export type World__QueryDopewarsStarterpackModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_StarterpackOrder>;
  where?: InputMaybe<Dopewars_StarterpackWhereInput>;
};


export type World__QueryDopewarsTradeDrugModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TradeDrugOrder>;
  where?: InputMaybe<Dopewars_TradeDrugWhereInput>;
};


export type World__QueryDopewarsTravelEncounterModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TravelEncounterOrder>;
  where?: InputMaybe<Dopewars_TravelEncounterWhereInput>;
};


export type World__QueryDopewarsTravelEncounterResultModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TravelEncounterResultOrder>;
  where?: InputMaybe<Dopewars_TravelEncounterResultWhereInput>;
};


export type World__QueryDopewarsTraveledModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TraveledOrder>;
  where?: InputMaybe<Dopewars_TraveledWhereInput>;
};


export type World__QueryDopewarsTrophyCreationModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TrophyCreationOrder>;
  where?: InputMaybe<Dopewars_TrophyCreationWhereInput>;
};


export type World__QueryDopewarsTrophyProgressionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_TrophyProgressionOrder>;
  where?: InputMaybe<Dopewars_TrophyProgressionWhereInput>;
};


export type World__QueryDopewarsUpgradeItemModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Dopewars_UpgradeItemOrder>;
  where?: InputMaybe<Dopewars_UpgradeItemWhereInput>;
};


export type World__QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryEntityArgs = {
  id: Scalars['ID'];
};


export type World__QueryEventMessageArgs = {
  id: Scalars['ID'];
};


export type World__QueryEventMessagesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryMetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryModelArgs = {
  id: Scalars['ID'];
};


export type World__QueryModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<World__ModelOrder>;
};


export type World__QueryTokenArgs = {
  id: Scalars['String'];
};


export type World__QueryTokenBalancesArgs = {
  accountAddress: Scalars['String'];
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryTokenTransfersArgs = {
  accountAddress: Scalars['String'];
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryTokensArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  contractAddress?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type World__QueryTransactionArgs = {
  transactionHash: Scalars['ID'];
};


export type World__QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type World__Social = {
  __typename?: 'World__Social';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type World__Subscription = {
  __typename?: 'World__Subscription';
  entityUpdated: World__Entity;
  eventEmitted: World__Event;
  eventMessageUpdated: World__EventMessage;
  modelRegistered: World__Model;
  tokenBalanceUpdated: Token__Balance;
  tokenUpdated: Token;
  transaction: World__Transaction;
};


export type World__SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type World__SubscriptionEventEmittedArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type World__SubscriptionEventMessageUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type World__SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type World__SubscriptionTokenBalanceUpdatedArgs = {
  accountAddress?: InputMaybe<Scalars['String']>;
};


export type World__SubscriptionTransactionArgs = {
  hasCaller?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['ID']>;
};

export type World__Transaction = {
  __typename?: 'World__Transaction';
  blockNumber?: Maybe<Scalars['Int']>;
  calldata?: Maybe<Array<Maybe<Scalars['felt252']>>>;
  calls?: Maybe<Array<Maybe<World__Call>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  executedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['ID']>;
  maxFee?: Maybe<Scalars['felt252']>;
  nonce?: Maybe<Scalars['felt252']>;
  senderAddress?: Maybe<Scalars['felt252']>;
  signature?: Maybe<Array<Maybe<Scalars['felt252']>>>;
  tokenTransfers?: Maybe<Array<Maybe<Token__Transfer>>>;
  transactionHash?: Maybe<Scalars['felt252']>;
};

export type World__TransactionConnection = {
  __typename?: 'World__TransactionConnection';
  edges?: Maybe<Array<Maybe<World__TransactionEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type World__TransactionEdge = {
  __typename?: 'World__TransactionEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<World__Transaction>;
};

export type Dopewars_Bundle = {
  __typename?: 'dopewars_Bundle';
  allower?: Maybe<Scalars['ContractAddress']>;
  contract?: Maybe<Scalars['ContractAddress']>;
  created_at?: Maybe<Scalars['u64']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  id?: Maybe<Scalars['u32']>;
  metadata?: Maybe<Scalars['ByteArray']>;
  payment_receiver?: Maybe<Scalars['ContractAddress']>;
  payment_token?: Maybe<Scalars['ContractAddress']>;
  price?: Maybe<Scalars['u256']>;
  referral_percentage?: Maybe<Scalars['u8']>;
  reissuable?: Maybe<Scalars['bool']>;
  total_issued?: Maybe<Scalars['u64']>;
};

export type Dopewars_BundleConnection = {
  __typename?: 'dopewars_BundleConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleEdge = {
  __typename?: 'dopewars_BundleEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Bundle>;
};

export type Dopewars_BundleGroup = {
  __typename?: 'dopewars_BundleGroup';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  id?: Maybe<Scalars['felt252']>;
  total_fees?: Maybe<Scalars['felt252']>;
  total_referrals?: Maybe<Scalars['u64']>;
};

export type Dopewars_BundleGroupConnection = {
  __typename?: 'dopewars_BundleGroupConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleGroupEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleGroupEdge = {
  __typename?: 'dopewars_BundleGroupEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleGroup>;
};

export type Dopewars_BundleGroupOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleGroupOrderField;
};

export enum Dopewars_BundleGroupOrderField {
  Id = 'ID',
  TotalFees = 'TOTAL_FEES',
  TotalReferrals = 'TOTAL_REFERRALS'
}

export type Dopewars_BundleGroupWhereInput = {
  id?: InputMaybe<Scalars['felt252']>;
  idEQ?: InputMaybe<Scalars['felt252']>;
  idGT?: InputMaybe<Scalars['felt252']>;
  idGTE?: InputMaybe<Scalars['felt252']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  idLIKE?: InputMaybe<Scalars['felt252']>;
  idLT?: InputMaybe<Scalars['felt252']>;
  idLTE?: InputMaybe<Scalars['felt252']>;
  idNEQ?: InputMaybe<Scalars['felt252']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  idNOTLIKE?: InputMaybe<Scalars['felt252']>;
  total_fees?: InputMaybe<Scalars['felt252']>;
  total_feesEQ?: InputMaybe<Scalars['felt252']>;
  total_feesGT?: InputMaybe<Scalars['felt252']>;
  total_feesGTE?: InputMaybe<Scalars['felt252']>;
  total_feesIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  total_feesLIKE?: InputMaybe<Scalars['felt252']>;
  total_feesLT?: InputMaybe<Scalars['felt252']>;
  total_feesLTE?: InputMaybe<Scalars['felt252']>;
  total_feesNEQ?: InputMaybe<Scalars['felt252']>;
  total_feesNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  total_feesNOTLIKE?: InputMaybe<Scalars['felt252']>;
  total_referrals?: InputMaybe<Scalars['u64']>;
  total_referralsEQ?: InputMaybe<Scalars['u64']>;
  total_referralsGT?: InputMaybe<Scalars['u64']>;
  total_referralsGTE?: InputMaybe<Scalars['u64']>;
  total_referralsIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  total_referralsLIKE?: InputMaybe<Scalars['u64']>;
  total_referralsLT?: InputMaybe<Scalars['u64']>;
  total_referralsLTE?: InputMaybe<Scalars['u64']>;
  total_referralsNEQ?: InputMaybe<Scalars['u64']>;
  total_referralsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  total_referralsNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_BundleIssuance = {
  __typename?: 'dopewars_BundleIssuance';
  bundle_id?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  issued_at?: Maybe<Scalars['u64']>;
  recipient?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_BundleIssuanceConnection = {
  __typename?: 'dopewars_BundleIssuanceConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleIssuanceEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleIssuanceEdge = {
  __typename?: 'dopewars_BundleIssuanceEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleIssuance>;
};

export type Dopewars_BundleIssuanceOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleIssuanceOrderField;
};

export enum Dopewars_BundleIssuanceOrderField {
  BundleId = 'BUNDLE_ID',
  IssuedAt = 'ISSUED_AT',
  Recipient = 'RECIPIENT'
}

export type Dopewars_BundleIssuanceWhereInput = {
  bundle_id?: InputMaybe<Scalars['u32']>;
  bundle_idEQ?: InputMaybe<Scalars['u32']>;
  bundle_idGT?: InputMaybe<Scalars['u32']>;
  bundle_idGTE?: InputMaybe<Scalars['u32']>;
  bundle_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idLIKE?: InputMaybe<Scalars['u32']>;
  bundle_idLT?: InputMaybe<Scalars['u32']>;
  bundle_idLTE?: InputMaybe<Scalars['u32']>;
  bundle_idNEQ?: InputMaybe<Scalars['u32']>;
  bundle_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  issued_at?: InputMaybe<Scalars['u64']>;
  issued_atEQ?: InputMaybe<Scalars['u64']>;
  issued_atGT?: InputMaybe<Scalars['u64']>;
  issued_atGTE?: InputMaybe<Scalars['u64']>;
  issued_atIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  issued_atLIKE?: InputMaybe<Scalars['u64']>;
  issued_atLT?: InputMaybe<Scalars['u64']>;
  issued_atLTE?: InputMaybe<Scalars['u64']>;
  issued_atNEQ?: InputMaybe<Scalars['u64']>;
  issued_atNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  issued_atNOTLIKE?: InputMaybe<Scalars['u64']>;
  recipient?: InputMaybe<Scalars['ContractAddress']>;
  recipientEQ?: InputMaybe<Scalars['ContractAddress']>;
  recipientGT?: InputMaybe<Scalars['ContractAddress']>;
  recipientGTE?: InputMaybe<Scalars['ContractAddress']>;
  recipientIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  recipientLIKE?: InputMaybe<Scalars['ContractAddress']>;
  recipientLT?: InputMaybe<Scalars['ContractAddress']>;
  recipientLTE?: InputMaybe<Scalars['ContractAddress']>;
  recipientNEQ?: InputMaybe<Scalars['ContractAddress']>;
  recipientNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  recipientNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_BundleIssued = {
  __typename?: 'dopewars_BundleIssued';
  amount?: Maybe<Scalars['u256']>;
  bundle_id?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  payment_token?: Maybe<Scalars['ContractAddress']>;
  quantity?: Maybe<Scalars['u32']>;
  recipient?: Maybe<Scalars['ContractAddress']>;
  referrer?: Maybe<Dopewars_OptionContractAddress>;
  referrer_group?: Maybe<Dopewars_Optionfelt252>;
  time?: Maybe<Scalars['u64']>;
};

export type Dopewars_BundleIssuedConnection = {
  __typename?: 'dopewars_BundleIssuedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleIssuedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleIssuedEdge = {
  __typename?: 'dopewars_BundleIssuedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleIssued>;
};

export type Dopewars_BundleIssuedOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleIssuedOrderField;
};

export enum Dopewars_BundleIssuedOrderField {
  Amount = 'AMOUNT',
  BundleId = 'BUNDLE_ID',
  PaymentToken = 'PAYMENT_TOKEN',
  Quantity = 'QUANTITY',
  Recipient = 'RECIPIENT',
  Referrer = 'REFERRER',
  ReferrerGroup = 'REFERRER_GROUP',
  Time = 'TIME'
}

export type Dopewars_BundleIssuedWhereInput = {
  amount?: InputMaybe<Scalars['u256']>;
  amountEQ?: InputMaybe<Scalars['u256']>;
  amountGT?: InputMaybe<Scalars['u256']>;
  amountGTE?: InputMaybe<Scalars['u256']>;
  amountIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  amountLIKE?: InputMaybe<Scalars['u256']>;
  amountLT?: InputMaybe<Scalars['u256']>;
  amountLTE?: InputMaybe<Scalars['u256']>;
  amountNEQ?: InputMaybe<Scalars['u256']>;
  amountNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  amountNOTLIKE?: InputMaybe<Scalars['u256']>;
  bundle_id?: InputMaybe<Scalars['u32']>;
  bundle_idEQ?: InputMaybe<Scalars['u32']>;
  bundle_idGT?: InputMaybe<Scalars['u32']>;
  bundle_idGTE?: InputMaybe<Scalars['u32']>;
  bundle_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idLIKE?: InputMaybe<Scalars['u32']>;
  bundle_idLT?: InputMaybe<Scalars['u32']>;
  bundle_idLTE?: InputMaybe<Scalars['u32']>;
  bundle_idNEQ?: InputMaybe<Scalars['u32']>;
  bundle_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  payment_token?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_tokenLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_tokenNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  quantity?: InputMaybe<Scalars['u32']>;
  quantityEQ?: InputMaybe<Scalars['u32']>;
  quantityGT?: InputMaybe<Scalars['u32']>;
  quantityGTE?: InputMaybe<Scalars['u32']>;
  quantityIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  quantityLIKE?: InputMaybe<Scalars['u32']>;
  quantityLT?: InputMaybe<Scalars['u32']>;
  quantityLTE?: InputMaybe<Scalars['u32']>;
  quantityNEQ?: InputMaybe<Scalars['u32']>;
  quantityNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  quantityNOTLIKE?: InputMaybe<Scalars['u32']>;
  recipient?: InputMaybe<Scalars['ContractAddress']>;
  recipientEQ?: InputMaybe<Scalars['ContractAddress']>;
  recipientGT?: InputMaybe<Scalars['ContractAddress']>;
  recipientGTE?: InputMaybe<Scalars['ContractAddress']>;
  recipientIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  recipientLIKE?: InputMaybe<Scalars['ContractAddress']>;
  recipientLT?: InputMaybe<Scalars['ContractAddress']>;
  recipientLTE?: InputMaybe<Scalars['ContractAddress']>;
  recipientNEQ?: InputMaybe<Scalars['ContractAddress']>;
  recipientNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  recipientNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  referrer?: InputMaybe<Dopewars_BundleIssued_ReferrerWhereInput>;
  referrer_group?: InputMaybe<Dopewars_BundleIssued_Referrer_GroupWhereInput>;
  time?: InputMaybe<Scalars['u64']>;
  timeEQ?: InputMaybe<Scalars['u64']>;
  timeGT?: InputMaybe<Scalars['u64']>;
  timeGTE?: InputMaybe<Scalars['u64']>;
  timeIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeLIKE?: InputMaybe<Scalars['u64']>;
  timeLT?: InputMaybe<Scalars['u64']>;
  timeLTE?: InputMaybe<Scalars['u64']>;
  timeNEQ?: InputMaybe<Scalars['u64']>;
  timeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_BundleIssued_ReferrerWhereInput = {
  Some?: InputMaybe<Scalars['ContractAddress']>;
  SomeEQ?: InputMaybe<Scalars['ContractAddress']>;
  SomeGT?: InputMaybe<Scalars['ContractAddress']>;
  SomeGTE?: InputMaybe<Scalars['ContractAddress']>;
  SomeIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  SomeLIKE?: InputMaybe<Scalars['ContractAddress']>;
  SomeLT?: InputMaybe<Scalars['ContractAddress']>;
  SomeLTE?: InputMaybe<Scalars['ContractAddress']>;
  SomeNEQ?: InputMaybe<Scalars['ContractAddress']>;
  SomeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  SomeNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  option?: InputMaybe<Scalars['Enum']>;
};

export type Dopewars_BundleIssued_Referrer_GroupWhereInput = {
  Some?: InputMaybe<Scalars['felt252']>;
  SomeEQ?: InputMaybe<Scalars['felt252']>;
  SomeGT?: InputMaybe<Scalars['felt252']>;
  SomeGTE?: InputMaybe<Scalars['felt252']>;
  SomeIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  SomeLIKE?: InputMaybe<Scalars['felt252']>;
  SomeLT?: InputMaybe<Scalars['felt252']>;
  SomeLTE?: InputMaybe<Scalars['felt252']>;
  SomeNEQ?: InputMaybe<Scalars['felt252']>;
  SomeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  SomeNOTLIKE?: InputMaybe<Scalars['felt252']>;
  option?: InputMaybe<Scalars['Enum']>;
};

export type Dopewars_BundleOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleOrderField;
};

export enum Dopewars_BundleOrderField {
  Allower = 'ALLOWER',
  Contract = 'CONTRACT',
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Metadata = 'METADATA',
  PaymentReceiver = 'PAYMENT_RECEIVER',
  PaymentToken = 'PAYMENT_TOKEN',
  Price = 'PRICE',
  ReferralPercentage = 'REFERRAL_PERCENTAGE',
  Reissuable = 'REISSUABLE',
  TotalIssued = 'TOTAL_ISSUED'
}

export type Dopewars_BundleReferral = {
  __typename?: 'dopewars_BundleReferral';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  id?: Maybe<Scalars['ContractAddress']>;
  total_fees?: Maybe<Scalars['felt252']>;
  total_referrals?: Maybe<Scalars['u64']>;
};

export type Dopewars_BundleReferralConnection = {
  __typename?: 'dopewars_BundleReferralConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleReferralEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleReferralEdge = {
  __typename?: 'dopewars_BundleReferralEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleReferral>;
};

export type Dopewars_BundleReferralOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleReferralOrderField;
};

export enum Dopewars_BundleReferralOrderField {
  Id = 'ID',
  TotalFees = 'TOTAL_FEES',
  TotalReferrals = 'TOTAL_REFERRALS'
}

export type Dopewars_BundleReferralWhereInput = {
  id?: InputMaybe<Scalars['ContractAddress']>;
  idEQ?: InputMaybe<Scalars['ContractAddress']>;
  idGT?: InputMaybe<Scalars['ContractAddress']>;
  idGTE?: InputMaybe<Scalars['ContractAddress']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  idLT?: InputMaybe<Scalars['ContractAddress']>;
  idLTE?: InputMaybe<Scalars['ContractAddress']>;
  idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  total_fees?: InputMaybe<Scalars['felt252']>;
  total_feesEQ?: InputMaybe<Scalars['felt252']>;
  total_feesGT?: InputMaybe<Scalars['felt252']>;
  total_feesGTE?: InputMaybe<Scalars['felt252']>;
  total_feesIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  total_feesLIKE?: InputMaybe<Scalars['felt252']>;
  total_feesLT?: InputMaybe<Scalars['felt252']>;
  total_feesLTE?: InputMaybe<Scalars['felt252']>;
  total_feesNEQ?: InputMaybe<Scalars['felt252']>;
  total_feesNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  total_feesNOTLIKE?: InputMaybe<Scalars['felt252']>;
  total_referrals?: InputMaybe<Scalars['u64']>;
  total_referralsEQ?: InputMaybe<Scalars['u64']>;
  total_referralsGT?: InputMaybe<Scalars['u64']>;
  total_referralsGTE?: InputMaybe<Scalars['u64']>;
  total_referralsIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  total_referralsLIKE?: InputMaybe<Scalars['u64']>;
  total_referralsLT?: InputMaybe<Scalars['u64']>;
  total_referralsLTE?: InputMaybe<Scalars['u64']>;
  total_referralsNEQ?: InputMaybe<Scalars['u64']>;
  total_referralsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  total_referralsNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_BundleRegistered = {
  __typename?: 'dopewars_BundleRegistered';
  bundle_id?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  payment_receiver?: Maybe<Scalars['ContractAddress']>;
  referral_percentage?: Maybe<Scalars['u8']>;
  reissuable?: Maybe<Scalars['bool']>;
  time?: Maybe<Scalars['u64']>;
};

export type Dopewars_BundleRegisteredConnection = {
  __typename?: 'dopewars_BundleRegisteredConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleRegisteredEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleRegisteredEdge = {
  __typename?: 'dopewars_BundleRegisteredEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleRegistered>;
};

export type Dopewars_BundleRegisteredOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleRegisteredOrderField;
};

export enum Dopewars_BundleRegisteredOrderField {
  BundleId = 'BUNDLE_ID',
  PaymentReceiver = 'PAYMENT_RECEIVER',
  ReferralPercentage = 'REFERRAL_PERCENTAGE',
  Reissuable = 'REISSUABLE',
  Time = 'TIME'
}

export type Dopewars_BundleRegisteredWhereInput = {
  bundle_id?: InputMaybe<Scalars['u32']>;
  bundle_idEQ?: InputMaybe<Scalars['u32']>;
  bundle_idGT?: InputMaybe<Scalars['u32']>;
  bundle_idGTE?: InputMaybe<Scalars['u32']>;
  bundle_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idLIKE?: InputMaybe<Scalars['u32']>;
  bundle_idLT?: InputMaybe<Scalars['u32']>;
  bundle_idLTE?: InputMaybe<Scalars['u32']>;
  bundle_idNEQ?: InputMaybe<Scalars['u32']>;
  bundle_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  payment_receiver?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverGT?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverGTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_receiverLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverLT?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverLTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverNEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_receiverNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  referral_percentage?: InputMaybe<Scalars['u8']>;
  referral_percentageEQ?: InputMaybe<Scalars['u8']>;
  referral_percentageGT?: InputMaybe<Scalars['u8']>;
  referral_percentageGTE?: InputMaybe<Scalars['u8']>;
  referral_percentageIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  referral_percentageLIKE?: InputMaybe<Scalars['u8']>;
  referral_percentageLT?: InputMaybe<Scalars['u8']>;
  referral_percentageLTE?: InputMaybe<Scalars['u8']>;
  referral_percentageNEQ?: InputMaybe<Scalars['u8']>;
  referral_percentageNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  referral_percentageNOTLIKE?: InputMaybe<Scalars['u8']>;
  reissuable?: InputMaybe<Scalars['bool']>;
  time?: InputMaybe<Scalars['u64']>;
  timeEQ?: InputMaybe<Scalars['u64']>;
  timeGT?: InputMaybe<Scalars['u64']>;
  timeGTE?: InputMaybe<Scalars['u64']>;
  timeIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeLIKE?: InputMaybe<Scalars['u64']>;
  timeLT?: InputMaybe<Scalars['u64']>;
  timeLTE?: InputMaybe<Scalars['u64']>;
  timeNEQ?: InputMaybe<Scalars['u64']>;
  timeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_BundleUpdated = {
  __typename?: 'dopewars_BundleUpdated';
  bundle_id?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  metadata?: Maybe<Scalars['ByteArray']>;
  payment_receiver?: Maybe<Scalars['ContractAddress']>;
  payment_token?: Maybe<Scalars['ContractAddress']>;
  price?: Maybe<Scalars['u256']>;
  referral_percentage?: Maybe<Scalars['u8']>;
  reissuable?: Maybe<Scalars['bool']>;
  time?: Maybe<Scalars['u64']>;
};

export type Dopewars_BundleUpdatedConnection = {
  __typename?: 'dopewars_BundleUpdatedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleUpdatedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleUpdatedEdge = {
  __typename?: 'dopewars_BundleUpdatedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleUpdated>;
};

export type Dopewars_BundleUpdatedOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleUpdatedOrderField;
};

export enum Dopewars_BundleUpdatedOrderField {
  BundleId = 'BUNDLE_ID',
  Metadata = 'METADATA',
  PaymentReceiver = 'PAYMENT_RECEIVER',
  PaymentToken = 'PAYMENT_TOKEN',
  Price = 'PRICE',
  ReferralPercentage = 'REFERRAL_PERCENTAGE',
  Reissuable = 'REISSUABLE',
  Time = 'TIME'
}

export type Dopewars_BundleUpdatedWhereInput = {
  bundle_id?: InputMaybe<Scalars['u32']>;
  bundle_idEQ?: InputMaybe<Scalars['u32']>;
  bundle_idGT?: InputMaybe<Scalars['u32']>;
  bundle_idGTE?: InputMaybe<Scalars['u32']>;
  bundle_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idLIKE?: InputMaybe<Scalars['u32']>;
  bundle_idLT?: InputMaybe<Scalars['u32']>;
  bundle_idLTE?: InputMaybe<Scalars['u32']>;
  bundle_idNEQ?: InputMaybe<Scalars['u32']>;
  bundle_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  metadata?: InputMaybe<Scalars['ByteArray']>;
  metadataEQ?: InputMaybe<Scalars['ByteArray']>;
  metadataGT?: InputMaybe<Scalars['ByteArray']>;
  metadataGTE?: InputMaybe<Scalars['ByteArray']>;
  metadataIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  metadataLIKE?: InputMaybe<Scalars['ByteArray']>;
  metadataLT?: InputMaybe<Scalars['ByteArray']>;
  metadataLTE?: InputMaybe<Scalars['ByteArray']>;
  metadataNEQ?: InputMaybe<Scalars['ByteArray']>;
  metadataNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  metadataNOTLIKE?: InputMaybe<Scalars['ByteArray']>;
  payment_receiver?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverGT?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverGTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_receiverLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverLT?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverLTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverNEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_receiverNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_token?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_tokenLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_tokenNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  price?: InputMaybe<Scalars['u256']>;
  priceEQ?: InputMaybe<Scalars['u256']>;
  priceGT?: InputMaybe<Scalars['u256']>;
  priceGTE?: InputMaybe<Scalars['u256']>;
  priceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  priceLIKE?: InputMaybe<Scalars['u256']>;
  priceLT?: InputMaybe<Scalars['u256']>;
  priceLTE?: InputMaybe<Scalars['u256']>;
  priceNEQ?: InputMaybe<Scalars['u256']>;
  priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  priceNOTLIKE?: InputMaybe<Scalars['u256']>;
  referral_percentage?: InputMaybe<Scalars['u8']>;
  referral_percentageEQ?: InputMaybe<Scalars['u8']>;
  referral_percentageGT?: InputMaybe<Scalars['u8']>;
  referral_percentageGTE?: InputMaybe<Scalars['u8']>;
  referral_percentageIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  referral_percentageLIKE?: InputMaybe<Scalars['u8']>;
  referral_percentageLT?: InputMaybe<Scalars['u8']>;
  referral_percentageLTE?: InputMaybe<Scalars['u8']>;
  referral_percentageNEQ?: InputMaybe<Scalars['u8']>;
  referral_percentageNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  referral_percentageNOTLIKE?: InputMaybe<Scalars['u8']>;
  reissuable?: InputMaybe<Scalars['bool']>;
  time?: InputMaybe<Scalars['u64']>;
  timeEQ?: InputMaybe<Scalars['u64']>;
  timeGT?: InputMaybe<Scalars['u64']>;
  timeGTE?: InputMaybe<Scalars['u64']>;
  timeIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeLIKE?: InputMaybe<Scalars['u64']>;
  timeLT?: InputMaybe<Scalars['u64']>;
  timeLTE?: InputMaybe<Scalars['u64']>;
  timeNEQ?: InputMaybe<Scalars['u64']>;
  timeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_BundleVoucher = {
  __typename?: 'dopewars_BundleVoucher';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['felt252']>;
  recipient?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_BundleVoucherConnection = {
  __typename?: 'dopewars_BundleVoucherConnection';
  edges?: Maybe<Array<Maybe<Dopewars_BundleVoucherEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_BundleVoucherEdge = {
  __typename?: 'dopewars_BundleVoucherEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_BundleVoucher>;
};

export type Dopewars_BundleVoucherOrder = {
  direction: OrderDirection;
  field: Dopewars_BundleVoucherOrderField;
};

export enum Dopewars_BundleVoucherOrderField {
  Key = 'KEY',
  Recipient = 'RECIPIENT'
}

export type Dopewars_BundleVoucherWhereInput = {
  key?: InputMaybe<Scalars['felt252']>;
  keyEQ?: InputMaybe<Scalars['felt252']>;
  keyGT?: InputMaybe<Scalars['felt252']>;
  keyGTE?: InputMaybe<Scalars['felt252']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  keyLIKE?: InputMaybe<Scalars['felt252']>;
  keyLT?: InputMaybe<Scalars['felt252']>;
  keyLTE?: InputMaybe<Scalars['felt252']>;
  keyNEQ?: InputMaybe<Scalars['felt252']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['felt252']>;
  recipient?: InputMaybe<Scalars['ContractAddress']>;
  recipientEQ?: InputMaybe<Scalars['ContractAddress']>;
  recipientGT?: InputMaybe<Scalars['ContractAddress']>;
  recipientGTE?: InputMaybe<Scalars['ContractAddress']>;
  recipientIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  recipientLIKE?: InputMaybe<Scalars['ContractAddress']>;
  recipientLT?: InputMaybe<Scalars['ContractAddress']>;
  recipientLTE?: InputMaybe<Scalars['ContractAddress']>;
  recipientNEQ?: InputMaybe<Scalars['ContractAddress']>;
  recipientNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  recipientNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_BundleWhereInput = {
  allower?: InputMaybe<Scalars['ContractAddress']>;
  allowerEQ?: InputMaybe<Scalars['ContractAddress']>;
  allowerGT?: InputMaybe<Scalars['ContractAddress']>;
  allowerGTE?: InputMaybe<Scalars['ContractAddress']>;
  allowerIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  allowerLIKE?: InputMaybe<Scalars['ContractAddress']>;
  allowerLT?: InputMaybe<Scalars['ContractAddress']>;
  allowerLTE?: InputMaybe<Scalars['ContractAddress']>;
  allowerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  allowerNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  allowerNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  contract?: InputMaybe<Scalars['ContractAddress']>;
  contractEQ?: InputMaybe<Scalars['ContractAddress']>;
  contractGT?: InputMaybe<Scalars['ContractAddress']>;
  contractGTE?: InputMaybe<Scalars['ContractAddress']>;
  contractIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  contractLIKE?: InputMaybe<Scalars['ContractAddress']>;
  contractLT?: InputMaybe<Scalars['ContractAddress']>;
  contractLTE?: InputMaybe<Scalars['ContractAddress']>;
  contractNEQ?: InputMaybe<Scalars['ContractAddress']>;
  contractNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  contractNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  created_at?: InputMaybe<Scalars['u64']>;
  created_atEQ?: InputMaybe<Scalars['u64']>;
  created_atGT?: InputMaybe<Scalars['u64']>;
  created_atGTE?: InputMaybe<Scalars['u64']>;
  created_atIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  created_atLIKE?: InputMaybe<Scalars['u64']>;
  created_atLT?: InputMaybe<Scalars['u64']>;
  created_atLTE?: InputMaybe<Scalars['u64']>;
  created_atNEQ?: InputMaybe<Scalars['u64']>;
  created_atNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  created_atNOTLIKE?: InputMaybe<Scalars['u64']>;
  id?: InputMaybe<Scalars['u32']>;
  idEQ?: InputMaybe<Scalars['u32']>;
  idGT?: InputMaybe<Scalars['u32']>;
  idGTE?: InputMaybe<Scalars['u32']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  idLIKE?: InputMaybe<Scalars['u32']>;
  idLT?: InputMaybe<Scalars['u32']>;
  idLTE?: InputMaybe<Scalars['u32']>;
  idNEQ?: InputMaybe<Scalars['u32']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  idNOTLIKE?: InputMaybe<Scalars['u32']>;
  metadata?: InputMaybe<Scalars['ByteArray']>;
  metadataEQ?: InputMaybe<Scalars['ByteArray']>;
  metadataGT?: InputMaybe<Scalars['ByteArray']>;
  metadataGTE?: InputMaybe<Scalars['ByteArray']>;
  metadataIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  metadataLIKE?: InputMaybe<Scalars['ByteArray']>;
  metadataLT?: InputMaybe<Scalars['ByteArray']>;
  metadataLTE?: InputMaybe<Scalars['ByteArray']>;
  metadataNEQ?: InputMaybe<Scalars['ByteArray']>;
  metadataNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  metadataNOTLIKE?: InputMaybe<Scalars['ByteArray']>;
  payment_receiver?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverGT?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverGTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_receiverLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverLT?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverLTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverNEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_receiverNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_receiverNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_token?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenGT?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenGTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_tokenLIKE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenLT?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenLTE?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenNEQ?: InputMaybe<Scalars['ContractAddress']>;
  payment_tokenNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  payment_tokenNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  price?: InputMaybe<Scalars['u256']>;
  priceEQ?: InputMaybe<Scalars['u256']>;
  priceGT?: InputMaybe<Scalars['u256']>;
  priceGTE?: InputMaybe<Scalars['u256']>;
  priceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  priceLIKE?: InputMaybe<Scalars['u256']>;
  priceLT?: InputMaybe<Scalars['u256']>;
  priceLTE?: InputMaybe<Scalars['u256']>;
  priceNEQ?: InputMaybe<Scalars['u256']>;
  priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  priceNOTLIKE?: InputMaybe<Scalars['u256']>;
  referral_percentage?: InputMaybe<Scalars['u8']>;
  referral_percentageEQ?: InputMaybe<Scalars['u8']>;
  referral_percentageGT?: InputMaybe<Scalars['u8']>;
  referral_percentageGTE?: InputMaybe<Scalars['u8']>;
  referral_percentageIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  referral_percentageLIKE?: InputMaybe<Scalars['u8']>;
  referral_percentageLT?: InputMaybe<Scalars['u8']>;
  referral_percentageLTE?: InputMaybe<Scalars['u8']>;
  referral_percentageNEQ?: InputMaybe<Scalars['u8']>;
  referral_percentageNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  referral_percentageNOTLIKE?: InputMaybe<Scalars['u8']>;
  reissuable?: InputMaybe<Scalars['bool']>;
  total_issued?: InputMaybe<Scalars['u64']>;
  total_issuedEQ?: InputMaybe<Scalars['u64']>;
  total_issuedGT?: InputMaybe<Scalars['u64']>;
  total_issuedGTE?: InputMaybe<Scalars['u64']>;
  total_issuedIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  total_issuedLIKE?: InputMaybe<Scalars['u64']>;
  total_issuedLT?: InputMaybe<Scalars['u64']>;
  total_issuedLTE?: InputMaybe<Scalars['u64']>;
  total_issuedNEQ?: InputMaybe<Scalars['u64']>;
  total_issuedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  total_issuedNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_Bytes16 = {
  __typename?: 'dopewars_Bytes16';
  value?: Maybe<Scalars['u128']>;
};

export type Dopewars_Claimed = {
  __typename?: 'dopewars_Claimed';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  paper?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  rank?: Maybe<Scalars['u16']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_ClaimedConnection = {
  __typename?: 'dopewars_ClaimedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_ClaimedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_ClaimedEdge = {
  __typename?: 'dopewars_ClaimedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Claimed>;
};

export type Dopewars_ClaimedOrder = {
  direction: OrderDirection;
  field: Dopewars_ClaimedOrderField;
};

export enum Dopewars_ClaimedOrderField {
  GameId = 'GAME_ID',
  Paper = 'PAPER',
  PlayerId = 'PLAYER_ID',
  Rank = 'RANK',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_ClaimedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  paper?: InputMaybe<Scalars['u32']>;
  paperEQ?: InputMaybe<Scalars['u32']>;
  paperGT?: InputMaybe<Scalars['u32']>;
  paperGTE?: InputMaybe<Scalars['u32']>;
  paperIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  paperLIKE?: InputMaybe<Scalars['u32']>;
  paperLT?: InputMaybe<Scalars['u32']>;
  paperLTE?: InputMaybe<Scalars['u32']>;
  paperNEQ?: InputMaybe<Scalars['u32']>;
  paperNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  paperNOTLIKE?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  rank?: InputMaybe<Scalars['u16']>;
  rankEQ?: InputMaybe<Scalars['u16']>;
  rankGT?: InputMaybe<Scalars['u16']>;
  rankGTE?: InputMaybe<Scalars['u16']>;
  rankIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  rankLIKE?: InputMaybe<Scalars['u16']>;
  rankLT?: InputMaybe<Scalars['u16']>;
  rankLTE?: InputMaybe<Scalars['u16']>;
  rankNEQ?: InputMaybe<Scalars['u16']>;
  rankNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  rankNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_DailyPurchase = {
  __typename?: 'dopewars_DailyPurchase';
  day?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  gear_instance_id?: Maybe<Scalars['u32']>;
  player?: Maybe<Scalars['ContractAddress']>;
  purchased?: Maybe<Scalars['bool']>;
  slot?: Maybe<Scalars['u8']>;
};

export type Dopewars_DailyPurchaseConnection = {
  __typename?: 'dopewars_DailyPurchaseConnection';
  edges?: Maybe<Array<Maybe<Dopewars_DailyPurchaseEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_DailyPurchaseEdge = {
  __typename?: 'dopewars_DailyPurchaseEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_DailyPurchase>;
};

export type Dopewars_DailyPurchaseOrder = {
  direction: OrderDirection;
  field: Dopewars_DailyPurchaseOrderField;
};

export enum Dopewars_DailyPurchaseOrderField {
  Day = 'DAY',
  GearInstanceId = 'GEAR_INSTANCE_ID',
  Player = 'PLAYER',
  Purchased = 'PURCHASED',
  Slot = 'SLOT'
}

export type Dopewars_DailyPurchaseWhereInput = {
  day?: InputMaybe<Scalars['u32']>;
  dayEQ?: InputMaybe<Scalars['u32']>;
  dayGT?: InputMaybe<Scalars['u32']>;
  dayGTE?: InputMaybe<Scalars['u32']>;
  dayIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  dayLIKE?: InputMaybe<Scalars['u32']>;
  dayLT?: InputMaybe<Scalars['u32']>;
  dayLTE?: InputMaybe<Scalars['u32']>;
  dayNEQ?: InputMaybe<Scalars['u32']>;
  dayNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  dayNOTLIKE?: InputMaybe<Scalars['u32']>;
  gear_instance_id?: InputMaybe<Scalars['u32']>;
  gear_instance_idEQ?: InputMaybe<Scalars['u32']>;
  gear_instance_idGT?: InputMaybe<Scalars['u32']>;
  gear_instance_idGTE?: InputMaybe<Scalars['u32']>;
  gear_instance_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  gear_instance_idLIKE?: InputMaybe<Scalars['u32']>;
  gear_instance_idLT?: InputMaybe<Scalars['u32']>;
  gear_instance_idLTE?: InputMaybe<Scalars['u32']>;
  gear_instance_idNEQ?: InputMaybe<Scalars['u32']>;
  gear_instance_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  gear_instance_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  player?: InputMaybe<Scalars['ContractAddress']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']>;
  playerIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  playerLIKE?: InputMaybe<Scalars['ContractAddress']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  playerNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  playerNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  purchased?: InputMaybe<Scalars['bool']>;
  slot?: InputMaybe<Scalars['u8']>;
  slotEQ?: InputMaybe<Scalars['u8']>;
  slotGT?: InputMaybe<Scalars['u8']>;
  slotGTE?: InputMaybe<Scalars['u8']>;
  slotIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slotLIKE?: InputMaybe<Scalars['u8']>;
  slotLT?: InputMaybe<Scalars['u8']>;
  slotLTE?: InputMaybe<Scalars['u8']>;
  slotNEQ?: InputMaybe<Scalars['u8']>;
  slotNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slotNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_DopewarsItemTier = {
  __typename?: 'dopewars_DopewarsItemTier';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  item_id?: Maybe<Scalars['u8']>;
  slot_id?: Maybe<Scalars['u8']>;
  tier?: Maybe<Scalars['u8']>;
};

export type Dopewars_DopewarsItemTierConfig = {
  __typename?: 'dopewars_DopewarsItemTierConfig';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  levels?: Maybe<Array<Maybe<Dopewars_ItemTierConfig>>>;
  slot_id?: Maybe<Scalars['u8']>;
  tier?: Maybe<Scalars['u8']>;
};

export type Dopewars_DopewarsItemTierConfigConnection = {
  __typename?: 'dopewars_DopewarsItemTierConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_DopewarsItemTierConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_DopewarsItemTierConfigEdge = {
  __typename?: 'dopewars_DopewarsItemTierConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_DopewarsItemTierConfig>;
};

export type Dopewars_DopewarsItemTierConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_DopewarsItemTierConfigOrderField;
};

export enum Dopewars_DopewarsItemTierConfigOrderField {
  Levels = 'LEVELS',
  SlotId = 'SLOT_ID',
  Tier = 'TIER'
}

export type Dopewars_DopewarsItemTierConfigWhereInput = {
  slot_id?: InputMaybe<Scalars['u8']>;
  slot_idEQ?: InputMaybe<Scalars['u8']>;
  slot_idGT?: InputMaybe<Scalars['u8']>;
  slot_idGTE?: InputMaybe<Scalars['u8']>;
  slot_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idLIKE?: InputMaybe<Scalars['u8']>;
  slot_idLT?: InputMaybe<Scalars['u8']>;
  slot_idLTE?: InputMaybe<Scalars['u8']>;
  slot_idNEQ?: InputMaybe<Scalars['u8']>;
  slot_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  tier?: InputMaybe<Scalars['u8']>;
  tierEQ?: InputMaybe<Scalars['u8']>;
  tierGT?: InputMaybe<Scalars['u8']>;
  tierGTE?: InputMaybe<Scalars['u8']>;
  tierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierLIKE?: InputMaybe<Scalars['u8']>;
  tierLT?: InputMaybe<Scalars['u8']>;
  tierLTE?: InputMaybe<Scalars['u8']>;
  tierNEQ?: InputMaybe<Scalars['u8']>;
  tierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_DopewarsItemTierConnection = {
  __typename?: 'dopewars_DopewarsItemTierConnection';
  edges?: Maybe<Array<Maybe<Dopewars_DopewarsItemTierEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_DopewarsItemTierEdge = {
  __typename?: 'dopewars_DopewarsItemTierEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_DopewarsItemTier>;
};

export type Dopewars_DopewarsItemTierOrder = {
  direction: OrderDirection;
  field: Dopewars_DopewarsItemTierOrderField;
};

export enum Dopewars_DopewarsItemTierOrderField {
  ItemId = 'ITEM_ID',
  SlotId = 'SLOT_ID',
  Tier = 'TIER'
}

export type Dopewars_DopewarsItemTierWhereInput = {
  item_id?: InputMaybe<Scalars['u8']>;
  item_idEQ?: InputMaybe<Scalars['u8']>;
  item_idGT?: InputMaybe<Scalars['u8']>;
  item_idGTE?: InputMaybe<Scalars['u8']>;
  item_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_idLIKE?: InputMaybe<Scalars['u8']>;
  item_idLT?: InputMaybe<Scalars['u8']>;
  item_idLTE?: InputMaybe<Scalars['u8']>;
  item_idNEQ?: InputMaybe<Scalars['u8']>;
  item_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  slot_id?: InputMaybe<Scalars['u8']>;
  slot_idEQ?: InputMaybe<Scalars['u8']>;
  slot_idGT?: InputMaybe<Scalars['u8']>;
  slot_idGTE?: InputMaybe<Scalars['u8']>;
  slot_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idLIKE?: InputMaybe<Scalars['u8']>;
  slot_idLT?: InputMaybe<Scalars['u8']>;
  slot_idLTE?: InputMaybe<Scalars['u8']>;
  slot_idNEQ?: InputMaybe<Scalars['u8']>;
  slot_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slot_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  tier?: InputMaybe<Scalars['u8']>;
  tierEQ?: InputMaybe<Scalars['u8']>;
  tierGT?: InputMaybe<Scalars['u8']>;
  tierGTE?: InputMaybe<Scalars['u8']>;
  tierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierLIKE?: InputMaybe<Scalars['u8']>;
  tierLT?: InputMaybe<Scalars['u8']>;
  tierLTE?: InputMaybe<Scalars['u8']>;
  tierNEQ?: InputMaybe<Scalars['u8']>;
  tierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_DrugConfig = {
  __typename?: 'dopewars_DrugConfig';
  base?: Maybe<Scalars['u16']>;
  drug?: Maybe<Scalars['Enum']>;
  drug_id?: Maybe<Scalars['u8']>;
  drugs_mode?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  name?: Maybe<Dopewars_Bytes16>;
  step?: Maybe<Scalars['u16']>;
  weight?: Maybe<Scalars['u16']>;
};

export type Dopewars_DrugConfigConnection = {
  __typename?: 'dopewars_DrugConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_DrugConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_DrugConfigEdge = {
  __typename?: 'dopewars_DrugConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_DrugConfig>;
};

export type Dopewars_DrugConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_DrugConfigOrderField;
};

export enum Dopewars_DrugConfigOrderField {
  Base = 'BASE',
  Drug = 'DRUG',
  DrugsMode = 'DRUGS_MODE',
  DrugId = 'DRUG_ID',
  Name = 'NAME',
  Step = 'STEP',
  Weight = 'WEIGHT'
}

export type Dopewars_DrugConfigWhereInput = {
  base?: InputMaybe<Scalars['u16']>;
  baseEQ?: InputMaybe<Scalars['u16']>;
  baseGT?: InputMaybe<Scalars['u16']>;
  baseGTE?: InputMaybe<Scalars['u16']>;
  baseIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  baseLIKE?: InputMaybe<Scalars['u16']>;
  baseLT?: InputMaybe<Scalars['u16']>;
  baseLTE?: InputMaybe<Scalars['u16']>;
  baseNEQ?: InputMaybe<Scalars['u16']>;
  baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  baseNOTLIKE?: InputMaybe<Scalars['u16']>;
  drug?: InputMaybe<Scalars['Enum']>;
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  drugs_mode?: InputMaybe<Scalars['Enum']>;
  name?: InputMaybe<Dopewars_DrugConfig_NameWhereInput>;
  step?: InputMaybe<Scalars['u16']>;
  stepEQ?: InputMaybe<Scalars['u16']>;
  stepGT?: InputMaybe<Scalars['u16']>;
  stepGTE?: InputMaybe<Scalars['u16']>;
  stepIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  stepLIKE?: InputMaybe<Scalars['u16']>;
  stepLT?: InputMaybe<Scalars['u16']>;
  stepLTE?: InputMaybe<Scalars['u16']>;
  stepNEQ?: InputMaybe<Scalars['u16']>;
  stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  stepNOTLIKE?: InputMaybe<Scalars['u16']>;
  weight?: InputMaybe<Scalars['u16']>;
  weightEQ?: InputMaybe<Scalars['u16']>;
  weightGT?: InputMaybe<Scalars['u16']>;
  weightGTE?: InputMaybe<Scalars['u16']>;
  weightIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  weightLIKE?: InputMaybe<Scalars['u16']>;
  weightLT?: InputMaybe<Scalars['u16']>;
  weightLTE?: InputMaybe<Scalars['u16']>;
  weightNEQ?: InputMaybe<Scalars['u16']>;
  weightNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  weightNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_DrugConfig_NameWhereInput = {
  value?: InputMaybe<Scalars['u128']>;
  valueEQ?: InputMaybe<Scalars['u128']>;
  valueGT?: InputMaybe<Scalars['u128']>;
  valueGTE?: InputMaybe<Scalars['u128']>;
  valueIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  valueLIKE?: InputMaybe<Scalars['u128']>;
  valueLT?: InputMaybe<Scalars['u128']>;
  valueLTE?: InputMaybe<Scalars['u128']>;
  valueNEQ?: InputMaybe<Scalars['u128']>;
  valueNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  valueNOTLIKE?: InputMaybe<Scalars['u128']>;
};

export type Dopewars_Erc20BalanceEvent = {
  __typename?: 'dopewars_ERC20BalanceEvent';
  balance?: Maybe<Scalars['u256']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  owner?: Maybe<Scalars['ContractAddress']>;
  token_address?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_Erc20BalanceEventConnection = {
  __typename?: 'dopewars_ERC20BalanceEventConnection';
  edges?: Maybe<Array<Maybe<Dopewars_Erc20BalanceEventEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_Erc20BalanceEventEdge = {
  __typename?: 'dopewars_ERC20BalanceEventEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Erc20BalanceEvent>;
};

export type Dopewars_Erc20BalanceEventOrder = {
  direction: OrderDirection;
  field: Dopewars_Erc20BalanceEventOrderField;
};

export enum Dopewars_Erc20BalanceEventOrderField {
  Balance = 'BALANCE',
  Owner = 'OWNER',
  TokenAddress = 'TOKEN_ADDRESS'
}

export type Dopewars_Erc20BalanceEventWhereInput = {
  balance?: InputMaybe<Scalars['u256']>;
  balanceEQ?: InputMaybe<Scalars['u256']>;
  balanceGT?: InputMaybe<Scalars['u256']>;
  balanceGTE?: InputMaybe<Scalars['u256']>;
  balanceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  balanceLIKE?: InputMaybe<Scalars['u256']>;
  balanceLT?: InputMaybe<Scalars['u256']>;
  balanceLTE?: InputMaybe<Scalars['u256']>;
  balanceNEQ?: InputMaybe<Scalars['u256']>;
  balanceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  balanceNOTLIKE?: InputMaybe<Scalars['u256']>;
  owner?: InputMaybe<Scalars['ContractAddress']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ownerLIKE?: InputMaybe<Scalars['ContractAddress']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ownerNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  token_address?: InputMaybe<Scalars['ContractAddress']>;
  token_addressEQ?: InputMaybe<Scalars['ContractAddress']>;
  token_addressGT?: InputMaybe<Scalars['ContractAddress']>;
  token_addressGTE?: InputMaybe<Scalars['ContractAddress']>;
  token_addressIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  token_addressLIKE?: InputMaybe<Scalars['ContractAddress']>;
  token_addressLT?: InputMaybe<Scalars['ContractAddress']>;
  token_addressLTE?: InputMaybe<Scalars['ContractAddress']>;
  token_addressNEQ?: InputMaybe<Scalars['ContractAddress']>;
  token_addressNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  token_addressNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_EncounterStatsConfig = {
  __typename?: 'dopewars_EncounterStatsConfig';
  attack_base?: Maybe<Scalars['u8']>;
  attack_step?: Maybe<Scalars['u8']>;
  defense_base?: Maybe<Scalars['u8']>;
  defense_step?: Maybe<Scalars['u8']>;
  encounter?: Maybe<Scalars['Enum']>;
  encounters_mode?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health_base?: Maybe<Scalars['u8']>;
  health_step?: Maybe<Scalars['u8']>;
  speed_base?: Maybe<Scalars['u8']>;
  speed_step?: Maybe<Scalars['u8']>;
};

export type Dopewars_EncounterStatsConfigConnection = {
  __typename?: 'dopewars_EncounterStatsConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_EncounterStatsConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_EncounterStatsConfigEdge = {
  __typename?: 'dopewars_EncounterStatsConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_EncounterStatsConfig>;
};

export type Dopewars_EncounterStatsConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_EncounterStatsConfigOrderField;
};

export enum Dopewars_EncounterStatsConfigOrderField {
  AttackBase = 'ATTACK_BASE',
  AttackStep = 'ATTACK_STEP',
  DefenseBase = 'DEFENSE_BASE',
  DefenseStep = 'DEFENSE_STEP',
  Encounter = 'ENCOUNTER',
  EncountersMode = 'ENCOUNTERS_MODE',
  HealthBase = 'HEALTH_BASE',
  HealthStep = 'HEALTH_STEP',
  SpeedBase = 'SPEED_BASE',
  SpeedStep = 'SPEED_STEP'
}

export type Dopewars_EncounterStatsConfigWhereInput = {
  attack_base?: InputMaybe<Scalars['u8']>;
  attack_baseEQ?: InputMaybe<Scalars['u8']>;
  attack_baseGT?: InputMaybe<Scalars['u8']>;
  attack_baseGTE?: InputMaybe<Scalars['u8']>;
  attack_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_baseLIKE?: InputMaybe<Scalars['u8']>;
  attack_baseLT?: InputMaybe<Scalars['u8']>;
  attack_baseLTE?: InputMaybe<Scalars['u8']>;
  attack_baseNEQ?: InputMaybe<Scalars['u8']>;
  attack_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  attack_step?: InputMaybe<Scalars['u8']>;
  attack_stepEQ?: InputMaybe<Scalars['u8']>;
  attack_stepGT?: InputMaybe<Scalars['u8']>;
  attack_stepGTE?: InputMaybe<Scalars['u8']>;
  attack_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_stepLIKE?: InputMaybe<Scalars['u8']>;
  attack_stepLT?: InputMaybe<Scalars['u8']>;
  attack_stepLTE?: InputMaybe<Scalars['u8']>;
  attack_stepNEQ?: InputMaybe<Scalars['u8']>;
  attack_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attack_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense_base?: InputMaybe<Scalars['u8']>;
  defense_baseEQ?: InputMaybe<Scalars['u8']>;
  defense_baseGT?: InputMaybe<Scalars['u8']>;
  defense_baseGTE?: InputMaybe<Scalars['u8']>;
  defense_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_baseLIKE?: InputMaybe<Scalars['u8']>;
  defense_baseLT?: InputMaybe<Scalars['u8']>;
  defense_baseLTE?: InputMaybe<Scalars['u8']>;
  defense_baseNEQ?: InputMaybe<Scalars['u8']>;
  defense_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense_step?: InputMaybe<Scalars['u8']>;
  defense_stepEQ?: InputMaybe<Scalars['u8']>;
  defense_stepGT?: InputMaybe<Scalars['u8']>;
  defense_stepGTE?: InputMaybe<Scalars['u8']>;
  defense_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_stepLIKE?: InputMaybe<Scalars['u8']>;
  defense_stepLT?: InputMaybe<Scalars['u8']>;
  defense_stepLTE?: InputMaybe<Scalars['u8']>;
  defense_stepNEQ?: InputMaybe<Scalars['u8']>;
  defense_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defense_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  encounter?: InputMaybe<Scalars['Enum']>;
  encounters_mode?: InputMaybe<Scalars['Enum']>;
  health_base?: InputMaybe<Scalars['u8']>;
  health_baseEQ?: InputMaybe<Scalars['u8']>;
  health_baseGT?: InputMaybe<Scalars['u8']>;
  health_baseGTE?: InputMaybe<Scalars['u8']>;
  health_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_baseLIKE?: InputMaybe<Scalars['u8']>;
  health_baseLT?: InputMaybe<Scalars['u8']>;
  health_baseLTE?: InputMaybe<Scalars['u8']>;
  health_baseNEQ?: InputMaybe<Scalars['u8']>;
  health_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  health_step?: InputMaybe<Scalars['u8']>;
  health_stepEQ?: InputMaybe<Scalars['u8']>;
  health_stepGT?: InputMaybe<Scalars['u8']>;
  health_stepGTE?: InputMaybe<Scalars['u8']>;
  health_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_stepLIKE?: InputMaybe<Scalars['u8']>;
  health_stepLT?: InputMaybe<Scalars['u8']>;
  health_stepLTE?: InputMaybe<Scalars['u8']>;
  health_stepNEQ?: InputMaybe<Scalars['u8']>;
  health_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  health_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  speed_base?: InputMaybe<Scalars['u8']>;
  speed_baseEQ?: InputMaybe<Scalars['u8']>;
  speed_baseGT?: InputMaybe<Scalars['u8']>;
  speed_baseGTE?: InputMaybe<Scalars['u8']>;
  speed_baseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_baseLIKE?: InputMaybe<Scalars['u8']>;
  speed_baseLT?: InputMaybe<Scalars['u8']>;
  speed_baseLTE?: InputMaybe<Scalars['u8']>;
  speed_baseNEQ?: InputMaybe<Scalars['u8']>;
  speed_baseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_baseNOTLIKE?: InputMaybe<Scalars['u8']>;
  speed_step?: InputMaybe<Scalars['u8']>;
  speed_stepEQ?: InputMaybe<Scalars['u8']>;
  speed_stepGT?: InputMaybe<Scalars['u8']>;
  speed_stepGTE?: InputMaybe<Scalars['u8']>;
  speed_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_stepLIKE?: InputMaybe<Scalars['u8']>;
  speed_stepLT?: InputMaybe<Scalars['u8']>;
  speed_stepLTE?: InputMaybe<Scalars['u8']>;
  speed_stepNEQ?: InputMaybe<Scalars['u8']>;
  speed_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speed_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_Game = {
  __typename?: 'dopewars_Game';
  entity?: Maybe<World__Entity>;
  equipment_by_slot?: Maybe<Array<Maybe<Scalars['felt252']>>>;
  eventMessage?: Maybe<World__EventMessage>;
  final_score?: Maybe<Scalars['u32']>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  game_over?: Maybe<Scalars['bool']>;
  hustler_token_id?: Maybe<Scalars['u64']>;
  multiplier?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Dopewars_Bytes16>;
  registered?: Maybe<Scalars['bool']>;
  reward?: Maybe<Scalars['u128']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_GameConfig = {
  __typename?: 'dopewars_GameConfig';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health?: Maybe<Scalars['u8']>;
  max_rounds?: Maybe<Scalars['u8']>;
  max_turns?: Maybe<Scalars['u8']>;
  max_wanted_shopping?: Maybe<Scalars['u8']>;
  rep_buy_item?: Maybe<Scalars['u8']>;
  rep_carry_drugs?: Maybe<Scalars['u8']>;
  rep_drug_step?: Maybe<Scalars['u8']>;
  rep_hospitalized?: Maybe<Scalars['u8']>;
  rep_jailed?: Maybe<Scalars['u8']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_GameConfigConnection = {
  __typename?: 'dopewars_GameConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameConfigEdge = {
  __typename?: 'dopewars_GameConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameConfig>;
};

export type Dopewars_GameConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_GameConfigOrderField;
};

export enum Dopewars_GameConfigOrderField {
  Cash = 'CASH',
  Health = 'HEALTH',
  MaxRounds = 'MAX_ROUNDS',
  MaxTurns = 'MAX_TURNS',
  MaxWantedShopping = 'MAX_WANTED_SHOPPING',
  RepBuyItem = 'REP_BUY_ITEM',
  RepCarryDrugs = 'REP_CARRY_DRUGS',
  RepDrugStep = 'REP_DRUG_STEP',
  RepHospitalized = 'REP_HOSPITALIZED',
  RepJailed = 'REP_JAILED',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_GameConfigWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashLIKE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_rounds?: InputMaybe<Scalars['u8']>;
  max_roundsEQ?: InputMaybe<Scalars['u8']>;
  max_roundsGT?: InputMaybe<Scalars['u8']>;
  max_roundsGTE?: InputMaybe<Scalars['u8']>;
  max_roundsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_roundsLIKE?: InputMaybe<Scalars['u8']>;
  max_roundsLT?: InputMaybe<Scalars['u8']>;
  max_roundsLTE?: InputMaybe<Scalars['u8']>;
  max_roundsNEQ?: InputMaybe<Scalars['u8']>;
  max_roundsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_roundsNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_turns?: InputMaybe<Scalars['u8']>;
  max_turnsEQ?: InputMaybe<Scalars['u8']>;
  max_turnsGT?: InputMaybe<Scalars['u8']>;
  max_turnsGTE?: InputMaybe<Scalars['u8']>;
  max_turnsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_turnsLIKE?: InputMaybe<Scalars['u8']>;
  max_turnsLT?: InputMaybe<Scalars['u8']>;
  max_turnsLTE?: InputMaybe<Scalars['u8']>;
  max_turnsNEQ?: InputMaybe<Scalars['u8']>;
  max_turnsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_turnsNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_wanted_shopping?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingGTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_wanted_shoppingLIKE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLT?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingLTE?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingNEQ?: InputMaybe<Scalars['u8']>;
  max_wanted_shoppingNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  max_wanted_shoppingNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_buy_item?: InputMaybe<Scalars['u8']>;
  rep_buy_itemEQ?: InputMaybe<Scalars['u8']>;
  rep_buy_itemGT?: InputMaybe<Scalars['u8']>;
  rep_buy_itemGTE?: InputMaybe<Scalars['u8']>;
  rep_buy_itemIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_buy_itemLIKE?: InputMaybe<Scalars['u8']>;
  rep_buy_itemLT?: InputMaybe<Scalars['u8']>;
  rep_buy_itemLTE?: InputMaybe<Scalars['u8']>;
  rep_buy_itemNEQ?: InputMaybe<Scalars['u8']>;
  rep_buy_itemNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_buy_itemNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugs?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsEQ?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsGT?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsGTE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_carry_drugsLIKE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsLT?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsLTE?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsNEQ?: InputMaybe<Scalars['u8']>;
  rep_carry_drugsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_carry_drugsNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_drug_step?: InputMaybe<Scalars['u8']>;
  rep_drug_stepEQ?: InputMaybe<Scalars['u8']>;
  rep_drug_stepGT?: InputMaybe<Scalars['u8']>;
  rep_drug_stepGTE?: InputMaybe<Scalars['u8']>;
  rep_drug_stepIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_drug_stepLIKE?: InputMaybe<Scalars['u8']>;
  rep_drug_stepLT?: InputMaybe<Scalars['u8']>;
  rep_drug_stepLTE?: InputMaybe<Scalars['u8']>;
  rep_drug_stepNEQ?: InputMaybe<Scalars['u8']>;
  rep_drug_stepNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_drug_stepNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_hospitalized?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedEQ?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedGT?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedGTE?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_hospitalizedLIKE?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedLT?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedLTE?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedNEQ?: InputMaybe<Scalars['u8']>;
  rep_hospitalizedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_hospitalizedNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_jailed?: InputMaybe<Scalars['u8']>;
  rep_jailedEQ?: InputMaybe<Scalars['u8']>;
  rep_jailedGT?: InputMaybe<Scalars['u8']>;
  rep_jailedGTE?: InputMaybe<Scalars['u8']>;
  rep_jailedIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_jailedLIKE?: InputMaybe<Scalars['u8']>;
  rep_jailedLT?: InputMaybe<Scalars['u8']>;
  rep_jailedLTE?: InputMaybe<Scalars['u8']>;
  rep_jailedNEQ?: InputMaybe<Scalars['u8']>;
  rep_jailedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_jailedNOTLIKE?: InputMaybe<Scalars['u8']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_GameConnection = {
  __typename?: 'dopewars_GameConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameCreated = {
  __typename?: 'dopewars_GameCreated';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  game_mode?: Maybe<Scalars['Enum']>;
  hustler_token_id?: Maybe<Scalars['u64']>;
  multiplier?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['felt252']>;
};

export type Dopewars_GameCreatedConnection = {
  __typename?: 'dopewars_GameCreatedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameCreatedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameCreatedEdge = {
  __typename?: 'dopewars_GameCreatedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameCreated>;
};

export type Dopewars_GameCreatedOrder = {
  direction: OrderDirection;
  field: Dopewars_GameCreatedOrderField;
};

export enum Dopewars_GameCreatedOrderField {
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  HustlerTokenId = 'HUSTLER_TOKEN_ID',
  Multiplier = 'MULTIPLIER',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME'
}

export type Dopewars_GameCreatedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  hustler_token_id?: InputMaybe<Scalars['u64']>;
  hustler_token_idEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idGT?: InputMaybe<Scalars['u64']>;
  hustler_token_idGTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idLIKE?: InputMaybe<Scalars['u64']>;
  hustler_token_idLT?: InputMaybe<Scalars['u64']>;
  hustler_token_idLTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idNEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idNOTLIKE?: InputMaybe<Scalars['u64']>;
  multiplier?: InputMaybe<Scalars['u8']>;
  multiplierEQ?: InputMaybe<Scalars['u8']>;
  multiplierGT?: InputMaybe<Scalars['u8']>;
  multiplierGTE?: InputMaybe<Scalars['u8']>;
  multiplierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  multiplierLIKE?: InputMaybe<Scalars['u8']>;
  multiplierLT?: InputMaybe<Scalars['u8']>;
  multiplierLTE?: InputMaybe<Scalars['u8']>;
  multiplierNEQ?: InputMaybe<Scalars['u8']>;
  multiplierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  multiplierNOTLIKE?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['felt252']>;
  player_nameEQ?: InputMaybe<Scalars['felt252']>;
  player_nameGT?: InputMaybe<Scalars['felt252']>;
  player_nameGTE?: InputMaybe<Scalars['felt252']>;
  player_nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameLIKE?: InputMaybe<Scalars['felt252']>;
  player_nameLT?: InputMaybe<Scalars['felt252']>;
  player_nameLTE?: InputMaybe<Scalars['felt252']>;
  player_nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
};

export type Dopewars_GameEdge = {
  __typename?: 'dopewars_GameEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Game>;
};

export type Dopewars_GameOrder = {
  direction: OrderDirection;
  field: Dopewars_GameOrderField;
};

export enum Dopewars_GameOrderField {
  EquipmentBySlot = 'EQUIPMENT_BY_SLOT',
  FinalScore = 'FINAL_SCORE',
  GameId = 'GAME_ID',
  GameMode = 'GAME_MODE',
  GameOver = 'GAME_OVER',
  HustlerTokenId = 'HUSTLER_TOKEN_ID',
  Multiplier = 'MULTIPLIER',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME',
  Registered = 'REGISTERED',
  Reward = 'REWARD',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_GameOver = {
  __typename?: 'dopewars_GameOver';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  hustler_token_id?: Maybe<Scalars['u64']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['felt252']>;
  reputation?: Maybe<Scalars['u8']>;
  reward?: Maybe<Scalars['u128']>;
  season_version?: Maybe<Scalars['u16']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_GameOverConnection = {
  __typename?: 'dopewars_GameOverConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameOverEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameOverEdge = {
  __typename?: 'dopewars_GameOverEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameOver>;
};

export type Dopewars_GameOverOrder = {
  direction: OrderDirection;
  field: Dopewars_GameOverOrderField;
};

export enum Dopewars_GameOverOrderField {
  Cash = 'CASH',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  HustlerTokenId = 'HUSTLER_TOKEN_ID',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME',
  Reputation = 'REPUTATION',
  Reward = 'REWARD',
  SeasonVersion = 'SEASON_VERSION',
  Turn = 'TURN'
}

export type Dopewars_GameOverWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashLIKE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  hustler_token_id?: InputMaybe<Scalars['u64']>;
  hustler_token_idEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idGT?: InputMaybe<Scalars['u64']>;
  hustler_token_idGTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idLIKE?: InputMaybe<Scalars['u64']>;
  hustler_token_idLT?: InputMaybe<Scalars['u64']>;
  hustler_token_idLTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idNEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idNOTLIKE?: InputMaybe<Scalars['u64']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['felt252']>;
  player_nameEQ?: InputMaybe<Scalars['felt252']>;
  player_nameGT?: InputMaybe<Scalars['felt252']>;
  player_nameGTE?: InputMaybe<Scalars['felt252']>;
  player_nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameLIKE?: InputMaybe<Scalars['felt252']>;
  player_nameLT?: InputMaybe<Scalars['felt252']>;
  player_nameLTE?: InputMaybe<Scalars['felt252']>;
  player_nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  reputation?: InputMaybe<Scalars['u8']>;
  reputationEQ?: InputMaybe<Scalars['u8']>;
  reputationGT?: InputMaybe<Scalars['u8']>;
  reputationGTE?: InputMaybe<Scalars['u8']>;
  reputationIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationLIKE?: InputMaybe<Scalars['u8']>;
  reputationLT?: InputMaybe<Scalars['u8']>;
  reputationLTE?: InputMaybe<Scalars['u8']>;
  reputationNEQ?: InputMaybe<Scalars['u8']>;
  reputationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationNOTLIKE?: InputMaybe<Scalars['u8']>;
  reward?: InputMaybe<Scalars['u128']>;
  rewardEQ?: InputMaybe<Scalars['u128']>;
  rewardGT?: InputMaybe<Scalars['u128']>;
  rewardGTE?: InputMaybe<Scalars['u128']>;
  rewardIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  rewardLIKE?: InputMaybe<Scalars['u128']>;
  rewardLT?: InputMaybe<Scalars['u128']>;
  rewardLTE?: InputMaybe<Scalars['u128']>;
  rewardNEQ?: InputMaybe<Scalars['u128']>;
  rewardNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  rewardNOTLIKE?: InputMaybe<Scalars['u128']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_GameStorePacked = {
  __typename?: 'dopewars_GameStorePacked';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  packed?: Maybe<Scalars['felt252']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_GameStorePackedConnection = {
  __typename?: 'dopewars_GameStorePackedConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GameStorePackedEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GameStorePackedEdge = {
  __typename?: 'dopewars_GameStorePackedEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GameStorePacked>;
};

export type Dopewars_GameStorePackedOrder = {
  direction: OrderDirection;
  field: Dopewars_GameStorePackedOrderField;
};

export enum Dopewars_GameStorePackedOrderField {
  GameId = 'GAME_ID',
  Packed = 'PACKED',
  PlayerId = 'PLAYER_ID'
}

export type Dopewars_GameStorePackedWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  packed?: InputMaybe<Scalars['felt252']>;
  packedEQ?: InputMaybe<Scalars['felt252']>;
  packedGT?: InputMaybe<Scalars['felt252']>;
  packedGTE?: InputMaybe<Scalars['felt252']>;
  packedIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  packedLIKE?: InputMaybe<Scalars['felt252']>;
  packedLT?: InputMaybe<Scalars['felt252']>;
  packedLTE?: InputMaybe<Scalars['felt252']>;
  packedNEQ?: InputMaybe<Scalars['felt252']>;
  packedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  packedNOTLIKE?: InputMaybe<Scalars['felt252']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_GameWhereInput = {
  final_score?: InputMaybe<Scalars['u32']>;
  final_scoreEQ?: InputMaybe<Scalars['u32']>;
  final_scoreGT?: InputMaybe<Scalars['u32']>;
  final_scoreGTE?: InputMaybe<Scalars['u32']>;
  final_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  final_scoreLIKE?: InputMaybe<Scalars['u32']>;
  final_scoreLT?: InputMaybe<Scalars['u32']>;
  final_scoreLTE?: InputMaybe<Scalars['u32']>;
  final_scoreNEQ?: InputMaybe<Scalars['u32']>;
  final_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  final_scoreNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_mode?: InputMaybe<Scalars['Enum']>;
  game_over?: InputMaybe<Scalars['bool']>;
  hustler_token_id?: InputMaybe<Scalars['u64']>;
  hustler_token_idEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idGT?: InputMaybe<Scalars['u64']>;
  hustler_token_idGTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idLIKE?: InputMaybe<Scalars['u64']>;
  hustler_token_idLT?: InputMaybe<Scalars['u64']>;
  hustler_token_idLTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idNEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idNOTLIKE?: InputMaybe<Scalars['u64']>;
  multiplier?: InputMaybe<Scalars['u8']>;
  multiplierEQ?: InputMaybe<Scalars['u8']>;
  multiplierGT?: InputMaybe<Scalars['u8']>;
  multiplierGTE?: InputMaybe<Scalars['u8']>;
  multiplierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  multiplierLIKE?: InputMaybe<Scalars['u8']>;
  multiplierLT?: InputMaybe<Scalars['u8']>;
  multiplierLTE?: InputMaybe<Scalars['u8']>;
  multiplierNEQ?: InputMaybe<Scalars['u8']>;
  multiplierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  multiplierNOTLIKE?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Dopewars_Game_Player_NameWhereInput>;
  registered?: InputMaybe<Scalars['bool']>;
  reward?: InputMaybe<Scalars['u128']>;
  rewardEQ?: InputMaybe<Scalars['u128']>;
  rewardGT?: InputMaybe<Scalars['u128']>;
  rewardGTE?: InputMaybe<Scalars['u128']>;
  rewardIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  rewardLIKE?: InputMaybe<Scalars['u128']>;
  rewardLT?: InputMaybe<Scalars['u128']>;
  rewardLTE?: InputMaybe<Scalars['u128']>;
  rewardNEQ?: InputMaybe<Scalars['u128']>;
  rewardNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  rewardNOTLIKE?: InputMaybe<Scalars['u128']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_Game_Player_NameWhereInput = {
  value?: InputMaybe<Scalars['u128']>;
  valueEQ?: InputMaybe<Scalars['u128']>;
  valueGT?: InputMaybe<Scalars['u128']>;
  valueGTE?: InputMaybe<Scalars['u128']>;
  valueIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  valueLIKE?: InputMaybe<Scalars['u128']>;
  valueLT?: InputMaybe<Scalars['u128']>;
  valueLTE?: InputMaybe<Scalars['u128']>;
  valueNEQ?: InputMaybe<Scalars['u128']>;
  valueNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  valueNOTLIKE?: InputMaybe<Scalars['u128']>;
};

export type Dopewars_GearInstance = {
  __typename?: 'dopewars_GearInstance';
  entity?: Maybe<World__Entity>;
  equipped_to?: Maybe<Scalars['u64']>;
  eventMessage?: Maybe<World__EventMessage>;
  id?: Maybe<Scalars['u32']>;
  owner?: Maybe<Scalars['ContractAddress']>;
  purchased_day?: Maybe<Scalars['u32']>;
  template_id?: Maybe<Scalars['u8']>;
};

export type Dopewars_GearInstanceConnection = {
  __typename?: 'dopewars_GearInstanceConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GearInstanceEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GearInstanceEdge = {
  __typename?: 'dopewars_GearInstanceEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GearInstance>;
};

export type Dopewars_GearInstanceOrder = {
  direction: OrderDirection;
  field: Dopewars_GearInstanceOrderField;
};

export enum Dopewars_GearInstanceOrderField {
  EquippedTo = 'EQUIPPED_TO',
  Id = 'ID',
  Owner = 'OWNER',
  PurchasedDay = 'PURCHASED_DAY',
  TemplateId = 'TEMPLATE_ID'
}

export type Dopewars_GearInstanceWhereInput = {
  equipped_to?: InputMaybe<Scalars['u64']>;
  equipped_toEQ?: InputMaybe<Scalars['u64']>;
  equipped_toGT?: InputMaybe<Scalars['u64']>;
  equipped_toGTE?: InputMaybe<Scalars['u64']>;
  equipped_toIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  equipped_toLIKE?: InputMaybe<Scalars['u64']>;
  equipped_toLT?: InputMaybe<Scalars['u64']>;
  equipped_toLTE?: InputMaybe<Scalars['u64']>;
  equipped_toNEQ?: InputMaybe<Scalars['u64']>;
  equipped_toNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  equipped_toNOTLIKE?: InputMaybe<Scalars['u64']>;
  id?: InputMaybe<Scalars['u32']>;
  idEQ?: InputMaybe<Scalars['u32']>;
  idGT?: InputMaybe<Scalars['u32']>;
  idGTE?: InputMaybe<Scalars['u32']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  idLIKE?: InputMaybe<Scalars['u32']>;
  idLT?: InputMaybe<Scalars['u32']>;
  idLTE?: InputMaybe<Scalars['u32']>;
  idNEQ?: InputMaybe<Scalars['u32']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  idNOTLIKE?: InputMaybe<Scalars['u32']>;
  owner?: InputMaybe<Scalars['ContractAddress']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ownerLIKE?: InputMaybe<Scalars['ContractAddress']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  ownerNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ownerNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  purchased_day?: InputMaybe<Scalars['u32']>;
  purchased_dayEQ?: InputMaybe<Scalars['u32']>;
  purchased_dayGT?: InputMaybe<Scalars['u32']>;
  purchased_dayGTE?: InputMaybe<Scalars['u32']>;
  purchased_dayIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  purchased_dayLIKE?: InputMaybe<Scalars['u32']>;
  purchased_dayLT?: InputMaybe<Scalars['u32']>;
  purchased_dayLTE?: InputMaybe<Scalars['u32']>;
  purchased_dayNEQ?: InputMaybe<Scalars['u32']>;
  purchased_dayNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  purchased_dayNOTLIKE?: InputMaybe<Scalars['u32']>;
  template_id?: InputMaybe<Scalars['u8']>;
  template_idEQ?: InputMaybe<Scalars['u8']>;
  template_idGT?: InputMaybe<Scalars['u8']>;
  template_idGTE?: InputMaybe<Scalars['u8']>;
  template_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  template_idLIKE?: InputMaybe<Scalars['u8']>;
  template_idLT?: InputMaybe<Scalars['u8']>;
  template_idLTE?: InputMaybe<Scalars['u8']>;
  template_idNEQ?: InputMaybe<Scalars['u8']>;
  template_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  template_idNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_GearTemplate = {
  __typename?: 'dopewars_GearTemplate';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  id?: Maybe<Scalars['u8']>;
  name?: Maybe<Scalars['felt252']>;
  slot?: Maybe<Scalars['u8']>;
  stat_boost?: Maybe<Scalars['u16']>;
  tier?: Maybe<Scalars['u8']>;
};

export type Dopewars_GearTemplateConnection = {
  __typename?: 'dopewars_GearTemplateConnection';
  edges?: Maybe<Array<Maybe<Dopewars_GearTemplateEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_GearTemplateEdge = {
  __typename?: 'dopewars_GearTemplateEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_GearTemplate>;
};

export type Dopewars_GearTemplateOrder = {
  direction: OrderDirection;
  field: Dopewars_GearTemplateOrderField;
};

export enum Dopewars_GearTemplateOrderField {
  Id = 'ID',
  Name = 'NAME',
  Slot = 'SLOT',
  StatBoost = 'STAT_BOOST',
  Tier = 'TIER'
}

export type Dopewars_GearTemplateWhereInput = {
  id?: InputMaybe<Scalars['u8']>;
  idEQ?: InputMaybe<Scalars['u8']>;
  idGT?: InputMaybe<Scalars['u8']>;
  idGTE?: InputMaybe<Scalars['u8']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  idLIKE?: InputMaybe<Scalars['u8']>;
  idLT?: InputMaybe<Scalars['u8']>;
  idLTE?: InputMaybe<Scalars['u8']>;
  idNEQ?: InputMaybe<Scalars['u8']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  idNOTLIKE?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  nameLIKE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  slot?: InputMaybe<Scalars['u8']>;
  slotEQ?: InputMaybe<Scalars['u8']>;
  slotGT?: InputMaybe<Scalars['u8']>;
  slotGTE?: InputMaybe<Scalars['u8']>;
  slotIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slotLIKE?: InputMaybe<Scalars['u8']>;
  slotLT?: InputMaybe<Scalars['u8']>;
  slotLTE?: InputMaybe<Scalars['u8']>;
  slotNEQ?: InputMaybe<Scalars['u8']>;
  slotNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  slotNOTLIKE?: InputMaybe<Scalars['u8']>;
  stat_boost?: InputMaybe<Scalars['u16']>;
  stat_boostEQ?: InputMaybe<Scalars['u16']>;
  stat_boostGT?: InputMaybe<Scalars['u16']>;
  stat_boostGTE?: InputMaybe<Scalars['u16']>;
  stat_boostIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  stat_boostLIKE?: InputMaybe<Scalars['u16']>;
  stat_boostLT?: InputMaybe<Scalars['u16']>;
  stat_boostLTE?: InputMaybe<Scalars['u16']>;
  stat_boostNEQ?: InputMaybe<Scalars['u16']>;
  stat_boostNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  stat_boostNOTLIKE?: InputMaybe<Scalars['u16']>;
  tier?: InputMaybe<Scalars['u8']>;
  tierEQ?: InputMaybe<Scalars['u8']>;
  tierGT?: InputMaybe<Scalars['u8']>;
  tierGTE?: InputMaybe<Scalars['u8']>;
  tierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierLIKE?: InputMaybe<Scalars['u8']>;
  tierLT?: InputMaybe<Scalars['u8']>;
  tierLTE?: InputMaybe<Scalars['u8']>;
  tierNEQ?: InputMaybe<Scalars['u8']>;
  tierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  tierNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_HighVolatility = {
  __typename?: 'dopewars_HighVolatility';
  drug_id?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  increase?: Maybe<Scalars['bool']>;
  location_id?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_HighVolatilityConnection = {
  __typename?: 'dopewars_HighVolatilityConnection';
  edges?: Maybe<Array<Maybe<Dopewars_HighVolatilityEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_HighVolatilityEdge = {
  __typename?: 'dopewars_HighVolatilityEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_HighVolatility>;
};

export type Dopewars_HighVolatilityOrder = {
  direction: OrderDirection;
  field: Dopewars_HighVolatilityOrderField;
};

export enum Dopewars_HighVolatilityOrderField {
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  Increase = 'INCREASE',
  LocationId = 'LOCATION_ID',
  PlayerId = 'PLAYER_ID'
}

export type Dopewars_HighVolatilityWhereInput = {
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  increase?: InputMaybe<Scalars['bool']>;
  location_id?: InputMaybe<Scalars['u8']>;
  location_idEQ?: InputMaybe<Scalars['u8']>;
  location_idGT?: InputMaybe<Scalars['u8']>;
  location_idGTE?: InputMaybe<Scalars['u8']>;
  location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idLIKE?: InputMaybe<Scalars['u8']>;
  location_idLT?: InputMaybe<Scalars['u8']>;
  location_idLTE?: InputMaybe<Scalars['u8']>;
  location_idNEQ?: InputMaybe<Scalars['u8']>;
  location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_HustlerInstance = {
  __typename?: 'dopewars_HustlerInstance';
  bundle_id?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  final_score?: Maybe<Scalars['u32']>;
  game_id?: Maybe<Scalars['u32']>;
  gear_clothes?: Maybe<Scalars['u8']>;
  gear_feet?: Maybe<Scalars['u8']>;
  gear_transport?: Maybe<Scalars['u8']>;
  gear_weapon?: Maybe<Scalars['u8']>;
  hustler_template_id?: Maybe<Scalars['u8']>;
  paper_burned?: Maybe<Scalars['u128']>;
  token_id?: Maybe<Scalars['u64']>;
  used?: Maybe<Scalars['bool']>;
};

export type Dopewars_HustlerInstanceConnection = {
  __typename?: 'dopewars_HustlerInstanceConnection';
  edges?: Maybe<Array<Maybe<Dopewars_HustlerInstanceEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_HustlerInstanceEdge = {
  __typename?: 'dopewars_HustlerInstanceEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_HustlerInstance>;
};

export type Dopewars_HustlerInstanceOrder = {
  direction: OrderDirection;
  field: Dopewars_HustlerInstanceOrderField;
};

export enum Dopewars_HustlerInstanceOrderField {
  BundleId = 'BUNDLE_ID',
  FinalScore = 'FINAL_SCORE',
  GameId = 'GAME_ID',
  GearClothes = 'GEAR_CLOTHES',
  GearFeet = 'GEAR_FEET',
  GearTransport = 'GEAR_TRANSPORT',
  GearWeapon = 'GEAR_WEAPON',
  HustlerTemplateId = 'HUSTLER_TEMPLATE_ID',
  PaperBurned = 'PAPER_BURNED',
  TokenId = 'TOKEN_ID',
  Used = 'USED'
}

export type Dopewars_HustlerInstanceWhereInput = {
  bundle_id?: InputMaybe<Scalars['u32']>;
  bundle_idEQ?: InputMaybe<Scalars['u32']>;
  bundle_idGT?: InputMaybe<Scalars['u32']>;
  bundle_idGTE?: InputMaybe<Scalars['u32']>;
  bundle_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idLIKE?: InputMaybe<Scalars['u32']>;
  bundle_idLT?: InputMaybe<Scalars['u32']>;
  bundle_idLTE?: InputMaybe<Scalars['u32']>;
  bundle_idNEQ?: InputMaybe<Scalars['u32']>;
  bundle_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  final_score?: InputMaybe<Scalars['u32']>;
  final_scoreEQ?: InputMaybe<Scalars['u32']>;
  final_scoreGT?: InputMaybe<Scalars['u32']>;
  final_scoreGTE?: InputMaybe<Scalars['u32']>;
  final_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  final_scoreLIKE?: InputMaybe<Scalars['u32']>;
  final_scoreLT?: InputMaybe<Scalars['u32']>;
  final_scoreLTE?: InputMaybe<Scalars['u32']>;
  final_scoreNEQ?: InputMaybe<Scalars['u32']>;
  final_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  final_scoreNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  gear_clothes?: InputMaybe<Scalars['u8']>;
  gear_clothesEQ?: InputMaybe<Scalars['u8']>;
  gear_clothesGT?: InputMaybe<Scalars['u8']>;
  gear_clothesGTE?: InputMaybe<Scalars['u8']>;
  gear_clothesIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_clothesLIKE?: InputMaybe<Scalars['u8']>;
  gear_clothesLT?: InputMaybe<Scalars['u8']>;
  gear_clothesLTE?: InputMaybe<Scalars['u8']>;
  gear_clothesNEQ?: InputMaybe<Scalars['u8']>;
  gear_clothesNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_clothesNOTLIKE?: InputMaybe<Scalars['u8']>;
  gear_feet?: InputMaybe<Scalars['u8']>;
  gear_feetEQ?: InputMaybe<Scalars['u8']>;
  gear_feetGT?: InputMaybe<Scalars['u8']>;
  gear_feetGTE?: InputMaybe<Scalars['u8']>;
  gear_feetIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_feetLIKE?: InputMaybe<Scalars['u8']>;
  gear_feetLT?: InputMaybe<Scalars['u8']>;
  gear_feetLTE?: InputMaybe<Scalars['u8']>;
  gear_feetNEQ?: InputMaybe<Scalars['u8']>;
  gear_feetNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_feetNOTLIKE?: InputMaybe<Scalars['u8']>;
  gear_transport?: InputMaybe<Scalars['u8']>;
  gear_transportEQ?: InputMaybe<Scalars['u8']>;
  gear_transportGT?: InputMaybe<Scalars['u8']>;
  gear_transportGTE?: InputMaybe<Scalars['u8']>;
  gear_transportIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_transportLIKE?: InputMaybe<Scalars['u8']>;
  gear_transportLT?: InputMaybe<Scalars['u8']>;
  gear_transportLTE?: InputMaybe<Scalars['u8']>;
  gear_transportNEQ?: InputMaybe<Scalars['u8']>;
  gear_transportNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_transportNOTLIKE?: InputMaybe<Scalars['u8']>;
  gear_weapon?: InputMaybe<Scalars['u8']>;
  gear_weaponEQ?: InputMaybe<Scalars['u8']>;
  gear_weaponGT?: InputMaybe<Scalars['u8']>;
  gear_weaponGTE?: InputMaybe<Scalars['u8']>;
  gear_weaponIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_weaponLIKE?: InputMaybe<Scalars['u8']>;
  gear_weaponLT?: InputMaybe<Scalars['u8']>;
  gear_weaponLTE?: InputMaybe<Scalars['u8']>;
  gear_weaponNEQ?: InputMaybe<Scalars['u8']>;
  gear_weaponNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_weaponNOTLIKE?: InputMaybe<Scalars['u8']>;
  hustler_template_id?: InputMaybe<Scalars['u8']>;
  hustler_template_idEQ?: InputMaybe<Scalars['u8']>;
  hustler_template_idGT?: InputMaybe<Scalars['u8']>;
  hustler_template_idGTE?: InputMaybe<Scalars['u8']>;
  hustler_template_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  hustler_template_idLIKE?: InputMaybe<Scalars['u8']>;
  hustler_template_idLT?: InputMaybe<Scalars['u8']>;
  hustler_template_idLTE?: InputMaybe<Scalars['u8']>;
  hustler_template_idNEQ?: InputMaybe<Scalars['u8']>;
  hustler_template_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  hustler_template_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  paper_burned?: InputMaybe<Scalars['u128']>;
  paper_burnedEQ?: InputMaybe<Scalars['u128']>;
  paper_burnedGT?: InputMaybe<Scalars['u128']>;
  paper_burnedGTE?: InputMaybe<Scalars['u128']>;
  paper_burnedIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  paper_burnedLIKE?: InputMaybe<Scalars['u128']>;
  paper_burnedLT?: InputMaybe<Scalars['u128']>;
  paper_burnedLTE?: InputMaybe<Scalars['u128']>;
  paper_burnedNEQ?: InputMaybe<Scalars['u128']>;
  paper_burnedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  paper_burnedNOTLIKE?: InputMaybe<Scalars['u128']>;
  token_id?: InputMaybe<Scalars['u64']>;
  token_idEQ?: InputMaybe<Scalars['u64']>;
  token_idGT?: InputMaybe<Scalars['u64']>;
  token_idGTE?: InputMaybe<Scalars['u64']>;
  token_idIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  token_idLIKE?: InputMaybe<Scalars['u64']>;
  token_idLT?: InputMaybe<Scalars['u64']>;
  token_idLTE?: InputMaybe<Scalars['u64']>;
  token_idNEQ?: InputMaybe<Scalars['u64']>;
  token_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  token_idNOTLIKE?: InputMaybe<Scalars['u64']>;
  used?: InputMaybe<Scalars['bool']>;
};

export type Dopewars_HustlerTemplate = {
  __typename?: 'dopewars_HustlerTemplate';
  attack?: Maybe<Scalars['u8']>;
  cargo?: Maybe<Scalars['u8']>;
  defense?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health?: Maybe<Scalars['u8']>;
  id?: Maybe<Scalars['u8']>;
  name?: Maybe<Scalars['felt252']>;
  starting_cash?: Maybe<Scalars['u32']>;
};

export type Dopewars_HustlerTemplateConnection = {
  __typename?: 'dopewars_HustlerTemplateConnection';
  edges?: Maybe<Array<Maybe<Dopewars_HustlerTemplateEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_HustlerTemplateEdge = {
  __typename?: 'dopewars_HustlerTemplateEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_HustlerTemplate>;
};

export type Dopewars_HustlerTemplateOrder = {
  direction: OrderDirection;
  field: Dopewars_HustlerTemplateOrderField;
};

export enum Dopewars_HustlerTemplateOrderField {
  Attack = 'ATTACK',
  Cargo = 'CARGO',
  Defense = 'DEFENSE',
  Health = 'HEALTH',
  Id = 'ID',
  Name = 'NAME',
  StartingCash = 'STARTING_CASH'
}

export type Dopewars_HustlerTemplateWhereInput = {
  attack?: InputMaybe<Scalars['u8']>;
  attackEQ?: InputMaybe<Scalars['u8']>;
  attackGT?: InputMaybe<Scalars['u8']>;
  attackGTE?: InputMaybe<Scalars['u8']>;
  attackIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attackLIKE?: InputMaybe<Scalars['u8']>;
  attackLT?: InputMaybe<Scalars['u8']>;
  attackLTE?: InputMaybe<Scalars['u8']>;
  attackNEQ?: InputMaybe<Scalars['u8']>;
  attackNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attackNOTLIKE?: InputMaybe<Scalars['u8']>;
  cargo?: InputMaybe<Scalars['u8']>;
  cargoEQ?: InputMaybe<Scalars['u8']>;
  cargoGT?: InputMaybe<Scalars['u8']>;
  cargoGTE?: InputMaybe<Scalars['u8']>;
  cargoIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  cargoLIKE?: InputMaybe<Scalars['u8']>;
  cargoLT?: InputMaybe<Scalars['u8']>;
  cargoLTE?: InputMaybe<Scalars['u8']>;
  cargoNEQ?: InputMaybe<Scalars['u8']>;
  cargoNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  cargoNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense?: InputMaybe<Scalars['u8']>;
  defenseEQ?: InputMaybe<Scalars['u8']>;
  defenseGT?: InputMaybe<Scalars['u8']>;
  defenseGTE?: InputMaybe<Scalars['u8']>;
  defenseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defenseLIKE?: InputMaybe<Scalars['u8']>;
  defenseLT?: InputMaybe<Scalars['u8']>;
  defenseLTE?: InputMaybe<Scalars['u8']>;
  defenseNEQ?: InputMaybe<Scalars['u8']>;
  defenseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defenseNOTLIKE?: InputMaybe<Scalars['u8']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  id?: InputMaybe<Scalars['u8']>;
  idEQ?: InputMaybe<Scalars['u8']>;
  idGT?: InputMaybe<Scalars['u8']>;
  idGTE?: InputMaybe<Scalars['u8']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  idLIKE?: InputMaybe<Scalars['u8']>;
  idLT?: InputMaybe<Scalars['u8']>;
  idLTE?: InputMaybe<Scalars['u8']>;
  idNEQ?: InputMaybe<Scalars['u8']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  idNOTLIKE?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Scalars['felt252']>;
  nameEQ?: InputMaybe<Scalars['felt252']>;
  nameGT?: InputMaybe<Scalars['felt252']>;
  nameGTE?: InputMaybe<Scalars['felt252']>;
  nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  nameLIKE?: InputMaybe<Scalars['felt252']>;
  nameLT?: InputMaybe<Scalars['felt252']>;
  nameLTE?: InputMaybe<Scalars['felt252']>;
  nameNEQ?: InputMaybe<Scalars['felt252']>;
  nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  starting_cash?: InputMaybe<Scalars['u32']>;
  starting_cashEQ?: InputMaybe<Scalars['u32']>;
  starting_cashGT?: InputMaybe<Scalars['u32']>;
  starting_cashGTE?: InputMaybe<Scalars['u32']>;
  starting_cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  starting_cashLIKE?: InputMaybe<Scalars['u32']>;
  starting_cashLT?: InputMaybe<Scalars['u32']>;
  starting_cashLTE?: InputMaybe<Scalars['u32']>;
  starting_cashNEQ?: InputMaybe<Scalars['u32']>;
  starting_cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  starting_cashNOTLIKE?: InputMaybe<Scalars['u32']>;
};

export type Dopewars_ItemTierConfig = {
  __typename?: 'dopewars_ItemTierConfig';
  cost?: Maybe<Scalars['u32']>;
  stat?: Maybe<Scalars['u16']>;
};

export type Dopewars_LocationConfig = {
  __typename?: 'dopewars_LocationConfig';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  location?: Maybe<Scalars['Enum']>;
  location_id?: Maybe<Scalars['u8']>;
  name?: Maybe<Dopewars_Bytes16>;
};

export type Dopewars_LocationConfigConnection = {
  __typename?: 'dopewars_LocationConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_LocationConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_LocationConfigEdge = {
  __typename?: 'dopewars_LocationConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_LocationConfig>;
};

export type Dopewars_LocationConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_LocationConfigOrderField;
};

export enum Dopewars_LocationConfigOrderField {
  Location = 'LOCATION',
  LocationId = 'LOCATION_ID',
  Name = 'NAME'
}

export type Dopewars_LocationConfigWhereInput = {
  location?: InputMaybe<Scalars['Enum']>;
  location_id?: InputMaybe<Scalars['u8']>;
  location_idEQ?: InputMaybe<Scalars['u8']>;
  location_idGT?: InputMaybe<Scalars['u8']>;
  location_idGTE?: InputMaybe<Scalars['u8']>;
  location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idLIKE?: InputMaybe<Scalars['u8']>;
  location_idLT?: InputMaybe<Scalars['u8']>;
  location_idLTE?: InputMaybe<Scalars['u8']>;
  location_idNEQ?: InputMaybe<Scalars['u8']>;
  location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  name?: InputMaybe<Dopewars_LocationConfig_NameWhereInput>;
};

export type Dopewars_LocationConfig_NameWhereInput = {
  value?: InputMaybe<Scalars['u128']>;
  valueEQ?: InputMaybe<Scalars['u128']>;
  valueGT?: InputMaybe<Scalars['u128']>;
  valueGTE?: InputMaybe<Scalars['u128']>;
  valueIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  valueLIKE?: InputMaybe<Scalars['u128']>;
  valueLT?: InputMaybe<Scalars['u128']>;
  valueLTE?: InputMaybe<Scalars['u128']>;
  valueNEQ?: InputMaybe<Scalars['u128']>;
  valueNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  valueNOTLIKE?: InputMaybe<Scalars['u128']>;
};

export type Dopewars_MarketConfig = {
  __typename?: 'dopewars_MarketConfig';
  burn_percentage?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['u8']>;
  tier1_price?: Maybe<Scalars['u256']>;
  tier2_price?: Maybe<Scalars['u256']>;
  tier3_price?: Maybe<Scalars['u256']>;
};

export type Dopewars_MarketConfigConnection = {
  __typename?: 'dopewars_MarketConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_MarketConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_MarketConfigEdge = {
  __typename?: 'dopewars_MarketConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_MarketConfig>;
};

export type Dopewars_MarketConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_MarketConfigOrderField;
};

export enum Dopewars_MarketConfigOrderField {
  BurnPercentage = 'BURN_PERCENTAGE',
  Key = 'KEY',
  Tier1Price = 'TIER1_PRICE',
  Tier2Price = 'TIER2_PRICE',
  Tier3Price = 'TIER3_PRICE'
}

export type Dopewars_MarketConfigWhereInput = {
  burn_percentage?: InputMaybe<Scalars['u8']>;
  burn_percentageEQ?: InputMaybe<Scalars['u8']>;
  burn_percentageGT?: InputMaybe<Scalars['u8']>;
  burn_percentageGTE?: InputMaybe<Scalars['u8']>;
  burn_percentageIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  burn_percentageLIKE?: InputMaybe<Scalars['u8']>;
  burn_percentageLT?: InputMaybe<Scalars['u8']>;
  burn_percentageLTE?: InputMaybe<Scalars['u8']>;
  burn_percentageNEQ?: InputMaybe<Scalars['u8']>;
  burn_percentageNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  burn_percentageNOTLIKE?: InputMaybe<Scalars['u8']>;
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyLIKE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u8']>;
  tier1_price?: InputMaybe<Scalars['u256']>;
  tier1_priceEQ?: InputMaybe<Scalars['u256']>;
  tier1_priceGT?: InputMaybe<Scalars['u256']>;
  tier1_priceGTE?: InputMaybe<Scalars['u256']>;
  tier1_priceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  tier1_priceLIKE?: InputMaybe<Scalars['u256']>;
  tier1_priceLT?: InputMaybe<Scalars['u256']>;
  tier1_priceLTE?: InputMaybe<Scalars['u256']>;
  tier1_priceNEQ?: InputMaybe<Scalars['u256']>;
  tier1_priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  tier1_priceNOTLIKE?: InputMaybe<Scalars['u256']>;
  tier2_price?: InputMaybe<Scalars['u256']>;
  tier2_priceEQ?: InputMaybe<Scalars['u256']>;
  tier2_priceGT?: InputMaybe<Scalars['u256']>;
  tier2_priceGTE?: InputMaybe<Scalars['u256']>;
  tier2_priceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  tier2_priceLIKE?: InputMaybe<Scalars['u256']>;
  tier2_priceLT?: InputMaybe<Scalars['u256']>;
  tier2_priceLTE?: InputMaybe<Scalars['u256']>;
  tier2_priceNEQ?: InputMaybe<Scalars['u256']>;
  tier2_priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  tier2_priceNOTLIKE?: InputMaybe<Scalars['u256']>;
  tier3_price?: InputMaybe<Scalars['u256']>;
  tier3_priceEQ?: InputMaybe<Scalars['u256']>;
  tier3_priceGT?: InputMaybe<Scalars['u256']>;
  tier3_priceGTE?: InputMaybe<Scalars['u256']>;
  tier3_priceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  tier3_priceLIKE?: InputMaybe<Scalars['u256']>;
  tier3_priceLT?: InputMaybe<Scalars['u256']>;
  tier3_priceLTE?: InputMaybe<Scalars['u256']>;
  tier3_priceNEQ?: InputMaybe<Scalars['u256']>;
  tier3_priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  tier3_priceNOTLIKE?: InputMaybe<Scalars['u256']>;
};

export type Dopewars_NewHighScore = {
  __typename?: 'dopewars_NewHighScore';
  cash?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  hustler_token_id?: Maybe<Scalars['u64']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  player_name?: Maybe<Scalars['felt252']>;
  reputation?: Maybe<Scalars['u8']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_NewHighScoreConnection = {
  __typename?: 'dopewars_NewHighScoreConnection';
  edges?: Maybe<Array<Maybe<Dopewars_NewHighScoreEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_NewHighScoreEdge = {
  __typename?: 'dopewars_NewHighScoreEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_NewHighScore>;
};

export type Dopewars_NewHighScoreOrder = {
  direction: OrderDirection;
  field: Dopewars_NewHighScoreOrderField;
};

export enum Dopewars_NewHighScoreOrderField {
  Cash = 'CASH',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  HustlerTokenId = 'HUSTLER_TOKEN_ID',
  PlayerId = 'PLAYER_ID',
  PlayerName = 'PLAYER_NAME',
  Reputation = 'REPUTATION',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_NewHighScoreWhereInput = {
  cash?: InputMaybe<Scalars['u32']>;
  cashEQ?: InputMaybe<Scalars['u32']>;
  cashGT?: InputMaybe<Scalars['u32']>;
  cashGTE?: InputMaybe<Scalars['u32']>;
  cashIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashLIKE?: InputMaybe<Scalars['u32']>;
  cashLT?: InputMaybe<Scalars['u32']>;
  cashLTE?: InputMaybe<Scalars['u32']>;
  cashNEQ?: InputMaybe<Scalars['u32']>;
  cashNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cashNOTLIKE?: InputMaybe<Scalars['u32']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  hustler_token_id?: InputMaybe<Scalars['u64']>;
  hustler_token_idEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idGT?: InputMaybe<Scalars['u64']>;
  hustler_token_idGTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idLIKE?: InputMaybe<Scalars['u64']>;
  hustler_token_idLT?: InputMaybe<Scalars['u64']>;
  hustler_token_idLTE?: InputMaybe<Scalars['u64']>;
  hustler_token_idNEQ?: InputMaybe<Scalars['u64']>;
  hustler_token_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  hustler_token_idNOTLIKE?: InputMaybe<Scalars['u64']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_name?: InputMaybe<Scalars['felt252']>;
  player_nameEQ?: InputMaybe<Scalars['felt252']>;
  player_nameGT?: InputMaybe<Scalars['felt252']>;
  player_nameGTE?: InputMaybe<Scalars['felt252']>;
  player_nameIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameLIKE?: InputMaybe<Scalars['felt252']>;
  player_nameLT?: InputMaybe<Scalars['felt252']>;
  player_nameLTE?: InputMaybe<Scalars['felt252']>;
  player_nameNEQ?: InputMaybe<Scalars['felt252']>;
  player_nameNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_nameNOTLIKE?: InputMaybe<Scalars['felt252']>;
  reputation?: InputMaybe<Scalars['u8']>;
  reputationEQ?: InputMaybe<Scalars['u8']>;
  reputationGT?: InputMaybe<Scalars['u8']>;
  reputationGTE?: InputMaybe<Scalars['u8']>;
  reputationIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationLIKE?: InputMaybe<Scalars['u8']>;
  reputationLT?: InputMaybe<Scalars['u8']>;
  reputationLTE?: InputMaybe<Scalars['u8']>;
  reputationNEQ?: InputMaybe<Scalars['u8']>;
  reputationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  reputationNOTLIKE?: InputMaybe<Scalars['u8']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_NewSeason = {
  __typename?: 'dopewars_NewSeason';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['u16']>;
  season_version?: Maybe<Scalars['u16']>;
};

export type Dopewars_NewSeasonConnection = {
  __typename?: 'dopewars_NewSeasonConnection';
  edges?: Maybe<Array<Maybe<Dopewars_NewSeasonEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_NewSeasonEdge = {
  __typename?: 'dopewars_NewSeasonEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_NewSeason>;
};

export type Dopewars_NewSeasonOrder = {
  direction: OrderDirection;
  field: Dopewars_NewSeasonOrderField;
};

export enum Dopewars_NewSeasonOrderField {
  Key = 'KEY',
  SeasonVersion = 'SEASON_VERSION'
}

export type Dopewars_NewSeasonWhereInput = {
  key?: InputMaybe<Scalars['u16']>;
  keyEQ?: InputMaybe<Scalars['u16']>;
  keyGT?: InputMaybe<Scalars['u16']>;
  keyGTE?: InputMaybe<Scalars['u16']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  keyLIKE?: InputMaybe<Scalars['u16']>;
  keyLT?: InputMaybe<Scalars['u16']>;
  keyLTE?: InputMaybe<Scalars['u16']>;
  keyNEQ?: InputMaybe<Scalars['u16']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_OptionContractAddress = {
  __typename?: 'dopewars_OptionContractAddress';
  Some?: Maybe<Scalars['ContractAddress']>;
  option?: Maybe<Scalars['Enum']>;
};

export type Dopewars_Optionfelt252 = {
  __typename?: 'dopewars_Optionfelt252';
  Some?: Maybe<Scalars['felt252']>;
  option?: Maybe<Scalars['Enum']>;
};

export type Dopewars_PaymentConfig = {
  __typename?: 'dopewars_PaymentConfig';
  base_price?: Maybe<Scalars['u256']>;
  burn_percentage?: Maybe<Scalars['u8']>;
  ekubo_positions?: Maybe<Scalars['ContractAddress']>;
  ekubo_router?: Maybe<Scalars['ContractAddress']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['u8']>;
  pool_extension?: Maybe<Scalars['ContractAddress']>;
  pool_fee?: Maybe<Scalars['u128']>;
  pool_sqrt?: Maybe<Scalars['u256']>;
  pool_tick_spacing?: Maybe<Scalars['u128']>;
  treasury_address?: Maybe<Scalars['ContractAddress']>;
  treasury_percentage?: Maybe<Scalars['u8']>;
  usdc?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_PaymentConfigConnection = {
  __typename?: 'dopewars_PaymentConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_PaymentConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_PaymentConfigEdge = {
  __typename?: 'dopewars_PaymentConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_PaymentConfig>;
};

export type Dopewars_PaymentConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_PaymentConfigOrderField;
};

export enum Dopewars_PaymentConfigOrderField {
  BasePrice = 'BASE_PRICE',
  BurnPercentage = 'BURN_PERCENTAGE',
  EkuboPositions = 'EKUBO_POSITIONS',
  EkuboRouter = 'EKUBO_ROUTER',
  Key = 'KEY',
  PoolExtension = 'POOL_EXTENSION',
  PoolFee = 'POOL_FEE',
  PoolSqrt = 'POOL_SQRT',
  PoolTickSpacing = 'POOL_TICK_SPACING',
  TreasuryAddress = 'TREASURY_ADDRESS',
  TreasuryPercentage = 'TREASURY_PERCENTAGE',
  Usdc = 'USDC'
}

export type Dopewars_PaymentConfigWhereInput = {
  base_price?: InputMaybe<Scalars['u256']>;
  base_priceEQ?: InputMaybe<Scalars['u256']>;
  base_priceGT?: InputMaybe<Scalars['u256']>;
  base_priceGTE?: InputMaybe<Scalars['u256']>;
  base_priceIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  base_priceLIKE?: InputMaybe<Scalars['u256']>;
  base_priceLT?: InputMaybe<Scalars['u256']>;
  base_priceLTE?: InputMaybe<Scalars['u256']>;
  base_priceNEQ?: InputMaybe<Scalars['u256']>;
  base_priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  base_priceNOTLIKE?: InputMaybe<Scalars['u256']>;
  burn_percentage?: InputMaybe<Scalars['u8']>;
  burn_percentageEQ?: InputMaybe<Scalars['u8']>;
  burn_percentageGT?: InputMaybe<Scalars['u8']>;
  burn_percentageGTE?: InputMaybe<Scalars['u8']>;
  burn_percentageIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  burn_percentageLIKE?: InputMaybe<Scalars['u8']>;
  burn_percentageLT?: InputMaybe<Scalars['u8']>;
  burn_percentageLTE?: InputMaybe<Scalars['u8']>;
  burn_percentageNEQ?: InputMaybe<Scalars['u8']>;
  burn_percentageNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  burn_percentageNOTLIKE?: InputMaybe<Scalars['u8']>;
  ekubo_positions?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsEQ?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsGT?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsGTE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ekubo_positionsLIKE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsLT?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsLTE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsNEQ?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_positionsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ekubo_positionsNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_router?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerEQ?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerGT?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerGTE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ekubo_routerLIKE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerLT?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerLTE?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerNEQ?: InputMaybe<Scalars['ContractAddress']>;
  ekubo_routerNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  ekubo_routerNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyLIKE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u8']>;
  pool_extension?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionEQ?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionGT?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionGTE?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  pool_extensionLIKE?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionLT?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionLTE?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionNEQ?: InputMaybe<Scalars['ContractAddress']>;
  pool_extensionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  pool_extensionNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  pool_fee?: InputMaybe<Scalars['u128']>;
  pool_feeEQ?: InputMaybe<Scalars['u128']>;
  pool_feeGT?: InputMaybe<Scalars['u128']>;
  pool_feeGTE?: InputMaybe<Scalars['u128']>;
  pool_feeIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  pool_feeLIKE?: InputMaybe<Scalars['u128']>;
  pool_feeLT?: InputMaybe<Scalars['u128']>;
  pool_feeLTE?: InputMaybe<Scalars['u128']>;
  pool_feeNEQ?: InputMaybe<Scalars['u128']>;
  pool_feeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  pool_feeNOTLIKE?: InputMaybe<Scalars['u128']>;
  pool_sqrt?: InputMaybe<Scalars['u256']>;
  pool_sqrtEQ?: InputMaybe<Scalars['u256']>;
  pool_sqrtGT?: InputMaybe<Scalars['u256']>;
  pool_sqrtGTE?: InputMaybe<Scalars['u256']>;
  pool_sqrtIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  pool_sqrtLIKE?: InputMaybe<Scalars['u256']>;
  pool_sqrtLT?: InputMaybe<Scalars['u256']>;
  pool_sqrtLTE?: InputMaybe<Scalars['u256']>;
  pool_sqrtNEQ?: InputMaybe<Scalars['u256']>;
  pool_sqrtNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u256']>>>;
  pool_sqrtNOTLIKE?: InputMaybe<Scalars['u256']>;
  pool_tick_spacing?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingEQ?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingGT?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingGTE?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  pool_tick_spacingLIKE?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingLT?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingLTE?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingNEQ?: InputMaybe<Scalars['u128']>;
  pool_tick_spacingNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  pool_tick_spacingNOTLIKE?: InputMaybe<Scalars['u128']>;
  treasury_address?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressEQ?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressGT?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressGTE?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  treasury_addressLIKE?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressLT?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressLTE?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressNEQ?: InputMaybe<Scalars['ContractAddress']>;
  treasury_addressNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  treasury_addressNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  treasury_percentage?: InputMaybe<Scalars['u8']>;
  treasury_percentageEQ?: InputMaybe<Scalars['u8']>;
  treasury_percentageGT?: InputMaybe<Scalars['u8']>;
  treasury_percentageGTE?: InputMaybe<Scalars['u8']>;
  treasury_percentageIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  treasury_percentageLIKE?: InputMaybe<Scalars['u8']>;
  treasury_percentageLT?: InputMaybe<Scalars['u8']>;
  treasury_percentageLTE?: InputMaybe<Scalars['u8']>;
  treasury_percentageNEQ?: InputMaybe<Scalars['u8']>;
  treasury_percentageNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  treasury_percentageNOTLIKE?: InputMaybe<Scalars['u8']>;
  usdc?: InputMaybe<Scalars['ContractAddress']>;
  usdcEQ?: InputMaybe<Scalars['ContractAddress']>;
  usdcGT?: InputMaybe<Scalars['ContractAddress']>;
  usdcGTE?: InputMaybe<Scalars['ContractAddress']>;
  usdcIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  usdcLIKE?: InputMaybe<Scalars['ContractAddress']>;
  usdcLT?: InputMaybe<Scalars['ContractAddress']>;
  usdcLTE?: InputMaybe<Scalars['ContractAddress']>;
  usdcNEQ?: InputMaybe<Scalars['ContractAddress']>;
  usdcNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  usdcNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_RyoAddress = {
  __typename?: 'dopewars_RyoAddress';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  key?: Maybe<Scalars['u8']>;
  paper?: Maybe<Scalars['ContractAddress']>;
  treasury?: Maybe<Scalars['ContractAddress']>;
  vrf?: Maybe<Scalars['ContractAddress']>;
};

export type Dopewars_RyoAddressConnection = {
  __typename?: 'dopewars_RyoAddressConnection';
  edges?: Maybe<Array<Maybe<Dopewars_RyoAddressEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_RyoAddressEdge = {
  __typename?: 'dopewars_RyoAddressEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_RyoAddress>;
};

export type Dopewars_RyoAddressOrder = {
  direction: OrderDirection;
  field: Dopewars_RyoAddressOrderField;
};

export enum Dopewars_RyoAddressOrderField {
  Key = 'KEY',
  Paper = 'PAPER',
  Treasury = 'TREASURY',
  Vrf = 'VRF'
}

export type Dopewars_RyoAddressWhereInput = {
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyLIKE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u8']>;
  paper?: InputMaybe<Scalars['ContractAddress']>;
  paperEQ?: InputMaybe<Scalars['ContractAddress']>;
  paperGT?: InputMaybe<Scalars['ContractAddress']>;
  paperGTE?: InputMaybe<Scalars['ContractAddress']>;
  paperIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  paperLIKE?: InputMaybe<Scalars['ContractAddress']>;
  paperLT?: InputMaybe<Scalars['ContractAddress']>;
  paperLTE?: InputMaybe<Scalars['ContractAddress']>;
  paperNEQ?: InputMaybe<Scalars['ContractAddress']>;
  paperNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  paperNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  treasury?: InputMaybe<Scalars['ContractAddress']>;
  treasuryEQ?: InputMaybe<Scalars['ContractAddress']>;
  treasuryGT?: InputMaybe<Scalars['ContractAddress']>;
  treasuryGTE?: InputMaybe<Scalars['ContractAddress']>;
  treasuryIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  treasuryLIKE?: InputMaybe<Scalars['ContractAddress']>;
  treasuryLT?: InputMaybe<Scalars['ContractAddress']>;
  treasuryLTE?: InputMaybe<Scalars['ContractAddress']>;
  treasuryNEQ?: InputMaybe<Scalars['ContractAddress']>;
  treasuryNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  treasuryNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  vrf?: InputMaybe<Scalars['ContractAddress']>;
  vrfEQ?: InputMaybe<Scalars['ContractAddress']>;
  vrfGT?: InputMaybe<Scalars['ContractAddress']>;
  vrfGTE?: InputMaybe<Scalars['ContractAddress']>;
  vrfIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  vrfLIKE?: InputMaybe<Scalars['ContractAddress']>;
  vrfLT?: InputMaybe<Scalars['ContractAddress']>;
  vrfLTE?: InputMaybe<Scalars['ContractAddress']>;
  vrfNEQ?: InputMaybe<Scalars['ContractAddress']>;
  vrfNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  vrfNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
};

export type Dopewars_RyoConfig = {
  __typename?: 'dopewars_RyoConfig';
  average_score?: Maybe<Scalars['u64']>;
  average_weight?: Maybe<Scalars['u16']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  f2p_hustlers?: Maybe<Scalars['bool']>;
  initialized?: Maybe<Scalars['bool']>;
  key?: Maybe<Scalars['u8']>;
  max_score?: Maybe<Scalars['u32']>;
  paused?: Maybe<Scalars['bool']>;
  play_with_hustlers?: Maybe<Scalars['bool']>;
  play_with_loot?: Maybe<Scalars['bool']>;
  season_duration?: Maybe<Scalars['u32']>;
  season_time_limit?: Maybe<Scalars['u16']>;
  season_version?: Maybe<Scalars['u16']>;
  target_supply?: Maybe<Scalars['u64']>;
};

export type Dopewars_RyoConfigConnection = {
  __typename?: 'dopewars_RyoConfigConnection';
  edges?: Maybe<Array<Maybe<Dopewars_RyoConfigEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_RyoConfigEdge = {
  __typename?: 'dopewars_RyoConfigEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_RyoConfig>;
};

export type Dopewars_RyoConfigOrder = {
  direction: OrderDirection;
  field: Dopewars_RyoConfigOrderField;
};

export enum Dopewars_RyoConfigOrderField {
  AverageScore = 'AVERAGE_SCORE',
  AverageWeight = 'AVERAGE_WEIGHT',
  F2PHustlers = 'F2P_HUSTLERS',
  Initialized = 'INITIALIZED',
  Key = 'KEY',
  MaxScore = 'MAX_SCORE',
  Paused = 'PAUSED',
  PlayWithHustlers = 'PLAY_WITH_HUSTLERS',
  PlayWithLoot = 'PLAY_WITH_LOOT',
  SeasonDuration = 'SEASON_DURATION',
  SeasonTimeLimit = 'SEASON_TIME_LIMIT',
  SeasonVersion = 'SEASON_VERSION',
  TargetSupply = 'TARGET_SUPPLY'
}

export type Dopewars_RyoConfigWhereInput = {
  average_score?: InputMaybe<Scalars['u64']>;
  average_scoreEQ?: InputMaybe<Scalars['u64']>;
  average_scoreGT?: InputMaybe<Scalars['u64']>;
  average_scoreGTE?: InputMaybe<Scalars['u64']>;
  average_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  average_scoreLIKE?: InputMaybe<Scalars['u64']>;
  average_scoreLT?: InputMaybe<Scalars['u64']>;
  average_scoreLTE?: InputMaybe<Scalars['u64']>;
  average_scoreNEQ?: InputMaybe<Scalars['u64']>;
  average_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  average_scoreNOTLIKE?: InputMaybe<Scalars['u64']>;
  average_weight?: InputMaybe<Scalars['u16']>;
  average_weightEQ?: InputMaybe<Scalars['u16']>;
  average_weightGT?: InputMaybe<Scalars['u16']>;
  average_weightGTE?: InputMaybe<Scalars['u16']>;
  average_weightIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  average_weightLIKE?: InputMaybe<Scalars['u16']>;
  average_weightLT?: InputMaybe<Scalars['u16']>;
  average_weightLTE?: InputMaybe<Scalars['u16']>;
  average_weightNEQ?: InputMaybe<Scalars['u16']>;
  average_weightNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  average_weightNOTLIKE?: InputMaybe<Scalars['u16']>;
  f2p_hustlers?: InputMaybe<Scalars['bool']>;
  initialized?: InputMaybe<Scalars['bool']>;
  key?: InputMaybe<Scalars['u8']>;
  keyEQ?: InputMaybe<Scalars['u8']>;
  keyGT?: InputMaybe<Scalars['u8']>;
  keyGTE?: InputMaybe<Scalars['u8']>;
  keyIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyLIKE?: InputMaybe<Scalars['u8']>;
  keyLT?: InputMaybe<Scalars['u8']>;
  keyLTE?: InputMaybe<Scalars['u8']>;
  keyNEQ?: InputMaybe<Scalars['u8']>;
  keyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  keyNOTLIKE?: InputMaybe<Scalars['u8']>;
  max_score?: InputMaybe<Scalars['u32']>;
  max_scoreEQ?: InputMaybe<Scalars['u32']>;
  max_scoreGT?: InputMaybe<Scalars['u32']>;
  max_scoreGTE?: InputMaybe<Scalars['u32']>;
  max_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  max_scoreLIKE?: InputMaybe<Scalars['u32']>;
  max_scoreLT?: InputMaybe<Scalars['u32']>;
  max_scoreLTE?: InputMaybe<Scalars['u32']>;
  max_scoreNEQ?: InputMaybe<Scalars['u32']>;
  max_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  max_scoreNOTLIKE?: InputMaybe<Scalars['u32']>;
  paused?: InputMaybe<Scalars['bool']>;
  play_with_hustlers?: InputMaybe<Scalars['bool']>;
  play_with_loot?: InputMaybe<Scalars['bool']>;
  season_duration?: InputMaybe<Scalars['u32']>;
  season_durationEQ?: InputMaybe<Scalars['u32']>;
  season_durationGT?: InputMaybe<Scalars['u32']>;
  season_durationGTE?: InputMaybe<Scalars['u32']>;
  season_durationIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationLIKE?: InputMaybe<Scalars['u32']>;
  season_durationLT?: InputMaybe<Scalars['u32']>;
  season_durationLTE?: InputMaybe<Scalars['u32']>;
  season_durationNEQ?: InputMaybe<Scalars['u32']>;
  season_durationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationNOTLIKE?: InputMaybe<Scalars['u32']>;
  season_time_limit?: InputMaybe<Scalars['u16']>;
  season_time_limitEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitGT?: InputMaybe<Scalars['u16']>;
  season_time_limitGTE?: InputMaybe<Scalars['u16']>;
  season_time_limitIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitLIKE?: InputMaybe<Scalars['u16']>;
  season_time_limitLT?: InputMaybe<Scalars['u16']>;
  season_time_limitLTE?: InputMaybe<Scalars['u16']>;
  season_time_limitNEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitNOTLIKE?: InputMaybe<Scalars['u16']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
  target_supply?: InputMaybe<Scalars['u64']>;
  target_supplyEQ?: InputMaybe<Scalars['u64']>;
  target_supplyGT?: InputMaybe<Scalars['u64']>;
  target_supplyGTE?: InputMaybe<Scalars['u64']>;
  target_supplyIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  target_supplyLIKE?: InputMaybe<Scalars['u64']>;
  target_supplyLT?: InputMaybe<Scalars['u64']>;
  target_supplyLTE?: InputMaybe<Scalars['u64']>;
  target_supplyNEQ?: InputMaybe<Scalars['u64']>;
  target_supplyNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  target_supplyNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_Season = {
  __typename?: 'dopewars_Season';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  high_score?: Maybe<Scalars['u32']>;
  next_version_timestamp?: Maybe<Scalars['u64']>;
  season_duration?: Maybe<Scalars['u32']>;
  season_time_limit?: Maybe<Scalars['u16']>;
  version?: Maybe<Scalars['u16']>;
};

export type Dopewars_SeasonConnection = {
  __typename?: 'dopewars_SeasonConnection';
  edges?: Maybe<Array<Maybe<Dopewars_SeasonEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_SeasonEdge = {
  __typename?: 'dopewars_SeasonEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Season>;
};

export type Dopewars_SeasonOrder = {
  direction: OrderDirection;
  field: Dopewars_SeasonOrderField;
};

export enum Dopewars_SeasonOrderField {
  HighScore = 'HIGH_SCORE',
  NextVersionTimestamp = 'NEXT_VERSION_TIMESTAMP',
  SeasonDuration = 'SEASON_DURATION',
  SeasonTimeLimit = 'SEASON_TIME_LIMIT',
  Version = 'VERSION'
}

export type Dopewars_SeasonSettings = {
  __typename?: 'dopewars_SeasonSettings';
  cash_mode?: Maybe<Scalars['Enum']>;
  drugs_mode?: Maybe<Scalars['Enum']>;
  encounters_mode?: Maybe<Scalars['Enum']>;
  encounters_odds_mode?: Maybe<Scalars['Enum']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  health_mode?: Maybe<Scalars['Enum']>;
  season_version?: Maybe<Scalars['u16']>;
  turns_mode?: Maybe<Scalars['Enum']>;
  wanted_mode?: Maybe<Scalars['Enum']>;
};

export type Dopewars_SeasonSettingsConnection = {
  __typename?: 'dopewars_SeasonSettingsConnection';
  edges?: Maybe<Array<Maybe<Dopewars_SeasonSettingsEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_SeasonSettingsEdge = {
  __typename?: 'dopewars_SeasonSettingsEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_SeasonSettings>;
};

export type Dopewars_SeasonSettingsOrder = {
  direction: OrderDirection;
  field: Dopewars_SeasonSettingsOrderField;
};

export enum Dopewars_SeasonSettingsOrderField {
  CashMode = 'CASH_MODE',
  DrugsMode = 'DRUGS_MODE',
  EncountersMode = 'ENCOUNTERS_MODE',
  EncountersOddsMode = 'ENCOUNTERS_ODDS_MODE',
  HealthMode = 'HEALTH_MODE',
  SeasonVersion = 'SEASON_VERSION',
  TurnsMode = 'TURNS_MODE',
  WantedMode = 'WANTED_MODE'
}

export type Dopewars_SeasonSettingsWhereInput = {
  cash_mode?: InputMaybe<Scalars['Enum']>;
  drugs_mode?: InputMaybe<Scalars['Enum']>;
  encounters_mode?: InputMaybe<Scalars['Enum']>;
  encounters_odds_mode?: InputMaybe<Scalars['Enum']>;
  health_mode?: InputMaybe<Scalars['Enum']>;
  season_version?: InputMaybe<Scalars['u16']>;
  season_versionEQ?: InputMaybe<Scalars['u16']>;
  season_versionGT?: InputMaybe<Scalars['u16']>;
  season_versionGTE?: InputMaybe<Scalars['u16']>;
  season_versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionLIKE?: InputMaybe<Scalars['u16']>;
  season_versionLT?: InputMaybe<Scalars['u16']>;
  season_versionLTE?: InputMaybe<Scalars['u16']>;
  season_versionNEQ?: InputMaybe<Scalars['u16']>;
  season_versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_versionNOTLIKE?: InputMaybe<Scalars['u16']>;
  turns_mode?: InputMaybe<Scalars['Enum']>;
  wanted_mode?: InputMaybe<Scalars['Enum']>;
};

export type Dopewars_SeasonWhereInput = {
  high_score?: InputMaybe<Scalars['u32']>;
  high_scoreEQ?: InputMaybe<Scalars['u32']>;
  high_scoreGT?: InputMaybe<Scalars['u32']>;
  high_scoreGTE?: InputMaybe<Scalars['u32']>;
  high_scoreIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  high_scoreLIKE?: InputMaybe<Scalars['u32']>;
  high_scoreLT?: InputMaybe<Scalars['u32']>;
  high_scoreLTE?: InputMaybe<Scalars['u32']>;
  high_scoreNEQ?: InputMaybe<Scalars['u32']>;
  high_scoreNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  high_scoreNOTLIKE?: InputMaybe<Scalars['u32']>;
  next_version_timestamp?: InputMaybe<Scalars['u64']>;
  next_version_timestampEQ?: InputMaybe<Scalars['u64']>;
  next_version_timestampGT?: InputMaybe<Scalars['u64']>;
  next_version_timestampGTE?: InputMaybe<Scalars['u64']>;
  next_version_timestampIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  next_version_timestampLIKE?: InputMaybe<Scalars['u64']>;
  next_version_timestampLT?: InputMaybe<Scalars['u64']>;
  next_version_timestampLTE?: InputMaybe<Scalars['u64']>;
  next_version_timestampNEQ?: InputMaybe<Scalars['u64']>;
  next_version_timestampNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  next_version_timestampNOTLIKE?: InputMaybe<Scalars['u64']>;
  season_duration?: InputMaybe<Scalars['u32']>;
  season_durationEQ?: InputMaybe<Scalars['u32']>;
  season_durationGT?: InputMaybe<Scalars['u32']>;
  season_durationGTE?: InputMaybe<Scalars['u32']>;
  season_durationIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationLIKE?: InputMaybe<Scalars['u32']>;
  season_durationLT?: InputMaybe<Scalars['u32']>;
  season_durationLTE?: InputMaybe<Scalars['u32']>;
  season_durationNEQ?: InputMaybe<Scalars['u32']>;
  season_durationNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  season_durationNOTLIKE?: InputMaybe<Scalars['u32']>;
  season_time_limit?: InputMaybe<Scalars['u16']>;
  season_time_limitEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitGT?: InputMaybe<Scalars['u16']>;
  season_time_limitGTE?: InputMaybe<Scalars['u16']>;
  season_time_limitIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitLIKE?: InputMaybe<Scalars['u16']>;
  season_time_limitLT?: InputMaybe<Scalars['u16']>;
  season_time_limitLTE?: InputMaybe<Scalars['u16']>;
  season_time_limitNEQ?: InputMaybe<Scalars['u16']>;
  season_time_limitNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  season_time_limitNOTLIKE?: InputMaybe<Scalars['u16']>;
  version?: InputMaybe<Scalars['u16']>;
  versionEQ?: InputMaybe<Scalars['u16']>;
  versionGT?: InputMaybe<Scalars['u16']>;
  versionGTE?: InputMaybe<Scalars['u16']>;
  versionIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  versionLIKE?: InputMaybe<Scalars['u16']>;
  versionLT?: InputMaybe<Scalars['u16']>;
  versionLTE?: InputMaybe<Scalars['u16']>;
  versionNEQ?: InputMaybe<Scalars['u16']>;
  versionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  versionNOTLIKE?: InputMaybe<Scalars['u16']>;
};

export type Dopewars_Starterpack = {
  __typename?: 'dopewars_Starterpack';
  bundle_id?: Maybe<Scalars['u32']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  gear_clothes?: Maybe<Scalars['u8']>;
  gear_feet?: Maybe<Scalars['u8']>;
  gear_transport?: Maybe<Scalars['u8']>;
  gear_weapon?: Maybe<Scalars['u8']>;
  hustler_template_id?: Maybe<Scalars['u8']>;
  stake_multiplier?: Maybe<Scalars['u8']>;
};

export type Dopewars_StarterpackConnection = {
  __typename?: 'dopewars_StarterpackConnection';
  edges?: Maybe<Array<Maybe<Dopewars_StarterpackEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_StarterpackEdge = {
  __typename?: 'dopewars_StarterpackEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Starterpack>;
};

export type Dopewars_StarterpackOrder = {
  direction: OrderDirection;
  field: Dopewars_StarterpackOrderField;
};

export enum Dopewars_StarterpackOrderField {
  BundleId = 'BUNDLE_ID',
  GearClothes = 'GEAR_CLOTHES',
  GearFeet = 'GEAR_FEET',
  GearTransport = 'GEAR_TRANSPORT',
  GearWeapon = 'GEAR_WEAPON',
  HustlerTemplateId = 'HUSTLER_TEMPLATE_ID',
  StakeMultiplier = 'STAKE_MULTIPLIER'
}

export type Dopewars_StarterpackWhereInput = {
  bundle_id?: InputMaybe<Scalars['u32']>;
  bundle_idEQ?: InputMaybe<Scalars['u32']>;
  bundle_idGT?: InputMaybe<Scalars['u32']>;
  bundle_idGTE?: InputMaybe<Scalars['u32']>;
  bundle_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idLIKE?: InputMaybe<Scalars['u32']>;
  bundle_idLT?: InputMaybe<Scalars['u32']>;
  bundle_idLTE?: InputMaybe<Scalars['u32']>;
  bundle_idNEQ?: InputMaybe<Scalars['u32']>;
  bundle_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  bundle_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  gear_clothes?: InputMaybe<Scalars['u8']>;
  gear_clothesEQ?: InputMaybe<Scalars['u8']>;
  gear_clothesGT?: InputMaybe<Scalars['u8']>;
  gear_clothesGTE?: InputMaybe<Scalars['u8']>;
  gear_clothesIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_clothesLIKE?: InputMaybe<Scalars['u8']>;
  gear_clothesLT?: InputMaybe<Scalars['u8']>;
  gear_clothesLTE?: InputMaybe<Scalars['u8']>;
  gear_clothesNEQ?: InputMaybe<Scalars['u8']>;
  gear_clothesNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_clothesNOTLIKE?: InputMaybe<Scalars['u8']>;
  gear_feet?: InputMaybe<Scalars['u8']>;
  gear_feetEQ?: InputMaybe<Scalars['u8']>;
  gear_feetGT?: InputMaybe<Scalars['u8']>;
  gear_feetGTE?: InputMaybe<Scalars['u8']>;
  gear_feetIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_feetLIKE?: InputMaybe<Scalars['u8']>;
  gear_feetLT?: InputMaybe<Scalars['u8']>;
  gear_feetLTE?: InputMaybe<Scalars['u8']>;
  gear_feetNEQ?: InputMaybe<Scalars['u8']>;
  gear_feetNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_feetNOTLIKE?: InputMaybe<Scalars['u8']>;
  gear_transport?: InputMaybe<Scalars['u8']>;
  gear_transportEQ?: InputMaybe<Scalars['u8']>;
  gear_transportGT?: InputMaybe<Scalars['u8']>;
  gear_transportGTE?: InputMaybe<Scalars['u8']>;
  gear_transportIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_transportLIKE?: InputMaybe<Scalars['u8']>;
  gear_transportLT?: InputMaybe<Scalars['u8']>;
  gear_transportLTE?: InputMaybe<Scalars['u8']>;
  gear_transportNEQ?: InputMaybe<Scalars['u8']>;
  gear_transportNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_transportNOTLIKE?: InputMaybe<Scalars['u8']>;
  gear_weapon?: InputMaybe<Scalars['u8']>;
  gear_weaponEQ?: InputMaybe<Scalars['u8']>;
  gear_weaponGT?: InputMaybe<Scalars['u8']>;
  gear_weaponGTE?: InputMaybe<Scalars['u8']>;
  gear_weaponIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_weaponLIKE?: InputMaybe<Scalars['u8']>;
  gear_weaponLT?: InputMaybe<Scalars['u8']>;
  gear_weaponLTE?: InputMaybe<Scalars['u8']>;
  gear_weaponNEQ?: InputMaybe<Scalars['u8']>;
  gear_weaponNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  gear_weaponNOTLIKE?: InputMaybe<Scalars['u8']>;
  hustler_template_id?: InputMaybe<Scalars['u8']>;
  hustler_template_idEQ?: InputMaybe<Scalars['u8']>;
  hustler_template_idGT?: InputMaybe<Scalars['u8']>;
  hustler_template_idGTE?: InputMaybe<Scalars['u8']>;
  hustler_template_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  hustler_template_idLIKE?: InputMaybe<Scalars['u8']>;
  hustler_template_idLT?: InputMaybe<Scalars['u8']>;
  hustler_template_idLTE?: InputMaybe<Scalars['u8']>;
  hustler_template_idNEQ?: InputMaybe<Scalars['u8']>;
  hustler_template_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  hustler_template_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  stake_multiplier?: InputMaybe<Scalars['u8']>;
  stake_multiplierEQ?: InputMaybe<Scalars['u8']>;
  stake_multiplierGT?: InputMaybe<Scalars['u8']>;
  stake_multiplierGTE?: InputMaybe<Scalars['u8']>;
  stake_multiplierIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  stake_multiplierLIKE?: InputMaybe<Scalars['u8']>;
  stake_multiplierLT?: InputMaybe<Scalars['u8']>;
  stake_multiplierLTE?: InputMaybe<Scalars['u8']>;
  stake_multiplierNEQ?: InputMaybe<Scalars['u8']>;
  stake_multiplierNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  stake_multiplierNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_Task = {
  __typename?: 'dopewars_Task';
  description?: Maybe<Scalars['ByteArray']>;
  id?: Maybe<Scalars['felt252']>;
  total?: Maybe<Scalars['u128']>;
};

export type Dopewars_TradeDrug = {
  __typename?: 'dopewars_TradeDrug';
  drug_id?: Maybe<Scalars['u8']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  is_buy?: Maybe<Scalars['bool']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  price?: Maybe<Scalars['u32']>;
  quantity?: Maybe<Scalars['u32']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_TradeDrugConnection = {
  __typename?: 'dopewars_TradeDrugConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TradeDrugEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TradeDrugEdge = {
  __typename?: 'dopewars_TradeDrugEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TradeDrug>;
};

export type Dopewars_TradeDrugOrder = {
  direction: OrderDirection;
  field: Dopewars_TradeDrugOrderField;
};

export enum Dopewars_TradeDrugOrderField {
  DrugId = 'DRUG_ID',
  GameId = 'GAME_ID',
  IsBuy = 'IS_BUY',
  PlayerId = 'PLAYER_ID',
  Price = 'PRICE',
  Quantity = 'QUANTITY',
  Turn = 'TURN'
}

export type Dopewars_TradeDrugWhereInput = {
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  is_buy?: InputMaybe<Scalars['bool']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  price?: InputMaybe<Scalars['u32']>;
  priceEQ?: InputMaybe<Scalars['u32']>;
  priceGT?: InputMaybe<Scalars['u32']>;
  priceGTE?: InputMaybe<Scalars['u32']>;
  priceIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  priceLIKE?: InputMaybe<Scalars['u32']>;
  priceLT?: InputMaybe<Scalars['u32']>;
  priceLTE?: InputMaybe<Scalars['u32']>;
  priceNEQ?: InputMaybe<Scalars['u32']>;
  priceNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  priceNOTLIKE?: InputMaybe<Scalars['u32']>;
  quantity?: InputMaybe<Scalars['u32']>;
  quantityEQ?: InputMaybe<Scalars['u32']>;
  quantityGT?: InputMaybe<Scalars['u32']>;
  quantityGTE?: InputMaybe<Scalars['u32']>;
  quantityIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  quantityLIKE?: InputMaybe<Scalars['u32']>;
  quantityLT?: InputMaybe<Scalars['u32']>;
  quantityLTE?: InputMaybe<Scalars['u32']>;
  quantityNEQ?: InputMaybe<Scalars['u32']>;
  quantityNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  quantityNOTLIKE?: InputMaybe<Scalars['u32']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounter = {
  __typename?: 'dopewars_TravelEncounter';
  attack?: Maybe<Scalars['u8']>;
  defense?: Maybe<Scalars['u8']>;
  demand_pct?: Maybe<Scalars['u8']>;
  encounter?: Maybe<Scalars['felt252']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  health?: Maybe<Scalars['u8']>;
  level?: Maybe<Scalars['u8']>;
  payout?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  speed?: Maybe<Scalars['u8']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterConnection = {
  __typename?: 'dopewars_TravelEncounterConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TravelEncounterEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TravelEncounterEdge = {
  __typename?: 'dopewars_TravelEncounterEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TravelEncounter>;
};

export type Dopewars_TravelEncounterOrder = {
  direction: OrderDirection;
  field: Dopewars_TravelEncounterOrderField;
};

export enum Dopewars_TravelEncounterOrderField {
  Attack = 'ATTACK',
  Defense = 'DEFENSE',
  DemandPct = 'DEMAND_PCT',
  Encounter = 'ENCOUNTER',
  GameId = 'GAME_ID',
  Health = 'HEALTH',
  Level = 'LEVEL',
  Payout = 'PAYOUT',
  PlayerId = 'PLAYER_ID',
  Speed = 'SPEED',
  Turn = 'TURN'
}

export type Dopewars_TravelEncounterResult = {
  __typename?: 'dopewars_TravelEncounterResult';
  action?: Maybe<Scalars['Enum']>;
  cash_earnt?: Maybe<Scalars['u32']>;
  cash_loss?: Maybe<Scalars['u32']>;
  dmg_dealt?: Maybe<Array<Maybe<Dopewars_U8u8>>>;
  dmg_taken?: Maybe<Array<Maybe<Dopewars_U8u8>>>;
  drug_id?: Maybe<Scalars['u8']>;
  drug_loss?: Maybe<Array<Maybe<Scalars['u32']>>>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  outcome?: Maybe<Scalars['Enum']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  rep_neg?: Maybe<Scalars['u8']>;
  rep_pos?: Maybe<Scalars['u8']>;
  rounds?: Maybe<Scalars['u8']>;
  turn?: Maybe<Scalars['u8']>;
  turn_loss?: Maybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterResultConnection = {
  __typename?: 'dopewars_TravelEncounterResultConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TravelEncounterResultEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TravelEncounterResultEdge = {
  __typename?: 'dopewars_TravelEncounterResultEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TravelEncounterResult>;
};

export type Dopewars_TravelEncounterResultOrder = {
  direction: OrderDirection;
  field: Dopewars_TravelEncounterResultOrderField;
};

export enum Dopewars_TravelEncounterResultOrderField {
  Action = 'ACTION',
  CashEarnt = 'CASH_EARNT',
  CashLoss = 'CASH_LOSS',
  DmgDealt = 'DMG_DEALT',
  DmgTaken = 'DMG_TAKEN',
  DrugId = 'DRUG_ID',
  DrugLoss = 'DRUG_LOSS',
  GameId = 'GAME_ID',
  Outcome = 'OUTCOME',
  PlayerId = 'PLAYER_ID',
  RepNeg = 'REP_NEG',
  RepPos = 'REP_POS',
  Rounds = 'ROUNDS',
  Turn = 'TURN',
  TurnLoss = 'TURN_LOSS'
}

export type Dopewars_TravelEncounterResultWhereInput = {
  action?: InputMaybe<Scalars['Enum']>;
  cash_earnt?: InputMaybe<Scalars['u32']>;
  cash_earntEQ?: InputMaybe<Scalars['u32']>;
  cash_earntGT?: InputMaybe<Scalars['u32']>;
  cash_earntGTE?: InputMaybe<Scalars['u32']>;
  cash_earntIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_earntLIKE?: InputMaybe<Scalars['u32']>;
  cash_earntLT?: InputMaybe<Scalars['u32']>;
  cash_earntLTE?: InputMaybe<Scalars['u32']>;
  cash_earntNEQ?: InputMaybe<Scalars['u32']>;
  cash_earntNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_earntNOTLIKE?: InputMaybe<Scalars['u32']>;
  cash_loss?: InputMaybe<Scalars['u32']>;
  cash_lossEQ?: InputMaybe<Scalars['u32']>;
  cash_lossGT?: InputMaybe<Scalars['u32']>;
  cash_lossGTE?: InputMaybe<Scalars['u32']>;
  cash_lossIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_lossLIKE?: InputMaybe<Scalars['u32']>;
  cash_lossLT?: InputMaybe<Scalars['u32']>;
  cash_lossLTE?: InputMaybe<Scalars['u32']>;
  cash_lossNEQ?: InputMaybe<Scalars['u32']>;
  cash_lossNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  cash_lossNOTLIKE?: InputMaybe<Scalars['u32']>;
  drug_id?: InputMaybe<Scalars['u8']>;
  drug_idEQ?: InputMaybe<Scalars['u8']>;
  drug_idGT?: InputMaybe<Scalars['u8']>;
  drug_idGTE?: InputMaybe<Scalars['u8']>;
  drug_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idLIKE?: InputMaybe<Scalars['u8']>;
  drug_idLT?: InputMaybe<Scalars['u8']>;
  drug_idLTE?: InputMaybe<Scalars['u8']>;
  drug_idNEQ?: InputMaybe<Scalars['u8']>;
  drug_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  drug_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  outcome?: InputMaybe<Scalars['Enum']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  rep_neg?: InputMaybe<Scalars['u8']>;
  rep_negEQ?: InputMaybe<Scalars['u8']>;
  rep_negGT?: InputMaybe<Scalars['u8']>;
  rep_negGTE?: InputMaybe<Scalars['u8']>;
  rep_negIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_negLIKE?: InputMaybe<Scalars['u8']>;
  rep_negLT?: InputMaybe<Scalars['u8']>;
  rep_negLTE?: InputMaybe<Scalars['u8']>;
  rep_negNEQ?: InputMaybe<Scalars['u8']>;
  rep_negNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_negNOTLIKE?: InputMaybe<Scalars['u8']>;
  rep_pos?: InputMaybe<Scalars['u8']>;
  rep_posEQ?: InputMaybe<Scalars['u8']>;
  rep_posGT?: InputMaybe<Scalars['u8']>;
  rep_posGTE?: InputMaybe<Scalars['u8']>;
  rep_posIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_posLIKE?: InputMaybe<Scalars['u8']>;
  rep_posLT?: InputMaybe<Scalars['u8']>;
  rep_posLTE?: InputMaybe<Scalars['u8']>;
  rep_posNEQ?: InputMaybe<Scalars['u8']>;
  rep_posNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  rep_posNOTLIKE?: InputMaybe<Scalars['u8']>;
  rounds?: InputMaybe<Scalars['u8']>;
  roundsEQ?: InputMaybe<Scalars['u8']>;
  roundsGT?: InputMaybe<Scalars['u8']>;
  roundsGTE?: InputMaybe<Scalars['u8']>;
  roundsIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  roundsLIKE?: InputMaybe<Scalars['u8']>;
  roundsLT?: InputMaybe<Scalars['u8']>;
  roundsLTE?: InputMaybe<Scalars['u8']>;
  roundsNEQ?: InputMaybe<Scalars['u8']>;
  roundsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  roundsNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn_loss?: InputMaybe<Scalars['u8']>;
  turn_lossEQ?: InputMaybe<Scalars['u8']>;
  turn_lossGT?: InputMaybe<Scalars['u8']>;
  turn_lossGTE?: InputMaybe<Scalars['u8']>;
  turn_lossIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turn_lossLIKE?: InputMaybe<Scalars['u8']>;
  turn_lossLT?: InputMaybe<Scalars['u8']>;
  turn_lossLTE?: InputMaybe<Scalars['u8']>;
  turn_lossNEQ?: InputMaybe<Scalars['u8']>;
  turn_lossNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turn_lossNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_TravelEncounterWhereInput = {
  attack?: InputMaybe<Scalars['u8']>;
  attackEQ?: InputMaybe<Scalars['u8']>;
  attackGT?: InputMaybe<Scalars['u8']>;
  attackGTE?: InputMaybe<Scalars['u8']>;
  attackIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attackLIKE?: InputMaybe<Scalars['u8']>;
  attackLT?: InputMaybe<Scalars['u8']>;
  attackLTE?: InputMaybe<Scalars['u8']>;
  attackNEQ?: InputMaybe<Scalars['u8']>;
  attackNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  attackNOTLIKE?: InputMaybe<Scalars['u8']>;
  defense?: InputMaybe<Scalars['u8']>;
  defenseEQ?: InputMaybe<Scalars['u8']>;
  defenseGT?: InputMaybe<Scalars['u8']>;
  defenseGTE?: InputMaybe<Scalars['u8']>;
  defenseIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defenseLIKE?: InputMaybe<Scalars['u8']>;
  defenseLT?: InputMaybe<Scalars['u8']>;
  defenseLTE?: InputMaybe<Scalars['u8']>;
  defenseNEQ?: InputMaybe<Scalars['u8']>;
  defenseNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  defenseNOTLIKE?: InputMaybe<Scalars['u8']>;
  demand_pct?: InputMaybe<Scalars['u8']>;
  demand_pctEQ?: InputMaybe<Scalars['u8']>;
  demand_pctGT?: InputMaybe<Scalars['u8']>;
  demand_pctGTE?: InputMaybe<Scalars['u8']>;
  demand_pctIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  demand_pctLIKE?: InputMaybe<Scalars['u8']>;
  demand_pctLT?: InputMaybe<Scalars['u8']>;
  demand_pctLTE?: InputMaybe<Scalars['u8']>;
  demand_pctNEQ?: InputMaybe<Scalars['u8']>;
  demand_pctNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  demand_pctNOTLIKE?: InputMaybe<Scalars['u8']>;
  encounter?: InputMaybe<Scalars['felt252']>;
  encounterEQ?: InputMaybe<Scalars['felt252']>;
  encounterGT?: InputMaybe<Scalars['felt252']>;
  encounterGTE?: InputMaybe<Scalars['felt252']>;
  encounterIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  encounterLIKE?: InputMaybe<Scalars['felt252']>;
  encounterLT?: InputMaybe<Scalars['felt252']>;
  encounterLTE?: InputMaybe<Scalars['felt252']>;
  encounterNEQ?: InputMaybe<Scalars['felt252']>;
  encounterNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  encounterNOTLIKE?: InputMaybe<Scalars['felt252']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  health?: InputMaybe<Scalars['u8']>;
  healthEQ?: InputMaybe<Scalars['u8']>;
  healthGT?: InputMaybe<Scalars['u8']>;
  healthGTE?: InputMaybe<Scalars['u8']>;
  healthIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthLIKE?: InputMaybe<Scalars['u8']>;
  healthLT?: InputMaybe<Scalars['u8']>;
  healthLTE?: InputMaybe<Scalars['u8']>;
  healthNEQ?: InputMaybe<Scalars['u8']>;
  healthNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  healthNOTLIKE?: InputMaybe<Scalars['u8']>;
  level?: InputMaybe<Scalars['u8']>;
  levelEQ?: InputMaybe<Scalars['u8']>;
  levelGT?: InputMaybe<Scalars['u8']>;
  levelGTE?: InputMaybe<Scalars['u8']>;
  levelIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  levelLIKE?: InputMaybe<Scalars['u8']>;
  levelLT?: InputMaybe<Scalars['u8']>;
  levelLTE?: InputMaybe<Scalars['u8']>;
  levelNEQ?: InputMaybe<Scalars['u8']>;
  levelNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  levelNOTLIKE?: InputMaybe<Scalars['u8']>;
  payout?: InputMaybe<Scalars['u32']>;
  payoutEQ?: InputMaybe<Scalars['u32']>;
  payoutGT?: InputMaybe<Scalars['u32']>;
  payoutGTE?: InputMaybe<Scalars['u32']>;
  payoutIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  payoutLIKE?: InputMaybe<Scalars['u32']>;
  payoutLT?: InputMaybe<Scalars['u32']>;
  payoutLTE?: InputMaybe<Scalars['u32']>;
  payoutNEQ?: InputMaybe<Scalars['u32']>;
  payoutNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  payoutNOTLIKE?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  speed?: InputMaybe<Scalars['u8']>;
  speedEQ?: InputMaybe<Scalars['u8']>;
  speedGT?: InputMaybe<Scalars['u8']>;
  speedGTE?: InputMaybe<Scalars['u8']>;
  speedIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speedLIKE?: InputMaybe<Scalars['u8']>;
  speedLT?: InputMaybe<Scalars['u8']>;
  speedLTE?: InputMaybe<Scalars['u8']>;
  speedNEQ?: InputMaybe<Scalars['u8']>;
  speedNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  speedNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_Traveled = {
  __typename?: 'dopewars_Traveled';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  from_location_id?: Maybe<Scalars['u8']>;
  game_id?: Maybe<Scalars['u32']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  to_location_id?: Maybe<Scalars['u8']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_TraveledConnection = {
  __typename?: 'dopewars_TraveledConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TraveledEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TraveledEdge = {
  __typename?: 'dopewars_TraveledEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_Traveled>;
};

export type Dopewars_TraveledOrder = {
  direction: OrderDirection;
  field: Dopewars_TraveledOrderField;
};

export enum Dopewars_TraveledOrderField {
  FromLocationId = 'FROM_LOCATION_ID',
  GameId = 'GAME_ID',
  PlayerId = 'PLAYER_ID',
  ToLocationId = 'TO_LOCATION_ID',
  Turn = 'TURN'
}

export type Dopewars_TraveledWhereInput = {
  from_location_id?: InputMaybe<Scalars['u8']>;
  from_location_idEQ?: InputMaybe<Scalars['u8']>;
  from_location_idGT?: InputMaybe<Scalars['u8']>;
  from_location_idGTE?: InputMaybe<Scalars['u8']>;
  from_location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  from_location_idLIKE?: InputMaybe<Scalars['u8']>;
  from_location_idLT?: InputMaybe<Scalars['u8']>;
  from_location_idLTE?: InputMaybe<Scalars['u8']>;
  from_location_idNEQ?: InputMaybe<Scalars['u8']>;
  from_location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  from_location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  to_location_id?: InputMaybe<Scalars['u8']>;
  to_location_idEQ?: InputMaybe<Scalars['u8']>;
  to_location_idGT?: InputMaybe<Scalars['u8']>;
  to_location_idGTE?: InputMaybe<Scalars['u8']>;
  to_location_idIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  to_location_idLIKE?: InputMaybe<Scalars['u8']>;
  to_location_idLT?: InputMaybe<Scalars['u8']>;
  to_location_idLTE?: InputMaybe<Scalars['u8']>;
  to_location_idNEQ?: InputMaybe<Scalars['u8']>;
  to_location_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  to_location_idNOTLIKE?: InputMaybe<Scalars['u8']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_TrophyCreation = {
  __typename?: 'dopewars_TrophyCreation';
  data?: Maybe<Scalars['ByteArray']>;
  description?: Maybe<Scalars['ByteArray']>;
  end?: Maybe<Scalars['u64']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  group?: Maybe<Scalars['felt252']>;
  hidden?: Maybe<Scalars['bool']>;
  icon?: Maybe<Scalars['felt252']>;
  id?: Maybe<Scalars['felt252']>;
  index?: Maybe<Scalars['u8']>;
  points?: Maybe<Scalars['u16']>;
  start?: Maybe<Scalars['u64']>;
  tasks?: Maybe<Array<Maybe<Dopewars_Task>>>;
  title?: Maybe<Scalars['felt252']>;
};

export type Dopewars_TrophyCreationConnection = {
  __typename?: 'dopewars_TrophyCreationConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TrophyCreationEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TrophyCreationEdge = {
  __typename?: 'dopewars_TrophyCreationEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TrophyCreation>;
};

export type Dopewars_TrophyCreationOrder = {
  direction: OrderDirection;
  field: Dopewars_TrophyCreationOrderField;
};

export enum Dopewars_TrophyCreationOrderField {
  Data = 'DATA',
  Description = 'DESCRIPTION',
  End = 'END',
  Group = 'GROUP',
  Hidden = 'HIDDEN',
  Icon = 'ICON',
  Id = 'ID',
  Index = 'INDEX',
  Points = 'POINTS',
  Start = 'START',
  Tasks = 'TASKS',
  Title = 'TITLE'
}

export type Dopewars_TrophyCreationWhereInput = {
  data?: InputMaybe<Scalars['ByteArray']>;
  dataEQ?: InputMaybe<Scalars['ByteArray']>;
  dataGT?: InputMaybe<Scalars['ByteArray']>;
  dataGTE?: InputMaybe<Scalars['ByteArray']>;
  dataIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  dataLIKE?: InputMaybe<Scalars['ByteArray']>;
  dataLT?: InputMaybe<Scalars['ByteArray']>;
  dataLTE?: InputMaybe<Scalars['ByteArray']>;
  dataNEQ?: InputMaybe<Scalars['ByteArray']>;
  dataNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  dataNOTLIKE?: InputMaybe<Scalars['ByteArray']>;
  description?: InputMaybe<Scalars['ByteArray']>;
  descriptionEQ?: InputMaybe<Scalars['ByteArray']>;
  descriptionGT?: InputMaybe<Scalars['ByteArray']>;
  descriptionGTE?: InputMaybe<Scalars['ByteArray']>;
  descriptionIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  descriptionLIKE?: InputMaybe<Scalars['ByteArray']>;
  descriptionLT?: InputMaybe<Scalars['ByteArray']>;
  descriptionLTE?: InputMaybe<Scalars['ByteArray']>;
  descriptionNEQ?: InputMaybe<Scalars['ByteArray']>;
  descriptionNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ByteArray']>>>;
  descriptionNOTLIKE?: InputMaybe<Scalars['ByteArray']>;
  end?: InputMaybe<Scalars['u64']>;
  endEQ?: InputMaybe<Scalars['u64']>;
  endGT?: InputMaybe<Scalars['u64']>;
  endGTE?: InputMaybe<Scalars['u64']>;
  endIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  endLIKE?: InputMaybe<Scalars['u64']>;
  endLT?: InputMaybe<Scalars['u64']>;
  endLTE?: InputMaybe<Scalars['u64']>;
  endNEQ?: InputMaybe<Scalars['u64']>;
  endNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  endNOTLIKE?: InputMaybe<Scalars['u64']>;
  group?: InputMaybe<Scalars['felt252']>;
  groupEQ?: InputMaybe<Scalars['felt252']>;
  groupGT?: InputMaybe<Scalars['felt252']>;
  groupGTE?: InputMaybe<Scalars['felt252']>;
  groupIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  groupLIKE?: InputMaybe<Scalars['felt252']>;
  groupLT?: InputMaybe<Scalars['felt252']>;
  groupLTE?: InputMaybe<Scalars['felt252']>;
  groupNEQ?: InputMaybe<Scalars['felt252']>;
  groupNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  groupNOTLIKE?: InputMaybe<Scalars['felt252']>;
  hidden?: InputMaybe<Scalars['bool']>;
  icon?: InputMaybe<Scalars['felt252']>;
  iconEQ?: InputMaybe<Scalars['felt252']>;
  iconGT?: InputMaybe<Scalars['felt252']>;
  iconGTE?: InputMaybe<Scalars['felt252']>;
  iconIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  iconLIKE?: InputMaybe<Scalars['felt252']>;
  iconLT?: InputMaybe<Scalars['felt252']>;
  iconLTE?: InputMaybe<Scalars['felt252']>;
  iconNEQ?: InputMaybe<Scalars['felt252']>;
  iconNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  iconNOTLIKE?: InputMaybe<Scalars['felt252']>;
  id?: InputMaybe<Scalars['felt252']>;
  idEQ?: InputMaybe<Scalars['felt252']>;
  idGT?: InputMaybe<Scalars['felt252']>;
  idGTE?: InputMaybe<Scalars['felt252']>;
  idIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  idLIKE?: InputMaybe<Scalars['felt252']>;
  idLT?: InputMaybe<Scalars['felt252']>;
  idLTE?: InputMaybe<Scalars['felt252']>;
  idNEQ?: InputMaybe<Scalars['felt252']>;
  idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  idNOTLIKE?: InputMaybe<Scalars['felt252']>;
  index?: InputMaybe<Scalars['u8']>;
  indexEQ?: InputMaybe<Scalars['u8']>;
  indexGT?: InputMaybe<Scalars['u8']>;
  indexGTE?: InputMaybe<Scalars['u8']>;
  indexIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  indexLIKE?: InputMaybe<Scalars['u8']>;
  indexLT?: InputMaybe<Scalars['u8']>;
  indexLTE?: InputMaybe<Scalars['u8']>;
  indexNEQ?: InputMaybe<Scalars['u8']>;
  indexNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  indexNOTLIKE?: InputMaybe<Scalars['u8']>;
  points?: InputMaybe<Scalars['u16']>;
  pointsEQ?: InputMaybe<Scalars['u16']>;
  pointsGT?: InputMaybe<Scalars['u16']>;
  pointsGTE?: InputMaybe<Scalars['u16']>;
  pointsIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  pointsLIKE?: InputMaybe<Scalars['u16']>;
  pointsLT?: InputMaybe<Scalars['u16']>;
  pointsLTE?: InputMaybe<Scalars['u16']>;
  pointsNEQ?: InputMaybe<Scalars['u16']>;
  pointsNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u16']>>>;
  pointsNOTLIKE?: InputMaybe<Scalars['u16']>;
  start?: InputMaybe<Scalars['u64']>;
  startEQ?: InputMaybe<Scalars['u64']>;
  startGT?: InputMaybe<Scalars['u64']>;
  startGTE?: InputMaybe<Scalars['u64']>;
  startIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  startLIKE?: InputMaybe<Scalars['u64']>;
  startLT?: InputMaybe<Scalars['u64']>;
  startLTE?: InputMaybe<Scalars['u64']>;
  startNEQ?: InputMaybe<Scalars['u64']>;
  startNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  startNOTLIKE?: InputMaybe<Scalars['u64']>;
  title?: InputMaybe<Scalars['felt252']>;
  titleEQ?: InputMaybe<Scalars['felt252']>;
  titleGT?: InputMaybe<Scalars['felt252']>;
  titleGTE?: InputMaybe<Scalars['felt252']>;
  titleIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  titleLIKE?: InputMaybe<Scalars['felt252']>;
  titleLT?: InputMaybe<Scalars['felt252']>;
  titleLTE?: InputMaybe<Scalars['felt252']>;
  titleNEQ?: InputMaybe<Scalars['felt252']>;
  titleNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  titleNOTLIKE?: InputMaybe<Scalars['felt252']>;
};

export type Dopewars_TrophyProgression = {
  __typename?: 'dopewars_TrophyProgression';
  count?: Maybe<Scalars['u128']>;
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  player_id?: Maybe<Scalars['felt252']>;
  task_id?: Maybe<Scalars['felt252']>;
  time?: Maybe<Scalars['u64']>;
};

export type Dopewars_TrophyProgressionConnection = {
  __typename?: 'dopewars_TrophyProgressionConnection';
  edges?: Maybe<Array<Maybe<Dopewars_TrophyProgressionEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_TrophyProgressionEdge = {
  __typename?: 'dopewars_TrophyProgressionEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_TrophyProgression>;
};

export type Dopewars_TrophyProgressionOrder = {
  direction: OrderDirection;
  field: Dopewars_TrophyProgressionOrderField;
};

export enum Dopewars_TrophyProgressionOrderField {
  Count = 'COUNT',
  PlayerId = 'PLAYER_ID',
  TaskId = 'TASK_ID',
  Time = 'TIME'
}

export type Dopewars_TrophyProgressionWhereInput = {
  count?: InputMaybe<Scalars['u128']>;
  countEQ?: InputMaybe<Scalars['u128']>;
  countGT?: InputMaybe<Scalars['u128']>;
  countGTE?: InputMaybe<Scalars['u128']>;
  countIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  countLIKE?: InputMaybe<Scalars['u128']>;
  countLT?: InputMaybe<Scalars['u128']>;
  countLTE?: InputMaybe<Scalars['u128']>;
  countNEQ?: InputMaybe<Scalars['u128']>;
  countNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u128']>>>;
  countNOTLIKE?: InputMaybe<Scalars['u128']>;
  player_id?: InputMaybe<Scalars['felt252']>;
  player_idEQ?: InputMaybe<Scalars['felt252']>;
  player_idGT?: InputMaybe<Scalars['felt252']>;
  player_idGTE?: InputMaybe<Scalars['felt252']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_idLIKE?: InputMaybe<Scalars['felt252']>;
  player_idLT?: InputMaybe<Scalars['felt252']>;
  player_idLTE?: InputMaybe<Scalars['felt252']>;
  player_idNEQ?: InputMaybe<Scalars['felt252']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['felt252']>;
  task_id?: InputMaybe<Scalars['felt252']>;
  task_idEQ?: InputMaybe<Scalars['felt252']>;
  task_idGT?: InputMaybe<Scalars['felt252']>;
  task_idGTE?: InputMaybe<Scalars['felt252']>;
  task_idIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  task_idLIKE?: InputMaybe<Scalars['felt252']>;
  task_idLT?: InputMaybe<Scalars['felt252']>;
  task_idLTE?: InputMaybe<Scalars['felt252']>;
  task_idNEQ?: InputMaybe<Scalars['felt252']>;
  task_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['felt252']>>>;
  task_idNOTLIKE?: InputMaybe<Scalars['felt252']>;
  time?: InputMaybe<Scalars['u64']>;
  timeEQ?: InputMaybe<Scalars['u64']>;
  timeGT?: InputMaybe<Scalars['u64']>;
  timeGTE?: InputMaybe<Scalars['u64']>;
  timeIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeLIKE?: InputMaybe<Scalars['u64']>;
  timeLT?: InputMaybe<Scalars['u64']>;
  timeLTE?: InputMaybe<Scalars['u64']>;
  timeNEQ?: InputMaybe<Scalars['u64']>;
  timeNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u64']>>>;
  timeNOTLIKE?: InputMaybe<Scalars['u64']>;
};

export type Dopewars_UpgradeItem = {
  __typename?: 'dopewars_UpgradeItem';
  entity?: Maybe<World__Entity>;
  eventMessage?: Maybe<World__EventMessage>;
  game_id?: Maybe<Scalars['u32']>;
  item_level?: Maybe<Scalars['u8']>;
  item_slot?: Maybe<Scalars['u8']>;
  player_id?: Maybe<Scalars['ContractAddress']>;
  turn?: Maybe<Scalars['u8']>;
};

export type Dopewars_UpgradeItemConnection = {
  __typename?: 'dopewars_UpgradeItemConnection';
  edges?: Maybe<Array<Maybe<Dopewars_UpgradeItemEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int'];
};

export type Dopewars_UpgradeItemEdge = {
  __typename?: 'dopewars_UpgradeItemEdge';
  cursor?: Maybe<Scalars['Cursor']>;
  node?: Maybe<Dopewars_UpgradeItem>;
};

export type Dopewars_UpgradeItemOrder = {
  direction: OrderDirection;
  field: Dopewars_UpgradeItemOrderField;
};

export enum Dopewars_UpgradeItemOrderField {
  GameId = 'GAME_ID',
  ItemLevel = 'ITEM_LEVEL',
  ItemSlot = 'ITEM_SLOT',
  PlayerId = 'PLAYER_ID',
  Turn = 'TURN'
}

export type Dopewars_UpgradeItemWhereInput = {
  game_id?: InputMaybe<Scalars['u32']>;
  game_idEQ?: InputMaybe<Scalars['u32']>;
  game_idGT?: InputMaybe<Scalars['u32']>;
  game_idGTE?: InputMaybe<Scalars['u32']>;
  game_idIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idLIKE?: InputMaybe<Scalars['u32']>;
  game_idLT?: InputMaybe<Scalars['u32']>;
  game_idLTE?: InputMaybe<Scalars['u32']>;
  game_idNEQ?: InputMaybe<Scalars['u32']>;
  game_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u32']>>>;
  game_idNOTLIKE?: InputMaybe<Scalars['u32']>;
  item_level?: InputMaybe<Scalars['u8']>;
  item_levelEQ?: InputMaybe<Scalars['u8']>;
  item_levelGT?: InputMaybe<Scalars['u8']>;
  item_levelGTE?: InputMaybe<Scalars['u8']>;
  item_levelIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_levelLIKE?: InputMaybe<Scalars['u8']>;
  item_levelLT?: InputMaybe<Scalars['u8']>;
  item_levelLTE?: InputMaybe<Scalars['u8']>;
  item_levelNEQ?: InputMaybe<Scalars['u8']>;
  item_levelNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_levelNOTLIKE?: InputMaybe<Scalars['u8']>;
  item_slot?: InputMaybe<Scalars['u8']>;
  item_slotEQ?: InputMaybe<Scalars['u8']>;
  item_slotGT?: InputMaybe<Scalars['u8']>;
  item_slotGTE?: InputMaybe<Scalars['u8']>;
  item_slotIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_slotLIKE?: InputMaybe<Scalars['u8']>;
  item_slotLT?: InputMaybe<Scalars['u8']>;
  item_slotLTE?: InputMaybe<Scalars['u8']>;
  item_slotNEQ?: InputMaybe<Scalars['u8']>;
  item_slotNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  item_slotNOTLIKE?: InputMaybe<Scalars['u8']>;
  player_id?: InputMaybe<Scalars['ContractAddress']>;
  player_idEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idGT?: InputMaybe<Scalars['ContractAddress']>;
  player_idGTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idLIKE?: InputMaybe<Scalars['ContractAddress']>;
  player_idLT?: InputMaybe<Scalars['ContractAddress']>;
  player_idLTE?: InputMaybe<Scalars['ContractAddress']>;
  player_idNEQ?: InputMaybe<Scalars['ContractAddress']>;
  player_idNOTIN?: InputMaybe<Array<InputMaybe<Scalars['ContractAddress']>>>;
  player_idNOTLIKE?: InputMaybe<Scalars['ContractAddress']>;
  turn?: InputMaybe<Scalars['u8']>;
  turnEQ?: InputMaybe<Scalars['u8']>;
  turnGT?: InputMaybe<Scalars['u8']>;
  turnGTE?: InputMaybe<Scalars['u8']>;
  turnIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnLIKE?: InputMaybe<Scalars['u8']>;
  turnLT?: InputMaybe<Scalars['u8']>;
  turnLTE?: InputMaybe<Scalars['u8']>;
  turnNEQ?: InputMaybe<Scalars['u8']>;
  turnNOTIN?: InputMaybe<Array<InputMaybe<Scalars['u8']>>>;
  turnNOTLIKE?: InputMaybe<Scalars['u8']>;
};

export type Dopewars_U8u8 = {
  __typename?: 'dopewars_u8u8';
  _0?: Maybe<Scalars['u8']>;
  _1?: Maybe<Scalars['u8']>;
};

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'World__Query', dopewarsRyoAddressModels?: { __typename?: 'dopewars_RyoAddressConnection', edges?: Array<{ __typename?: 'dopewars_RyoAddressEdge', node?: { __typename?: 'dopewars_RyoAddress', key?: any | null, paper?: any | null, treasury?: any | null } | null } | null> | null } | null, dopewarsRyoConfigModels?: { __typename?: 'dopewars_RyoConfigConnection', edges?: Array<{ __typename?: 'dopewars_RyoConfigEdge', node?: { __typename?: 'dopewars_RyoConfig', key?: any | null, initialized?: any | null, paused?: any | null, season_version?: any | null, season_duration?: any | null, season_time_limit?: any | null, target_supply?: any | null, max_score?: any | null, average_score?: any | null, average_weight?: any | null, f2p_hustlers?: any | null, play_with_loot?: any | null, play_with_hustlers?: any | null } | null } | null> | null } | null, dopewarsDrugConfigModels?: { __typename?: 'dopewars_DrugConfigConnection', edges?: Array<{ __typename?: 'dopewars_DrugConfigEdge', node?: { __typename?: 'dopewars_DrugConfig', drugs_mode?: any | null, drug?: any | null, drug_id?: any | null, base?: any | null, step?: any | null, weight?: any | null, name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null, dopewarsLocationConfigModels?: { __typename?: 'dopewars_LocationConfigConnection', edges?: Array<{ __typename?: 'dopewars_LocationConfigEdge', node?: { __typename?: 'dopewars_LocationConfig', location?: any | null, location_id?: any | null, name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null, dopewarsEncounterStatsConfigModels?: { __typename?: 'dopewars_EncounterStatsConfigConnection', edges?: Array<{ __typename?: 'dopewars_EncounterStatsConfigEdge', node?: { __typename?: 'dopewars_EncounterStatsConfig', encounters_mode?: any | null, encounter?: any | null, health_base?: any | null, health_step?: any | null, attack_base?: any | null, attack_step?: any | null, defense_base?: any | null, defense_step?: any | null, speed_base?: any | null, speed_step?: any | null } | null } | null> | null } | null, dopewarsDopewarsItemTierModels?: { __typename?: 'dopewars_DopewarsItemTierConnection', edges?: Array<{ __typename?: 'dopewars_DopewarsItemTierEdge', node?: { __typename?: 'dopewars_DopewarsItemTier', slot_id?: any | null, item_id?: any | null, tier?: any | null } | null } | null> | null } | null, dopewarsDopewarsItemTierConfigModels?: { __typename?: 'dopewars_DopewarsItemTierConfigConnection', edges?: Array<{ __typename?: 'dopewars_DopewarsItemTierConfigEdge', node?: { __typename?: 'dopewars_DopewarsItemTierConfig', slot_id?: any | null, tier?: any | null, levels?: Array<{ __typename?: 'dopewars_ItemTierConfig', stat?: any | null, cost?: any | null } | null> | null } | null } | null> | null } | null };

export type GameConfigQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type GameConfigQuery = { __typename?: 'World__Query', dopewarsGameConfigModels?: { __typename?: 'dopewars_GameConfigConnection', edges?: Array<{ __typename?: 'dopewars_GameConfigEdge', node?: { __typename?: 'dopewars_GameConfig', season_version?: any | null, cash?: any | null, health?: any | null, max_turns?: any | null, max_wanted_shopping?: any | null, rep_drug_step?: any | null, rep_buy_item?: any | null, rep_carry_drugs?: any | null, rep_hospitalized?: any | null, rep_jailed?: any | null } | null } | null> | null } | null };

export type AllGameConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type AllGameConfigQuery = { __typename?: 'World__Query', dopewarsGameConfigModels?: { __typename?: 'dopewars_GameConfigConnection', edges?: Array<{ __typename?: 'dopewars_GameConfigEdge', node?: { __typename?: 'dopewars_GameConfig', season_version?: any | null, cash?: any | null, health?: any | null, max_turns?: any | null, max_wanted_shopping?: any | null, rep_drug_step?: any | null, rep_buy_item?: any | null, rep_carry_drugs?: any | null, rep_hospitalized?: any | null, rep_jailed?: any | null } | null } | null> | null } | null };

export type GameEventsQueryVariables = Exact<{
  gameId: Scalars['String'];
}>;


export type GameEventsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };

export type GameEventsSubscriptionSubscriptionVariables = Exact<{
  gameId?: InputMaybe<Scalars['String']>;
}>;


export type GameEventsSubscriptionSubscription = { __typename?: 'World__Subscription', eventEmitted: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } };

export type GameByIdQueryVariables = Exact<{
  gameId?: InputMaybe<Scalars['u32']>;
}>;


export type GameByIdQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', season_version?: any | null, game_id?: any | null, game_mode?: any | null, player_id?: any | null, game_over?: any | null, final_score?: any | null, registered?: any | null, multiplier?: any | null, hustler_token_id?: any | null, reward?: any | null, equipment_by_slot?: Array<any | null> | null, player_name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type RegisteredGamesBySeasonQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type RegisteredGamesBySeasonQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', season_version?: any | null, game_id?: any | null, player_id?: any | null, final_score?: any | null, registered?: any | null, multiplier?: any | null, hustler_token_id?: any | null, reward?: any | null, equipment_by_slot?: Array<any | null> | null, player_name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type GamesByPlayerQueryVariables = Exact<{
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type GamesByPlayerQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'dopewars_Bundle' } | { __typename: 'dopewars_BundleGroup' } | { __typename: 'dopewars_BundleIssuance' } | { __typename: 'dopewars_BundleIssued' } | { __typename: 'dopewars_BundleReferral' } | { __typename: 'dopewars_BundleRegistered' } | { __typename: 'dopewars_BundleUpdated' } | { __typename: 'dopewars_BundleVoucher' } | { __typename: 'dopewars_Claimed' } | { __typename: 'dopewars_DailyPurchase' } | { __typename: 'dopewars_DopewarsItemTier' } | { __typename: 'dopewars_DopewarsItemTierConfig' } | { __typename: 'dopewars_DrugConfig' } | { __typename: 'dopewars_ERC20BalanceEvent' } | { __typename: 'dopewars_EncounterStatsConfig' } | { __typename: 'dopewars_Game', game_id?: any | null, player_id?: any | null, season_version?: any | null, game_mode?: any | null, multiplier?: any | null, game_over?: any | null, final_score?: any | null, registered?: any | null, hustler_token_id?: any | null, reward?: any | null, equipment_by_slot?: Array<any | null> | null, player_name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | { __typename: 'dopewars_GameConfig' } | { __typename: 'dopewars_GameCreated' } | { __typename: 'dopewars_GameOver' } | { __typename: 'dopewars_GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'dopewars_GearInstance' } | { __typename: 'dopewars_GearTemplate' } | { __typename: 'dopewars_HighVolatility' } | { __typename: 'dopewars_HustlerInstance' } | { __typename: 'dopewars_HustlerTemplate' } | { __typename: 'dopewars_LocationConfig' } | { __typename: 'dopewars_MarketConfig' } | { __typename: 'dopewars_NewHighScore' } | { __typename: 'dopewars_NewSeason' } | { __typename: 'dopewars_PaymentConfig' } | { __typename: 'dopewars_RyoAddress' } | { __typename: 'dopewars_RyoConfig' } | { __typename: 'dopewars_Season' } | { __typename: 'dopewars_SeasonSettings' } | { __typename: 'dopewars_Starterpack' } | { __typename: 'dopewars_TradeDrug' } | { __typename: 'dopewars_TravelEncounter' } | { __typename: 'dopewars_TravelEncounterResult' } | { __typename: 'dopewars_Traveled' } | { __typename: 'dopewars_TrophyCreation' } | { __typename: 'dopewars_TrophyProgression' } | { __typename: 'dopewars_UpgradeItem' } | null> | null } | null } | null> | null } | null };

export type GameStorePackedQueryVariables = Exact<{
  gameId: Scalars['String'];
  playerId: Scalars['String'];
}>;


export type GameStorePackedQuery = { __typename?: 'World__Query', entities?: { __typename?: 'World__EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EntityEdge', node?: { __typename?: 'World__Entity', id?: string | null, models?: Array<{ __typename: 'dopewars_Bundle' } | { __typename: 'dopewars_BundleGroup' } | { __typename: 'dopewars_BundleIssuance' } | { __typename: 'dopewars_BundleIssued' } | { __typename: 'dopewars_BundleReferral' } | { __typename: 'dopewars_BundleRegistered' } | { __typename: 'dopewars_BundleUpdated' } | { __typename: 'dopewars_BundleVoucher' } | { __typename: 'dopewars_Claimed' } | { __typename: 'dopewars_DailyPurchase' } | { __typename: 'dopewars_DopewarsItemTier' } | { __typename: 'dopewars_DopewarsItemTierConfig' } | { __typename: 'dopewars_DrugConfig' } | { __typename: 'dopewars_ERC20BalanceEvent' } | { __typename: 'dopewars_EncounterStatsConfig' } | { __typename: 'dopewars_Game' } | { __typename: 'dopewars_GameConfig' } | { __typename: 'dopewars_GameCreated' } | { __typename: 'dopewars_GameOver' } | { __typename: 'dopewars_GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'dopewars_GearInstance' } | { __typename: 'dopewars_GearTemplate' } | { __typename: 'dopewars_HighVolatility' } | { __typename: 'dopewars_HustlerInstance' } | { __typename: 'dopewars_HustlerTemplate' } | { __typename: 'dopewars_LocationConfig' } | { __typename: 'dopewars_MarketConfig' } | { __typename: 'dopewars_NewHighScore' } | { __typename: 'dopewars_NewSeason' } | { __typename: 'dopewars_PaymentConfig' } | { __typename: 'dopewars_RyoAddress' } | { __typename: 'dopewars_RyoConfig' } | { __typename: 'dopewars_Season' } | { __typename: 'dopewars_SeasonSettings' } | { __typename: 'dopewars_Starterpack' } | { __typename: 'dopewars_TradeDrug' } | { __typename: 'dopewars_TravelEncounter' } | { __typename: 'dopewars_TravelEncounterResult' } | { __typename: 'dopewars_Traveled' } | { __typename: 'dopewars_TrophyCreation' } | { __typename: 'dopewars_TrophyProgression' } | { __typename: 'dopewars_UpgradeItem' } | null> | null } | null } | null> | null } | null };

export type GameStorePackedSubscriptionSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type GameStorePackedSubscriptionSubscription = { __typename?: 'World__Subscription', entityUpdated: { __typename?: 'World__Entity', id?: string | null, keys?: Array<string | null> | null, models?: Array<{ __typename: 'dopewars_Bundle' } | { __typename: 'dopewars_BundleGroup' } | { __typename: 'dopewars_BundleIssuance' } | { __typename: 'dopewars_BundleIssued' } | { __typename: 'dopewars_BundleReferral' } | { __typename: 'dopewars_BundleRegistered' } | { __typename: 'dopewars_BundleUpdated' } | { __typename: 'dopewars_BundleVoucher' } | { __typename: 'dopewars_Claimed' } | { __typename: 'dopewars_DailyPurchase' } | { __typename: 'dopewars_DopewarsItemTier' } | { __typename: 'dopewars_DopewarsItemTierConfig' } | { __typename: 'dopewars_DrugConfig' } | { __typename: 'dopewars_ERC20BalanceEvent' } | { __typename: 'dopewars_EncounterStatsConfig' } | { __typename: 'dopewars_Game' } | { __typename: 'dopewars_GameConfig' } | { __typename: 'dopewars_GameCreated' } | { __typename: 'dopewars_GameOver' } | { __typename: 'dopewars_GameStorePacked', game_id?: any | null, player_id?: any | null, packed?: any | null } | { __typename: 'dopewars_GearInstance' } | { __typename: 'dopewars_GearTemplate' } | { __typename: 'dopewars_HighVolatility' } | { __typename: 'dopewars_HustlerInstance' } | { __typename: 'dopewars_HustlerTemplate' } | { __typename: 'dopewars_LocationConfig' } | { __typename: 'dopewars_MarketConfig' } | { __typename: 'dopewars_NewHighScore' } | { __typename: 'dopewars_NewSeason' } | { __typename: 'dopewars_PaymentConfig' } | { __typename: 'dopewars_RyoAddress' } | { __typename: 'dopewars_RyoConfig' } | { __typename: 'dopewars_Season' } | { __typename: 'dopewars_SeasonSettings' } | { __typename: 'dopewars_Starterpack' } | { __typename: 'dopewars_TradeDrug' } | { __typename: 'dopewars_TravelEncounter' } | { __typename: 'dopewars_TravelEncounterResult' } | { __typename: 'dopewars_Traveled' } | { __typename: 'dopewars_TrophyCreation' } | { __typename: 'dopewars_TrophyProgression' } | { __typename: 'dopewars_UpgradeItem' } | null> | null } };

export type TravelEncounterByPlayerQueryVariables = Exact<{
  travelEncounterSelector?: InputMaybe<Scalars['String']>;
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type TravelEncounterByPlayerQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } | null } | null> | null } | null };

export type TravelEncounterResultsByPlayerQueryVariables = Exact<{
  travelEncounterResultSelector?: InputMaybe<Scalars['String']>;
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type TravelEncounterResultsByPlayerQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } | null } | null> | null } | null };

export type TradedDrugByPlayerQueryVariables = Exact<{
  tradeDrugSelector?: InputMaybe<Scalars['String']>;
  playerId?: InputMaybe<Scalars['String']>;
}>;


export type TradedDrugByPlayerQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } | null } | null> | null } | null };

export type GetAllGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGamesQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', game_id?: any | null, player_id?: any | null, season_version?: any | null, final_score?: any | null, registered?: any | null, multiplier?: any | null, hustler_token_id?: any | null, reward?: any | null, player_name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type SeasonByVersionQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type SeasonByVersionQuery = { __typename?: 'World__Query', dopewarsSeasonModels?: { __typename?: 'dopewars_SeasonConnection', edges?: Array<{ __typename?: 'dopewars_SeasonEdge', node?: { __typename?: 'dopewars_Season', version?: any | null, season_duration?: any | null, season_time_limit?: any | null, next_version_timestamp?: any | null, high_score?: any | null } | null } | null> | null } | null, dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null, wanted_mode?: any | null } | null } | null> | null } | null };

export type SeasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type SeasonsQuery = { __typename?: 'World__Query', dopewarsSeasonModels?: { __typename?: 'dopewars_SeasonConnection', edges?: Array<{ __typename?: 'dopewars_SeasonEdge', node?: { __typename?: 'dopewars_Season', version?: any | null, season_duration?: any | null, season_time_limit?: any | null, next_version_timestamp?: any | null, high_score?: any | null } | null } | null> | null } | null, dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null } | null } | null> | null } | null };

export type SeasonSettingsQueryVariables = Exact<{
  version?: InputMaybe<Scalars['u16']>;
}>;


export type SeasonSettingsQuery = { __typename?: 'World__Query', dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null } | null } | null> | null } | null };

export type AllSeasonSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllSeasonSettingsQuery = { __typename?: 'World__Query', dopewarsSeasonSettingsModels?: { __typename?: 'dopewars_SeasonSettingsConnection', edges?: Array<{ __typename?: 'dopewars_SeasonSettingsEdge', node?: { __typename?: 'dopewars_SeasonSettings', season_version?: any | null, cash_mode?: any | null, health_mode?: any | null, turns_mode?: any | null, drugs_mode?: any | null, encounters_mode?: any | null, encounters_odds_mode?: any | null } | null } | null> | null } | null };

export type HallOfFameQueryVariables = Exact<{ [key: string]: never; }>;


export type HallOfFameQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', game_id?: any | null, player_id?: any | null, multiplier?: any | null, season_version?: any | null, final_score?: any | null, hustler_token_id?: any | null, reward?: any | null, equipment_by_slot?: Array<any | null> | null, player_name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type ClaimableQueryVariables = Exact<{
  playerId?: InputMaybe<Scalars['ContractAddress']>;
}>;


export type ClaimableQuery = { __typename?: 'World__Query', dopewarsGameModels?: { __typename?: 'dopewars_GameConnection', edges?: Array<{ __typename?: 'dopewars_GameEdge', node?: { __typename?: 'dopewars_Game', game_id?: any | null, season_version?: any | null, player_id?: any | null, hustler_token_id?: any | null, reward?: any | null, equipment_by_slot?: Array<any | null> | null, final_score?: any | null, player_name?: { __typename?: 'dopewars_Bytes16', value?: any | null } | null } | null } | null> | null } | null };

export type GameOverEventsQueryVariables = Exact<{
  gameOverSelector?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['String']>;
}>;


export type GameOverEventsQuery = { __typename?: 'World__Query', events?: { __typename?: 'World__EventConnection', totalCount: number, edges?: Array<{ __typename?: 'World__EventEdge', node?: { __typename?: 'World__Event', id?: string | null, transactionHash?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null, createdAt?: any | null } | null } | null> | null } | null };


export const ConfigDocument = `
    query Config {
  dopewarsRyoAddressModels(limit: 1) {
    edges {
      node {
        key
        paper
        treasury
      }
    }
  }
  dopewarsRyoConfigModels(limit: 1) {
    edges {
      node {
        key
        initialized
        paused
        season_version
        season_duration
        season_time_limit
        target_supply
        max_score
        average_score
        average_weight
        f2p_hustlers
        play_with_loot
        play_with_hustlers
      }
    }
  }
  dopewarsDrugConfigModels(limit: 24, order: {field: DRUG_ID, direction: ASC}) {
    edges {
      node {
        drugs_mode
        drug
        drug_id
        base
        step
        weight
        name {
          value
        }
      }
    }
  }
  dopewarsLocationConfigModels(order: {field: LOCATION_ID, direction: ASC}) {
    edges {
      node {
        location
        location_id
        name {
          value
        }
      }
    }
  }
  dopewarsEncounterStatsConfigModels(limit: 100) {
    edges {
      node {
        encounters_mode
        encounter
        health_base
        health_step
        attack_base
        attack_step
        defense_base
        defense_step
        speed_base
        speed_step
      }
    }
  }
  dopewarsDopewarsItemTierModels(limit: 1000) {
    edges {
      node {
        slot_id
        item_id
        tier
      }
    }
  }
  dopewarsDopewarsItemTierConfigModels(limit: 1000) {
    edges {
      node {
        slot_id
        tier
        levels {
          stat
          cost
        }
      }
    }
  }
}
    `;
export const useConfigQuery = <
      TData = ConfigQuery,
      TError = unknown
    >(
      variables?: ConfigQueryVariables,
      options?: UseQueryOptions<ConfigQuery, TError, TData>
    ) =>
    useQuery<ConfigQuery, TError, TData>(
      variables === undefined ? ['Config'] : ['Config', variables],
      useFetchData<ConfigQuery, ConfigQueryVariables>(ConfigDocument).bind(null, variables),
      options
    );

useConfigQuery.getKey = (variables?: ConfigQueryVariables) => variables === undefined ? ['Config'] : ['Config', variables];
;

export const useInfiniteConfigQuery = <
      TData = ConfigQuery,
      TError = unknown
    >(
      variables?: ConfigQueryVariables,
      options?: UseInfiniteQueryOptions<ConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<ConfigQuery, ConfigQueryVariables>(ConfigDocument)
    return useInfiniteQuery<ConfigQuery, TError, TData>(
      variables === undefined ? ['Config.infinite'] : ['Config.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteConfigQuery.getKey = (variables?: ConfigQueryVariables) => variables === undefined ? ['Config.infinite'] : ['Config.infinite', variables];
;

export const GameConfigDocument = `
    query GameConfig($version: u16) {
  dopewarsGameConfigModels(where: {season_version: $version}) {
    edges {
      node {
        season_version
        cash
        health
        max_turns
        max_wanted_shopping
        rep_drug_step
        rep_buy_item
        rep_carry_drugs
        rep_hospitalized
        rep_jailed
      }
    }
  }
}
    `;
export const useGameConfigQuery = <
      TData = GameConfigQuery,
      TError = unknown
    >(
      variables?: GameConfigQueryVariables,
      options?: UseQueryOptions<GameConfigQuery, TError, TData>
    ) =>
    useQuery<GameConfigQuery, TError, TData>(
      variables === undefined ? ['GameConfig'] : ['GameConfig', variables],
      useFetchData<GameConfigQuery, GameConfigQueryVariables>(GameConfigDocument).bind(null, variables),
      options
    );

useGameConfigQuery.getKey = (variables?: GameConfigQueryVariables) => variables === undefined ? ['GameConfig'] : ['GameConfig', variables];
;

export const useInfiniteGameConfigQuery = <
      TData = GameConfigQuery,
      TError = unknown
    >(
      variables?: GameConfigQueryVariables,
      options?: UseInfiniteQueryOptions<GameConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameConfigQuery, GameConfigQueryVariables>(GameConfigDocument)
    return useInfiniteQuery<GameConfigQuery, TError, TData>(
      variables === undefined ? ['GameConfig.infinite'] : ['GameConfig.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameConfigQuery.getKey = (variables?: GameConfigQueryVariables) => variables === undefined ? ['GameConfig.infinite'] : ['GameConfig.infinite', variables];
;

export const AllGameConfigDocument = `
    query AllGameConfig {
  dopewarsGameConfigModels(limit: 420) {
    edges {
      node {
        season_version
        cash
        health
        max_turns
        max_wanted_shopping
        rep_drug_step
        rep_buy_item
        rep_carry_drugs
        rep_hospitalized
        rep_jailed
      }
    }
  }
}
    `;
export const useAllGameConfigQuery = <
      TData = AllGameConfigQuery,
      TError = unknown
    >(
      variables?: AllGameConfigQueryVariables,
      options?: UseQueryOptions<AllGameConfigQuery, TError, TData>
    ) =>
    useQuery<AllGameConfigQuery, TError, TData>(
      variables === undefined ? ['AllGameConfig'] : ['AllGameConfig', variables],
      useFetchData<AllGameConfigQuery, AllGameConfigQueryVariables>(AllGameConfigDocument).bind(null, variables),
      options
    );

useAllGameConfigQuery.getKey = (variables?: AllGameConfigQueryVariables) => variables === undefined ? ['AllGameConfig'] : ['AllGameConfig', variables];
;

export const useInfiniteAllGameConfigQuery = <
      TData = AllGameConfigQuery,
      TError = unknown
    >(
      variables?: AllGameConfigQueryVariables,
      options?: UseInfiniteQueryOptions<AllGameConfigQuery, TError, TData>
    ) =>{
    const query = useFetchData<AllGameConfigQuery, AllGameConfigQueryVariables>(AllGameConfigDocument)
    return useInfiniteQuery<AllGameConfigQuery, TError, TData>(
      variables === undefined ? ['AllGameConfig.infinite'] : ['AllGameConfig.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteAllGameConfigQuery.getKey = (variables?: AllGameConfigQueryVariables) => variables === undefined ? ['AllGameConfig.infinite'] : ['AllGameConfig.infinite', variables];
;

export const GameEventsDocument = `
    query GameEvents($gameId: String!) {
  events(last: 1000, keys: ["*", $gameId]) {
    totalCount
    edges {
      node {
        id
        keys
        data
        createdAt
      }
    }
  }
}
    `;
export const useGameEventsQuery = <
      TData = GameEventsQuery,
      TError = unknown
    >(
      variables: GameEventsQueryVariables,
      options?: UseQueryOptions<GameEventsQuery, TError, TData>
    ) =>
    useQuery<GameEventsQuery, TError, TData>(
      ['GameEvents', variables],
      useFetchData<GameEventsQuery, GameEventsQueryVariables>(GameEventsDocument).bind(null, variables),
      options
    );

useGameEventsQuery.getKey = (variables: GameEventsQueryVariables) => ['GameEvents', variables];
;

export const useInfiniteGameEventsQuery = <
      TData = GameEventsQuery,
      TError = unknown
    >(
      variables: GameEventsQueryVariables,
      options?: UseInfiniteQueryOptions<GameEventsQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameEventsQuery, GameEventsQueryVariables>(GameEventsDocument)
    return useInfiniteQuery<GameEventsQuery, TError, TData>(
      ['GameEvents.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameEventsQuery.getKey = (variables: GameEventsQueryVariables) => ['GameEvents.infinite', variables];
;

export const GameEventsSubscriptionDocument = `
    subscription GameEventsSubscription($gameId: String) {
  eventEmitted(keys: ["*", $gameId]) {
    id
    keys
    data
    createdAt
  }
}
    `;
export const GameByIdDocument = `
    query GameById($gameId: u32) {
  dopewarsGameModels(where: {game_id: $gameId}) {
    edges {
      node {
        season_version
        game_id
        game_mode
        player_name {
          value
        }
        player_id
        game_over
        final_score
        registered
        multiplier
        hustler_token_id
        reward
        equipment_by_slot
      }
    }
  }
}
    `;
export const useGameByIdQuery = <
      TData = GameByIdQuery,
      TError = unknown
    >(
      variables?: GameByIdQueryVariables,
      options?: UseQueryOptions<GameByIdQuery, TError, TData>
    ) =>
    useQuery<GameByIdQuery, TError, TData>(
      variables === undefined ? ['GameById'] : ['GameById', variables],
      useFetchData<GameByIdQuery, GameByIdQueryVariables>(GameByIdDocument).bind(null, variables),
      options
    );

useGameByIdQuery.getKey = (variables?: GameByIdQueryVariables) => variables === undefined ? ['GameById'] : ['GameById', variables];
;

export const useInfiniteGameByIdQuery = <
      TData = GameByIdQuery,
      TError = unknown
    >(
      variables?: GameByIdQueryVariables,
      options?: UseInfiniteQueryOptions<GameByIdQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameByIdQuery, GameByIdQueryVariables>(GameByIdDocument)
    return useInfiniteQuery<GameByIdQuery, TError, TData>(
      variables === undefined ? ['GameById.infinite'] : ['GameById.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameByIdQuery.getKey = (variables?: GameByIdQueryVariables) => variables === undefined ? ['GameById.infinite'] : ['GameById.infinite', variables];
;

export const RegisteredGamesBySeasonDocument = `
    query RegisteredGamesBySeason($version: u16) {
  dopewarsGameModels(
    limit: 9001
    where: {season_version: $version, registered: true}
    order: {field: FINAL_SCORE, direction: DESC}
  ) {
    edges {
      node {
        season_version
        game_id
        player_id
        player_name {
          value
        }
        final_score
        registered
        multiplier
        hustler_token_id
        reward
        equipment_by_slot
      }
    }
  }
}
    `;
export const useRegisteredGamesBySeasonQuery = <
      TData = RegisteredGamesBySeasonQuery,
      TError = unknown
    >(
      variables?: RegisteredGamesBySeasonQueryVariables,
      options?: UseQueryOptions<RegisteredGamesBySeasonQuery, TError, TData>
    ) =>
    useQuery<RegisteredGamesBySeasonQuery, TError, TData>(
      variables === undefined ? ['RegisteredGamesBySeason'] : ['RegisteredGamesBySeason', variables],
      useFetchData<RegisteredGamesBySeasonQuery, RegisteredGamesBySeasonQueryVariables>(RegisteredGamesBySeasonDocument).bind(null, variables),
      options
    );

useRegisteredGamesBySeasonQuery.getKey = (variables?: RegisteredGamesBySeasonQueryVariables) => variables === undefined ? ['RegisteredGamesBySeason'] : ['RegisteredGamesBySeason', variables];
;

export const useInfiniteRegisteredGamesBySeasonQuery = <
      TData = RegisteredGamesBySeasonQuery,
      TError = unknown
    >(
      variables?: RegisteredGamesBySeasonQueryVariables,
      options?: UseInfiniteQueryOptions<RegisteredGamesBySeasonQuery, TError, TData>
    ) =>{
    const query = useFetchData<RegisteredGamesBySeasonQuery, RegisteredGamesBySeasonQueryVariables>(RegisteredGamesBySeasonDocument)
    return useInfiniteQuery<RegisteredGamesBySeasonQuery, TError, TData>(
      variables === undefined ? ['RegisteredGamesBySeason.infinite'] : ['RegisteredGamesBySeason.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteRegisteredGamesBySeasonQuery.getKey = (variables?: RegisteredGamesBySeasonQueryVariables) => variables === undefined ? ['RegisteredGamesBySeason.infinite'] : ['RegisteredGamesBySeason.infinite', variables];
;

export const GamesByPlayerDocument = `
    query GamesByPlayer($playerId: String) {
  entities(limit: 9001, keys: ["*", $playerId]) {
    edges {
      node {
        id
        keys
        models {
          __typename
          ... on dopewars_Game {
            game_id
            player_id
            season_version
            game_mode
            player_name {
              value
            }
            multiplier
            game_over
            final_score
            registered
            hustler_token_id
            reward
            equipment_by_slot
          }
          ... on dopewars_GameStorePacked {
            game_id
            player_id
            packed
          }
        }
      }
    }
  }
}
    `;
export const useGamesByPlayerQuery = <
      TData = GamesByPlayerQuery,
      TError = unknown
    >(
      variables?: GamesByPlayerQueryVariables,
      options?: UseQueryOptions<GamesByPlayerQuery, TError, TData>
    ) =>
    useQuery<GamesByPlayerQuery, TError, TData>(
      variables === undefined ? ['GamesByPlayer'] : ['GamesByPlayer', variables],
      useFetchData<GamesByPlayerQuery, GamesByPlayerQueryVariables>(GamesByPlayerDocument).bind(null, variables),
      options
    );

useGamesByPlayerQuery.getKey = (variables?: GamesByPlayerQueryVariables) => variables === undefined ? ['GamesByPlayer'] : ['GamesByPlayer', variables];
;

export const useInfiniteGamesByPlayerQuery = <
      TData = GamesByPlayerQuery,
      TError = unknown
    >(
      variables?: GamesByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<GamesByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<GamesByPlayerQuery, GamesByPlayerQueryVariables>(GamesByPlayerDocument)
    return useInfiniteQuery<GamesByPlayerQuery, TError, TData>(
      variables === undefined ? ['GamesByPlayer.infinite'] : ['GamesByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGamesByPlayerQuery.getKey = (variables?: GamesByPlayerQueryVariables) => variables === undefined ? ['GamesByPlayer.infinite'] : ['GamesByPlayer.infinite', variables];
;

export const GameStorePackedDocument = `
    query GameStorePacked($gameId: String!, $playerId: String!) {
  entities(keys: [$gameId, $playerId]) {
    totalCount
    edges {
      node {
        id
        models {
          __typename
          ... on dopewars_GameStorePacked {
            game_id
            player_id
            packed
          }
        }
      }
    }
  }
}
    `;
export const useGameStorePackedQuery = <
      TData = GameStorePackedQuery,
      TError = unknown
    >(
      variables: GameStorePackedQueryVariables,
      options?: UseQueryOptions<GameStorePackedQuery, TError, TData>
    ) =>
    useQuery<GameStorePackedQuery, TError, TData>(
      ['GameStorePacked', variables],
      useFetchData<GameStorePackedQuery, GameStorePackedQueryVariables>(GameStorePackedDocument).bind(null, variables),
      options
    );

useGameStorePackedQuery.getKey = (variables: GameStorePackedQueryVariables) => ['GameStorePacked', variables];
;

export const useInfiniteGameStorePackedQuery = <
      TData = GameStorePackedQuery,
      TError = unknown
    >(
      variables: GameStorePackedQueryVariables,
      options?: UseInfiniteQueryOptions<GameStorePackedQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameStorePackedQuery, GameStorePackedQueryVariables>(GameStorePackedDocument)
    return useInfiniteQuery<GameStorePackedQuery, TError, TData>(
      ['GameStorePacked.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameStorePackedQuery.getKey = (variables: GameStorePackedQueryVariables) => ['GameStorePacked.infinite', variables];
;

export const GameStorePackedSubscriptionDocument = `
    subscription GameStorePackedSubscription($id: ID) {
  entityUpdated(id: $id) {
    id
    keys
    models {
      __typename
      ... on dopewars_GameStorePacked {
        game_id
        player_id
        packed
      }
    }
  }
}
    `;
export const TravelEncounterByPlayerDocument = `
    query TravelEncounterByPlayer($travelEncounterSelector: String, $playerId: String) {
  events(limit: 99999, keys: [$travelEncounterSelector, "*", $playerId]) {
    edges {
      node {
        id
        keys
        data
      }
    }
  }
}
    `;
export const useTravelEncounterByPlayerQuery = <
      TData = TravelEncounterByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterByPlayerQueryVariables,
      options?: UseQueryOptions<TravelEncounterByPlayerQuery, TError, TData>
    ) =>
    useQuery<TravelEncounterByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterByPlayer'] : ['TravelEncounterByPlayer', variables],
      useFetchData<TravelEncounterByPlayerQuery, TravelEncounterByPlayerQueryVariables>(TravelEncounterByPlayerDocument).bind(null, variables),
      options
    );

useTravelEncounterByPlayerQuery.getKey = (variables?: TravelEncounterByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterByPlayer'] : ['TravelEncounterByPlayer', variables];
;

export const useInfiniteTravelEncounterByPlayerQuery = <
      TData = TravelEncounterByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<TravelEncounterByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<TravelEncounterByPlayerQuery, TravelEncounterByPlayerQueryVariables>(TravelEncounterByPlayerDocument)
    return useInfiniteQuery<TravelEncounterByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterByPlayer.infinite'] : ['TravelEncounterByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteTravelEncounterByPlayerQuery.getKey = (variables?: TravelEncounterByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterByPlayer.infinite'] : ['TravelEncounterByPlayer.infinite', variables];
;

export const TravelEncounterResultsByPlayerDocument = `
    query TravelEncounterResultsByPlayer($travelEncounterResultSelector: String, $playerId: String) {
  events(limit: 99999, keys: [$travelEncounterResultSelector, "*", $playerId]) {
    edges {
      node {
        id
        keys
        data
      }
    }
  }
}
    `;
export const useTravelEncounterResultsByPlayerQuery = <
      TData = TravelEncounterResultsByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterResultsByPlayerQueryVariables,
      options?: UseQueryOptions<TravelEncounterResultsByPlayerQuery, TError, TData>
    ) =>
    useQuery<TravelEncounterResultsByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterResultsByPlayer'] : ['TravelEncounterResultsByPlayer', variables],
      useFetchData<TravelEncounterResultsByPlayerQuery, TravelEncounterResultsByPlayerQueryVariables>(TravelEncounterResultsByPlayerDocument).bind(null, variables),
      options
    );

useTravelEncounterResultsByPlayerQuery.getKey = (variables?: TravelEncounterResultsByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterResultsByPlayer'] : ['TravelEncounterResultsByPlayer', variables];
;

export const useInfiniteTravelEncounterResultsByPlayerQuery = <
      TData = TravelEncounterResultsByPlayerQuery,
      TError = unknown
    >(
      variables?: TravelEncounterResultsByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<TravelEncounterResultsByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<TravelEncounterResultsByPlayerQuery, TravelEncounterResultsByPlayerQueryVariables>(TravelEncounterResultsByPlayerDocument)
    return useInfiniteQuery<TravelEncounterResultsByPlayerQuery, TError, TData>(
      variables === undefined ? ['TravelEncounterResultsByPlayer.infinite'] : ['TravelEncounterResultsByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteTravelEncounterResultsByPlayerQuery.getKey = (variables?: TravelEncounterResultsByPlayerQueryVariables) => variables === undefined ? ['TravelEncounterResultsByPlayer.infinite'] : ['TravelEncounterResultsByPlayer.infinite', variables];
;

export const TradedDrugByPlayerDocument = `
    query TradedDrugByPlayer($tradeDrugSelector: String, $playerId: String) {
  events(limit: 99999, keys: [$tradeDrugSelector, "*", $playerId]) {
    edges {
      node {
        id
        keys
        data
      }
    }
  }
}
    `;
export const useTradedDrugByPlayerQuery = <
      TData = TradedDrugByPlayerQuery,
      TError = unknown
    >(
      variables?: TradedDrugByPlayerQueryVariables,
      options?: UseQueryOptions<TradedDrugByPlayerQuery, TError, TData>
    ) =>
    useQuery<TradedDrugByPlayerQuery, TError, TData>(
      variables === undefined ? ['TradedDrugByPlayer'] : ['TradedDrugByPlayer', variables],
      useFetchData<TradedDrugByPlayerQuery, TradedDrugByPlayerQueryVariables>(TradedDrugByPlayerDocument).bind(null, variables),
      options
    );

useTradedDrugByPlayerQuery.getKey = (variables?: TradedDrugByPlayerQueryVariables) => variables === undefined ? ['TradedDrugByPlayer'] : ['TradedDrugByPlayer', variables];
;

export const useInfiniteTradedDrugByPlayerQuery = <
      TData = TradedDrugByPlayerQuery,
      TError = unknown
    >(
      variables?: TradedDrugByPlayerQueryVariables,
      options?: UseInfiniteQueryOptions<TradedDrugByPlayerQuery, TError, TData>
    ) =>{
    const query = useFetchData<TradedDrugByPlayerQuery, TradedDrugByPlayerQueryVariables>(TradedDrugByPlayerDocument)
    return useInfiniteQuery<TradedDrugByPlayerQuery, TError, TData>(
      variables === undefined ? ['TradedDrugByPlayer.infinite'] : ['TradedDrugByPlayer.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteTradedDrugByPlayerQuery.getKey = (variables?: TradedDrugByPlayerQueryVariables) => variables === undefined ? ['TradedDrugByPlayer.infinite'] : ['TradedDrugByPlayer.infinite', variables];
;

export const GetAllGamesDocument = `
    query GetAllGames {
  dopewarsGameModels(limit: 9001) {
    edges {
      node {
        game_id
        player_id
        season_version
        player_name {
          value
        }
        final_score
        registered
        multiplier
        hustler_token_id
        reward
      }
    }
  }
}
    `;
export const useGetAllGamesQuery = <
      TData = GetAllGamesQuery,
      TError = unknown
    >(
      variables?: GetAllGamesQueryVariables,
      options?: UseQueryOptions<GetAllGamesQuery, TError, TData>
    ) =>
    useQuery<GetAllGamesQuery, TError, TData>(
      variables === undefined ? ['GetAllGames'] : ['GetAllGames', variables],
      useFetchData<GetAllGamesQuery, GetAllGamesQueryVariables>(GetAllGamesDocument).bind(null, variables),
      options
    );

useGetAllGamesQuery.getKey = (variables?: GetAllGamesQueryVariables) => variables === undefined ? ['GetAllGames'] : ['GetAllGames', variables];
;

export const useInfiniteGetAllGamesQuery = <
      TData = GetAllGamesQuery,
      TError = unknown
    >(
      variables?: GetAllGamesQueryVariables,
      options?: UseInfiniteQueryOptions<GetAllGamesQuery, TError, TData>
    ) =>{
    const query = useFetchData<GetAllGamesQuery, GetAllGamesQueryVariables>(GetAllGamesDocument)
    return useInfiniteQuery<GetAllGamesQuery, TError, TData>(
      variables === undefined ? ['GetAllGames.infinite'] : ['GetAllGames.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGetAllGamesQuery.getKey = (variables?: GetAllGamesQueryVariables) => variables === undefined ? ['GetAllGames.infinite'] : ['GetAllGames.infinite', variables];
;

export const SeasonByVersionDocument = `
    query SeasonByVersion($version: u16) {
  dopewarsSeasonModels(where: {version: $version}) {
    edges {
      node {
        version
        season_duration
        season_time_limit
        next_version_timestamp
        high_score
      }
    }
  }
  dopewarsSeasonSettingsModels(where: {season_version: $version}) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
        wanted_mode
      }
    }
  }
}
    `;
export const useSeasonByVersionQuery = <
      TData = SeasonByVersionQuery,
      TError = unknown
    >(
      variables?: SeasonByVersionQueryVariables,
      options?: UseQueryOptions<SeasonByVersionQuery, TError, TData>
    ) =>
    useQuery<SeasonByVersionQuery, TError, TData>(
      variables === undefined ? ['SeasonByVersion'] : ['SeasonByVersion', variables],
      useFetchData<SeasonByVersionQuery, SeasonByVersionQueryVariables>(SeasonByVersionDocument).bind(null, variables),
      options
    );

useSeasonByVersionQuery.getKey = (variables?: SeasonByVersionQueryVariables) => variables === undefined ? ['SeasonByVersion'] : ['SeasonByVersion', variables];
;

export const useInfiniteSeasonByVersionQuery = <
      TData = SeasonByVersionQuery,
      TError = unknown
    >(
      variables?: SeasonByVersionQueryVariables,
      options?: UseInfiniteQueryOptions<SeasonByVersionQuery, TError, TData>
    ) =>{
    const query = useFetchData<SeasonByVersionQuery, SeasonByVersionQueryVariables>(SeasonByVersionDocument)
    return useInfiniteQuery<SeasonByVersionQuery, TError, TData>(
      variables === undefined ? ['SeasonByVersion.infinite'] : ['SeasonByVersion.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteSeasonByVersionQuery.getKey = (variables?: SeasonByVersionQueryVariables) => variables === undefined ? ['SeasonByVersion.infinite'] : ['SeasonByVersion.infinite', variables];
;

export const SeasonsDocument = `
    query Seasons {
  dopewarsSeasonModels(limit: 420, order: {field: VERSION, direction: DESC}) {
    edges {
      node {
        version
        season_duration
        season_time_limit
        next_version_timestamp
        high_score
      }
    }
  }
  dopewarsSeasonSettingsModels(limit: 420) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
      }
    }
  }
}
    `;
export const useSeasonsQuery = <
      TData = SeasonsQuery,
      TError = unknown
    >(
      variables?: SeasonsQueryVariables,
      options?: UseQueryOptions<SeasonsQuery, TError, TData>
    ) =>
    useQuery<SeasonsQuery, TError, TData>(
      variables === undefined ? ['Seasons'] : ['Seasons', variables],
      useFetchData<SeasonsQuery, SeasonsQueryVariables>(SeasonsDocument).bind(null, variables),
      options
    );

useSeasonsQuery.getKey = (variables?: SeasonsQueryVariables) => variables === undefined ? ['Seasons'] : ['Seasons', variables];
;

export const useInfiniteSeasonsQuery = <
      TData = SeasonsQuery,
      TError = unknown
    >(
      variables?: SeasonsQueryVariables,
      options?: UseInfiniteQueryOptions<SeasonsQuery, TError, TData>
    ) =>{
    const query = useFetchData<SeasonsQuery, SeasonsQueryVariables>(SeasonsDocument)
    return useInfiniteQuery<SeasonsQuery, TError, TData>(
      variables === undefined ? ['Seasons.infinite'] : ['Seasons.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteSeasonsQuery.getKey = (variables?: SeasonsQueryVariables) => variables === undefined ? ['Seasons.infinite'] : ['Seasons.infinite', variables];
;

export const SeasonSettingsDocument = `
    query SeasonSettings($version: u16) {
  dopewarsSeasonSettingsModels(where: {season_version: $version}) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
      }
    }
  }
}
    `;
export const useSeasonSettingsQuery = <
      TData = SeasonSettingsQuery,
      TError = unknown
    >(
      variables?: SeasonSettingsQueryVariables,
      options?: UseQueryOptions<SeasonSettingsQuery, TError, TData>
    ) =>
    useQuery<SeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['SeasonSettings'] : ['SeasonSettings', variables],
      useFetchData<SeasonSettingsQuery, SeasonSettingsQueryVariables>(SeasonSettingsDocument).bind(null, variables),
      options
    );

useSeasonSettingsQuery.getKey = (variables?: SeasonSettingsQueryVariables) => variables === undefined ? ['SeasonSettings'] : ['SeasonSettings', variables];
;

export const useInfiniteSeasonSettingsQuery = <
      TData = SeasonSettingsQuery,
      TError = unknown
    >(
      variables?: SeasonSettingsQueryVariables,
      options?: UseInfiniteQueryOptions<SeasonSettingsQuery, TError, TData>
    ) =>{
    const query = useFetchData<SeasonSettingsQuery, SeasonSettingsQueryVariables>(SeasonSettingsDocument)
    return useInfiniteQuery<SeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['SeasonSettings.infinite'] : ['SeasonSettings.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteSeasonSettingsQuery.getKey = (variables?: SeasonSettingsQueryVariables) => variables === undefined ? ['SeasonSettings.infinite'] : ['SeasonSettings.infinite', variables];
;

export const AllSeasonSettingsDocument = `
    query AllSeasonSettings {
  dopewarsSeasonSettingsModels(limit: 420) {
    edges {
      node {
        season_version
        cash_mode
        health_mode
        turns_mode
        drugs_mode
        encounters_mode
        encounters_odds_mode
      }
    }
  }
}
    `;
export const useAllSeasonSettingsQuery = <
      TData = AllSeasonSettingsQuery,
      TError = unknown
    >(
      variables?: AllSeasonSettingsQueryVariables,
      options?: UseQueryOptions<AllSeasonSettingsQuery, TError, TData>
    ) =>
    useQuery<AllSeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['AllSeasonSettings'] : ['AllSeasonSettings', variables],
      useFetchData<AllSeasonSettingsQuery, AllSeasonSettingsQueryVariables>(AllSeasonSettingsDocument).bind(null, variables),
      options
    );

useAllSeasonSettingsQuery.getKey = (variables?: AllSeasonSettingsQueryVariables) => variables === undefined ? ['AllSeasonSettings'] : ['AllSeasonSettings', variables];
;

export const useInfiniteAllSeasonSettingsQuery = <
      TData = AllSeasonSettingsQuery,
      TError = unknown
    >(
      variables?: AllSeasonSettingsQueryVariables,
      options?: UseInfiniteQueryOptions<AllSeasonSettingsQuery, TError, TData>
    ) =>{
    const query = useFetchData<AllSeasonSettingsQuery, AllSeasonSettingsQueryVariables>(AllSeasonSettingsDocument)
    return useInfiniteQuery<AllSeasonSettingsQuery, TError, TData>(
      variables === undefined ? ['AllSeasonSettings.infinite'] : ['AllSeasonSettings.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteAllSeasonSettingsQuery.getKey = (variables?: AllSeasonSettingsQueryVariables) => variables === undefined ? ['AllSeasonSettings.infinite'] : ['AllSeasonSettings.infinite', variables];
;

export const HallOfFameDocument = `
    query HallOfFame {
  dopewarsGameModels(
    limit: 420
    where: {registered: true}
    order: {field: SEASON_VERSION, direction: DESC}
  ) {
    edges {
      node {
        game_id
        player_id
        player_name {
          value
        }
        multiplier
        season_version
        final_score
        hustler_token_id
        reward
        equipment_by_slot
      }
    }
  }
}
    `;
export const useHallOfFameQuery = <
      TData = HallOfFameQuery,
      TError = unknown
    >(
      variables?: HallOfFameQueryVariables,
      options?: UseQueryOptions<HallOfFameQuery, TError, TData>
    ) =>
    useQuery<HallOfFameQuery, TError, TData>(
      variables === undefined ? ['HallOfFame'] : ['HallOfFame', variables],
      useFetchData<HallOfFameQuery, HallOfFameQueryVariables>(HallOfFameDocument).bind(null, variables),
      options
    );

useHallOfFameQuery.getKey = (variables?: HallOfFameQueryVariables) => variables === undefined ? ['HallOfFame'] : ['HallOfFame', variables];
;

export const useInfiniteHallOfFameQuery = <
      TData = HallOfFameQuery,
      TError = unknown
    >(
      variables?: HallOfFameQueryVariables,
      options?: UseInfiniteQueryOptions<HallOfFameQuery, TError, TData>
    ) =>{
    const query = useFetchData<HallOfFameQuery, HallOfFameQueryVariables>(HallOfFameDocument)
    return useInfiniteQuery<HallOfFameQuery, TError, TData>(
      variables === undefined ? ['HallOfFame.infinite'] : ['HallOfFame.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteHallOfFameQuery.getKey = (variables?: HallOfFameQueryVariables) => variables === undefined ? ['HallOfFame.infinite'] : ['HallOfFame.infinite', variables];
;

export const ClaimableDocument = `
    query Claimable($playerId: ContractAddress) {
  dopewarsGameModels(where: {player_id: $playerId, registered: true}) {
    edges {
      node {
        game_id
        season_version
        player_id
        player_name {
          value
        }
        hustler_token_id
        reward
        equipment_by_slot
        final_score
      }
    }
  }
}
    `;
export const useClaimableQuery = <
      TData = ClaimableQuery,
      TError = unknown
    >(
      variables?: ClaimableQueryVariables,
      options?: UseQueryOptions<ClaimableQuery, TError, TData>
    ) =>
    useQuery<ClaimableQuery, TError, TData>(
      variables === undefined ? ['Claimable'] : ['Claimable', variables],
      useFetchData<ClaimableQuery, ClaimableQueryVariables>(ClaimableDocument).bind(null, variables),
      options
    );

useClaimableQuery.getKey = (variables?: ClaimableQueryVariables) => variables === undefined ? ['Claimable'] : ['Claimable', variables];
;

export const useInfiniteClaimableQuery = <
      TData = ClaimableQuery,
      TError = unknown
    >(
      variables?: ClaimableQueryVariables,
      options?: UseInfiniteQueryOptions<ClaimableQuery, TError, TData>
    ) =>{
    const query = useFetchData<ClaimableQuery, ClaimableQueryVariables>(ClaimableDocument)
    return useInfiniteQuery<ClaimableQuery, TError, TData>(
      variables === undefined ? ['Claimable.infinite'] : ['Claimable.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteClaimableQuery.getKey = (variables?: ClaimableQueryVariables) => variables === undefined ? ['Claimable.infinite'] : ['Claimable.infinite', variables];
;

export const GameOverEventsDocument = `
    query GameOverEvents($gameOverSelector: String, $version: String) {
  events(last: 1000, keys: [$gameOverSelector, "*", "*", $version]) {
    totalCount
    edges {
      node {
        id
        transactionHash
        keys
        data
        createdAt
      }
    }
  }
}
    `;
export const useGameOverEventsQuery = <
      TData = GameOverEventsQuery,
      TError = unknown
    >(
      variables?: GameOverEventsQueryVariables,
      options?: UseQueryOptions<GameOverEventsQuery, TError, TData>
    ) =>
    useQuery<GameOverEventsQuery, TError, TData>(
      variables === undefined ? ['GameOverEvents'] : ['GameOverEvents', variables],
      useFetchData<GameOverEventsQuery, GameOverEventsQueryVariables>(GameOverEventsDocument).bind(null, variables),
      options
    );

useGameOverEventsQuery.getKey = (variables?: GameOverEventsQueryVariables) => variables === undefined ? ['GameOverEvents'] : ['GameOverEvents', variables];
;

export const useInfiniteGameOverEventsQuery = <
      TData = GameOverEventsQuery,
      TError = unknown
    >(
      variables?: GameOverEventsQueryVariables,
      options?: UseInfiniteQueryOptions<GameOverEventsQuery, TError, TData>
    ) =>{
    const query = useFetchData<GameOverEventsQuery, GameOverEventsQueryVariables>(GameOverEventsDocument)
    return useInfiniteQuery<GameOverEventsQuery, TError, TData>(
      variables === undefined ? ['GameOverEvents.infinite'] : ['GameOverEvents.infinite', variables],
      (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      options
    )};


useInfiniteGameOverEventsQuery.getKey = (variables?: GameOverEventsQueryVariables) => variables === undefined ? ['GameOverEvents.infinite'] : ['GameOverEvents.infinite', variables];
;
