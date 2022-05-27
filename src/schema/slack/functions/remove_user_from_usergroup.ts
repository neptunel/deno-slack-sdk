// /** This is an autogenerated file. Run ./.slack/sdk/schema/slack/functions/_scripts/generate to rebuild **/
// import { DefineFunction } from "../../../functions/mod.ts";
// import SchemaTypes from "../../schema_types.ts";
// import SlackTypes from "../schema_types.ts";

// export default DefineFunction(
//   {
//     callback_id: "slack#/functions/remove_user_from_usergroup",
//     source_file: "",
//     title: "Remove user from user group",
//     description: "Remove someone from a Slack user group.",
//     input_parameters: {
//       required: ["usergroup_id", "user_ids"],
//       properties: {
//         usergroup_id: {
//           type: SlackTypes.usergroup_id,
//           description: "User group",
//         },
//         user_ids: {
//           type: SchemaTypes.array,
//           description: "Users to be removed from user group",
//           items: {
//             type: "slack#/types/user_id",
//           },
//         },
//       },
//     },
//     output_parameters: {
//       required: [],
//       properties: {
//         usergroup_id: {
//           type: SlackTypes.usergroup_id,
//           description: "Updated usergroup",
//         },
//       },
//     },
//   },
// );
