import type { ISlackFunction } from "../functions/types.ts";
import type { ISlackWorkflow } from "../workflows/types.ts";
import type { ISlackDatastore } from "../datastore/types.ts";
import type {
  ParameterDefinition,
  ParameterSetDefinition,
} from "../parameters/mod.ts";
import type { ICustomType } from "../types/types.ts";
import type { ISlackManifestHosted } from "./hostedTypes.ts";
import type {
  ISlackManifestRemote,
  ManifestAppDirectorySchema,
  ManifestFeaturesSchema,
  ManifestOauthConfigSchema,
  ManifestSettingsSchema,
} from "./remoteTypes.ts";
// import { ManifestDisplayInformationSchema } from "../types.ts";
// import type { CamelCasedPropertiesDeep } from "./types_utils/camel-case.ts";

export type {
  BaseSlackFunctionHandler,
  FunctionHandler, // Deprecated
  SlackFunctionHandler,
} from "../functions/types.ts";

/** SlackManifestType describes the shape of the manifest definition provided by
 * the user. An app manifest of type ManifestSchema is generated based on what is
 * defined in it. It does not map 1:1 to the ManifestSchema as it contains affordances
 * for better user experience.
 *
 * Currently a developer has the ability to create their Slack apps in two broad categories.
 * Apps hosted on Slack represented by ISlackManifestHosted interface.
 * Apps hosted somewhere else represented by ISlackManifestRemote interface.
 *
 * This type is a discriminated union where the discriminant property slackHosted
 * maps to function_runtime in the underlying ManifestSchema
 */
export type SlackManifestType =
  | ISlackManifestHosted
  | ISlackManifestRemote;

// ISlackManifestShared represents the common types both ISlackManifestHosted and ISlackManifestRemote includes.
// These two interfaces extends ISlackManifestShared with their own unique properties.
export interface ISlackManifestShared {
  name: string;
  backgroundColor?: string;
  description: string;
  displayName?: string;
  icon: string;
  longDescription?: string;
  botScopes: Array<string>;
  functions?: ManifestFunction[];
  workflows?: ManifestWorkflow[];
  outgoingDomains?: Array<string>;
  types?: ICustomType[];
  datastores?: ManifestDatastore[];
}

/** SlackManifestFromType is a type function which takes a parameterT.
 * It looks at the SlackManifestType which is a discriminated union.
 * The function returns the type whose discriminant property (slackHosted) matches T
 */
export type SlackManifestFromType<T extends boolean> = Extract<
  SlackManifestType,
  { slackHosted: T }
>;

export type ManifestDatastore = ISlackDatastore;

// This is typed liberally at this level but more specifically down further
// This is to work around an issue TS has with resolving the generics across the hierarchy
// deno-lint-ignore no-explicit-any
export type ManifestFunction = ISlackFunction<any, any, any, any>;

export type ManifestWorkflow = ISlackWorkflow;

// ----------------------------------------------------------------------------
// Invocation
// ----------------------------------------------------------------------------

// This is the schema received from the runtime
// TODO: flush this out as we add support for other payloads
export type InvocationPayload<Body> = {
  // TODO: type this out to handle multiple body types
  body: Body;
  context: {
    bot_access_token: string;
    variables: Record<string, string>;
  };
};

// ----------------------------------------------------------------------------
// Env
// ----------------------------------------------------------------------------
export type Env = Record<string, string>;

// ----------------------------------------------------------------------------
// Manifest Schema Types
// These types should reflect exactly what we expect in the manifest schema
// and are what are exported from other parts of the app
// ----------------------------------------------------------------------------

// These map directly to our internal types, basically a pass-through

export type RequiredParameters = {
  [index: number]: string | number | symbol;
};
export type ManifestFunctionParameters = {
  required?: RequiredParameters;
  properties: ParameterSetDefinition;
};
export type ManifestFunctionSchema = {
  //title and description is optional ->source file does not exists
  title?: string;
  description?: string;
  source_file: string;
  input_parameters: ManifestFunctionParameters;
  output_parameters: ManifestFunctionParameters;
};

export type ManifestCustomTypeSchema = ParameterDefinition;
export type ManifestCustomTypesSchema = {
  [key: string]: ManifestCustomTypeSchema;
};

export type ManifestFunctionsSchema = { [key: string]: ManifestFunctionSchema };

export type ManifestDatastoreSchema = {
  primary_key: string;
  attributes: {
    [key: string]: {
      type: string | ICustomType;
      items?: ManifestCustomTypeSchema;
      properties?: {
        [key: string]: ManifestCustomTypeSchema;
      };
    };
  };
};

export type ManifestDataStoresSchema = {
  [key: string]: ManifestDatastoreSchema;
};

export type ManifestWorkflowStepSchema = {
  id: string;
  function_id: string;
  inputs: {
    [name: string]: unknown;
  };
};

export type ManifestWorkflowSchema = {
  title?: string;
  description?: string;
  input_parameters?: ManifestFunctionParameters;
  steps: ManifestWorkflowStepSchema[];
};

export type ManifestWorkflowsSchema = { [key: string]: ManifestWorkflowSchema };

export type ManifestMetadataSchema = {
  major_version?: number;
  minor_version?: number;
};

export type ManifestAppHomeSchema = AppHomeMessagesTab & {
  home_tab_enabled?: boolean;
};

// Display Information
export type ManifestDisplayInformationSchema = {
  name: string;
  description?: string;
  background_color?: string;
  long_description?: string;
};

// TODO: Find way to share these defaults
type AppHomeMessagesTab = {
  /** @default true */
  messages_tab_enabled?: true;
  /** @default true */
  messages_tab_read_only_enabled?: boolean;
} | {
  /** @default true */
  messages_tab_enabled: false;
  /** @default true */
  messages_tab_read_only_enabled: false;
};

export type ManifestSchema = {
  _metadata?: ManifestMetadataSchema;
  settings: ManifestSettingsSchema;
  app_directory?: ManifestAppDirectorySchema;
  display_information: ManifestDisplayInformationSchema;
  icon: string;
  oauth_config: ManifestOauthConfigSchema;
  features: ManifestFeaturesSchema;
  functions?: ManifestFunctionsSchema;
  workflows?: ManifestWorkflowsSchema;
  outgoing_domains?: string[];
  types?: ManifestCustomTypesSchema;
  datastores?: ManifestDataStoresSchema;
};
