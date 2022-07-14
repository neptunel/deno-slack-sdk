import type { ISlackManifestShared, ManifestAppHomeSchema } from "./types.ts";

export interface ISlackManifestHosted extends ISlackManifestShared {
  slackHosted?: true; // maps to function_runtime = "slack" in ManifestSchema, optional since the apps are slack hosted by default
  features?: ISlackManifestHostedFeaturesSchema;
}

// ISlackManifestHostedFeaturesSchema for Slack Hosted Apps

export interface ISlackManifestHostedFeaturesSchema {
  appHome?: ManifestAppHomeSchema;
}
