import type { ISlackFunction } from "./functions/types.ts";
import type { ISlackWorkflow } from "./workflows/types.ts";
import type { ISlackDatastore } from "./datastore/types.ts";
import type {
  ParameterDefinition,
  ParameterSetDefinition,
} from "./parameters/mod.ts";
import type { ICustomType } from "./types/types.ts";

// SlackManifestType is the top level type that imports all resources for the app
// An app manifest is generated based on what this has defined in it

export type {
  BaseSlackFunctionHandler,
  FunctionHandler, // Deprecated
  SlackFunctionHandler,
} from "./functions/types.ts";

export type SlackManifestType =
  | SlackManifestPlatform2_0
  | SlackManifestPlatform1_0;

export interface SlackManifestPlatform2_0 {
  appHostingProvider: "slack";
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

export interface SlackManifestPlatform1_0 {
  appHostingProvider: "other";
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
  // Properties below are features supported in Platform1.0
  userScopes?: Array<string>;
  redirectUrls?: Array<string>;
  tokenManagementEnabled?: boolean;
  features?: ManifestFeaturesPlatform1_0;
}

// SlackManifestFromType is a type function which takes a string value of T.
// It looks at the SlackManifestType which is a discriminated union.
// The function returns the type whose discriminant property (appHostingProvider) matches T
export type SlackManifestFromType<T extends string> = Extract<
  SlackManifestType,
  { appHostingProvider: T }
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
    "bot_access_token": string;
    "variables": Record<string, string>;
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
  "source_file": string;
  "input_parameters": ManifestFunctionParameters;
  "output_parameters": ManifestFunctionParameters;
};

export type ManifestDatastoreSchema = {
  "primary_key": string;
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

export type ManifestWorkflowStepSchema = {
  id: string;
  "function_id": string;
  inputs: {
    [name: string]: unknown;
  };
};

export type ManifestWorkflowSchema = {
  title?: string;
  description?: string;
  "input_parameters"?: ManifestFunctionParameters;
  steps: ManifestWorkflowStepSchema[];
};

export type ManifestBotUser = {
  "display_name": string;
  "always_online"?: boolean;
};
export type ManifestCustomTypeSchema = ParameterDefinition;

export type ManifestMetadata = {
  "major_version"?: number;
  "minor_version"?: number;
};

export type ManifestAppHome = {
  "home_tab_enabled"?: boolean;
  "messages_tab_enabled"?: boolean;
  "messages_tab_read_only_enabled"?: boolean;
};

export type ManifestShortcut = {
  name: string;
  type: "message" | "global";
  "callback_id": string;
  description: string;
};

export type ManifestShortcuts = [
  ManifestShortcut,
  ...ManifestShortcut[],
];

export type ManifestSlashCommand = {
  command: string;
  url?: string;
  description: string;
  "usage_hint"?: string;
  "should_escape"?: boolean;
};

export type ManifestSlashCommands = [
  ManifestSlashCommand,
  ...ManifestSlashCommand[],
];

export type ManifestUnfurlDomains = [string, ...string[]];

export type ManifestWorkflowStep = {
  name: string;
  "callback_id": string;
};

export type ManifestWorkflowSteps = [
  ManifestWorkflowStep,
  ...ManifestWorkflowStep[],
];

export type ManifestAppDirectory = {
  "app_directory_categories"?: string[];
  "use_direct_install"?: boolean;
  "direct_install_url"?: string;
  "installation_landing_page": string;
  "privacy_policy_url": string;
  "support_url": string;
  "support_email": string;
  "supported_languages": [string, ...string[]];
  pricing: string;
};

export type ManifestInteractivity = {
  "is_enabled": boolean;
  "request_url"?: string;
  "message_menu_options_url"?: string;
};

export type ManifestEventSubscriptions = {
  "request_url"?: string;
  "user_events"?: string[];
  "bot_events"?: string[];
  "metadata_subscriptions"?: [
    {
      "app_id": string;
      "event_type": string;
    },
    ...{
      "app_id": string;
      "event_type": string;
    }[],
  ];
};

export type ManifestSiwsLinks = {
  "initiate_uri"?: string;
};

export type ManifestSettings = {
  "allowed_ip_address_ranges"?: [string, ...string[]];
  "event_subscriptions"?: ManifestEventSubscriptions;
  "incoming_webhooks"?: boolean;
  interactivity?: ManifestInteractivity;
  "org_deploy_enabled"?: boolean;
  "socket_mode_enabled"?: boolean;
  "is_hosted"?: boolean;
  "token_rotation_enabled"?: boolean;
  "siws_links"?: ManifestSiwsLinks;
  "function_runtime"?: string;
};

export interface ManifestFeaturesPlatform1_0 {
  appHome?: ManifestAppHome;
  botUser?: ManifestBotUser;
  shortcuts?: ManifestShortcuts;
  slashCommands?: ManifestSlashCommands;
  unfurlDomains?: ManifestUnfurlDomains;
  workflowSteps?: ManifestWorkflowSteps;
}

export type ManifestSchema = {
  "_metadata"?: ManifestMetadata;
  "display_information": {
    "background_color"?: string;
    name: string;
    "long_description"?: string;
    "short_description": string;
  };
  icon: string;
  "oauth_config": {
    scopes: {
      bot?: string[];
      user?: string[];
    };
    "redirect_urls"?: string[];
    "token_management_enabled"?: boolean;
  };
  features: {
    "app_home"?: ManifestAppHome;
    "bot_user"?: ManifestBotUser;
    //functions?
    //schema? //note that down in the final pr
    "shortcuts"?: ManifestShortcuts;
    "slash_commands"?: ManifestSlashCommands;
    "unfurl_domains"?: ManifestUnfurlDomains;
    "workflow_steps"?: ManifestWorkflowSteps;
  };
  functions?: {
    [key: string]: ManifestFunctionSchema;
  };
  workflows?: {
    [key: string]: ManifestWorkflowSchema;
  };
  "outgoing_domains"?: string[];
  types?: {
    [key: string]: ManifestCustomTypeSchema;
  };
  datastores?: {
    [key: string]: ManifestDatastoreSchema;
  };
  //TBD: forms?
};
