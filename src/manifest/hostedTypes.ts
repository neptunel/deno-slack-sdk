export interface ISlackManifestHosted {
  slackHosted?: true; // maps to function_runtime = "slack" in ManifestSchema, optional since the apps are slack hosted by default
  features?: ISlackManifestHostedFeaturesSchema;
}

// ISlackManifestHostedFeaturesSchema for Slack Hosted Apps

export interface ISlackManifestHostedFeaturesSchema {
  appHome?: SlackManifestFeaturesAppHome;
}
export type SlackManifestFeaturesAppHome = ManifestAppHomeSchema;

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
