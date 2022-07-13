export interface ISlackManifestRemote {
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

  // oauth
  userScopes?: Array<string>;
  redirectUrls?: Array<string>;
  tokenManagementEnabled?: boolean;

  features?: ISlackManifestRemoteFeaturesSchema;
}

export interface ISlackManifestRemoteFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
  botUser?: Omit<ManifestBotUserSchema, "display_name">;
  shortcuts?: ManifestShortcutsSchema;
  slashCommands?: ManifestSlashCommandsSchema;
  unfurlDomains?: ManifestUnfurlDomainsSchema;
  workflowSteps?: ManifestWorkflowStepsSchema;
}
export type ManifestAppHomeSchema = AppHomeMessagesTab & {
  home_tab_enabled?: boolean;
};

// TODO: Find way to share these defaults
type AppHomeMessagesTab = {
  /** @default true */
  messagesTabEnabled?: true;
  /** @default true */
  messagesTabReadOnlyEnabled?: boolean;
} | {
  /** @default true */
  messagesTabEnabled: false;
  /** @default true */
  messagesTabReadOnlyEnabled: false;
};

// Features

//ManifestFeaturesSchema for Remote Hosted Apps(ISlackManifestRemote)

export type ManifestBotUserSchema = {
  display_name: string;
  always_online?: boolean;
};

export interface ManifestFeaturesAppHome {
  home_tab_enabled?: boolean;
  messages_tab_enabled?: boolean;
  messages_tab_read_only_enabled?: boolean;
}

export type ManifestShortcutSchema = {
  name: string;
  type: "message" | "global";
  callback_id: string;
  description: string;
};

export type ManifestShortcutsSchema = [
  ManifestShortcutSchema,
  ...ManifestShortcutSchema[],
];

export type ManifestSlashCommandSchema = {
  command: string;
  url?: string;
  description: string;
  usage_hint?: string;
  should_escape?: boolean;
};

export type ManifestSlashCommandsSchema = [
  ManifestSlashCommandSchema,
  ...ManifestSlashCommandSchema[],
];

export type ManifestUnfurlDomainsSchema = [string, ...string[]];

export type ManifestWorkflowStep = {
  name: string;
  callback_id: string;
};

export type ManifestWorkflowStepsSchema = [
  ManifestWorkflowStep,
  ...ManifestWorkflowStep[],
];

export interface ManifestFeaturesSchema {
  bot_user: ManifestBotUserSchema;
  app_home: ManifestFeaturesAppHome;
  shortcuts?: ManifestShortcutsSchema;
  slash_commands?: ManifestSlashCommandsSchema;
  unfurl_domains?: ManifestUnfurlDomainsSchema;
  workflow_steps?: ManifestWorkflowStepsSchema;
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

//Oauth Config
export type ManifestOauthConfigSchema = {
  scopes: {
    bot?: string[];
    user?: string[];
  };
  redirect_urls?: string[];
  token_management_enabled?: boolean;
};
