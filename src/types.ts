import type { ISlackFunction } from "./functions/types.ts";
import type { ISlackWorkflow } from "./workflows/types.ts";
import type { ISlackDatastore } from "./datastore/types.ts";
import type {
  ParameterDefinition,
  ParameterSetDefinition,
} from "./parameters/mod.ts";
import type { ICustomType } from "./types/types.ts";
// import type { CamelCasedPropertiesDeep } from "./types_utils/camel-case.ts";

export type {
  BaseSlackFunctionHandler,
  FunctionHandler, // Deprecated
  SlackFunctionHandler,
} from "./functions/types.ts";

/** User-facing manifest definition.
 *
 * SlackManifestType contains affordances for better user experience (e.g slackHosted property)
 * The lower level ManifestSchema aligns with Slack API
 *
 * A discriminated union where the discriminant property slackHosted
 * maps to function_runtime in the underlying ManifestSchema.
 */
export type SlackManifestType =
  | ISlackManifestHosted
  | ISlackManifestRemote;

/* Shared manifest properties */
interface ISlackManifestShared {
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

/** Slack-hosted app manifest
 *
 * When slackHosted = true
 * Corresponds to function_runtime = slack in ManifestSchema.
 */
export interface ISlackManifestHosted extends ISlackManifestShared {
  slackHosted?: true; // maps to function_runtime = "slack" in ManifestSchema, optional since the apps are slack hosted by default
  outgoingDomains?: Array<string>;
  features?: ISlackManifestHostedFeaturesSchema;
}
/** non-Slack hosted app manifest
 *
 * When slackHosted = false.
 * Corresponds to function_runtime = slack in ManifestSchema.
 */
export interface ISlackManifestRemote extends ISlackManifestShared {
  slackHosted: false; // maps to function_runtime = "remote" in ManifestSchema

  settings?: Omit<
    ManifestSettingsSchema,
    | "function_runtime"
    | "event_subscriptions"
    | "socket_mode_enabled"
    | "token_rotation_enabled"
  >; // lifting omitted properties to top level
  eventSubscriptions?: ManifestEventSubscriptionsSchema;
  socketModeEnabled?: boolean;
  tokenRotationEnabled?: boolean;
  appDirectory?: ManifestAppDirectorySchema;
  userScopes?: Array<string>;
  redirectUrls?: Array<string>;
  tokenManagementEnabled?: boolean;
  features?: ISlackManifestRemoteFeaturesSchema;
}

// Features
export interface ISlackManifestRemoteFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
  botUser?: Omit<ManifestBotUserSchema, "display_name">;
  shortcuts?: ManifestShortcutsSchema;
  slashCommands?: ManifestSlashCommandsSchema;
  unfurlDomains?: ManifestUnfurlDomainsSchema;
  workflowSteps?: ManifestWorkflowStepsSchemaLegacy;
}

export interface ISlackManifestHostedFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
}

export type ManifestAppHomeSchema = AppHomeMessagesTab & {
  home_tab_enabled?: boolean;
};

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
  title?: string;
  description?: string;
  source_file: string;
  input_parameters: ManifestFunctionParameters;
  output_parameters: ManifestFunctionParameters;
};

export type ManifestCustomTypeSchema = ParameterDefinition;

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

// Features

//ManifestFeaturesSchema for Remote Hosted Apps(ISlackManifestRemote)

export type ManifestBotUserSchema = {
  display_name: string;
  always_online?: boolean;
};

// Utility type for the array types which requires minumum one subtype in it.
export type PopulatedArray<T> = [T, ...T[]];
export type ManifestShortcutSchema = {
  name: string;
  type: "message" | "global";
  callback_id: string;
  description: string;
};

export type ManifestShortcutsSchema = PopulatedArray<ManifestShortcutSchema>;

export type ManifestSlashCommandSchema = {
  command: string;
  url?: string;
  description: string;
  usage_hint?: string;
  should_escape?: boolean;
};

export type ManifestSlashCommandsSchema = PopulatedArray<
  ManifestSlashCommandSchema
>;

export type ManifestUnfurlDomainsSchema = [string, ...string[]];

// Refers to the Workflow Step supported in platform 2.0 currently
// This is distinct from the ManifestWorkflowStepSchema defined elsewhere
export type ManifestWorkflowStepLegacy = {
  name: string;
  callback_id: string;
};

export type ManifestWorkflowStepsSchemaLegacy = PopulatedArray<
  ManifestWorkflowStepLegacy
>;

export interface ManifestFeaturesSchema {
  bot_user?: ManifestBotUserSchema;
  app_home: ManifestAppHomeSchema;
  shortcuts?: ManifestShortcutsSchema;
  slash_commands?: ManifestSlashCommandsSchema;
  unfurl_domains?: ManifestUnfurlDomainsSchema;
  workflow_steps?: ManifestWorkflowStepsSchemaLegacy;
}

// App Directory
export type ManifestAppDirectorySchema = {
  app_directory_categories?: string[];
  use_direct_install?: boolean;
  direct_install_url?: string;
  installation_landing_page: string;
  privacy_policy_url: string;
  support_url: string;
  support_email: string;
  supported_languages: [string, ...string[]];
  pricing: string;
};

// Settings
export type ManifestInteractivitySchema = {
  is_enabled: boolean;
  request_url?: string;
  message_menu_options_url?: string;
};

export type ManifestEventSubscriptionsSchema = {
  request_url?: string;
  user_events?: string[];
  bot_events?: string[];
  metadata_subscriptions?: [
    {
      app_id: string;
      event_type: string;
    },
    ...{
      app_id: string;
      event_type: string;
    }[],
  ];
};

export type ManifestSiwsLinksSchema = {
  initiate_uri?: string;
};

export type ManifestSettingsSchema = {
  allowed_ip_address_ranges?: [string, ...string[]];
  event_subscriptions?: ManifestEventSubscriptionsSchema;
  incoming_webhooks?: boolean;
  interactivity?: ManifestInteractivitySchema;
  org_deploy_enabled?: boolean;
  socket_mode_enabled?: boolean;
  token_rotation_enabled?: boolean;
  siws_links?: ManifestSiwsLinksSchema;
  function_runtime?: string;
};

// Display Information
export type ManifestDisplayInformationSchema = {
  name: string;
  description?: string;
  background_color?: string;
  long_description?: string;
};
//Oauth Config
export type ManifestOauthConfigSchema = {
  scopes: {
    bot?: string[];
    user?: string[];
  };
  redirect_urls?: string[];
  token_management_enabled?: boolean;
};

export type ManifestCustomTypesSchema = {
  [key: string]: ManifestCustomTypeSchema;
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

// Utility
export type SlackManifestFromType<T extends boolean> = Extract<
  SlackManifestType,
  { slackHosted: T }
>;
