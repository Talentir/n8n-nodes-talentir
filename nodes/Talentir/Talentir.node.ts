import type { INodeType, INodeTypeDescription } from "n8n-workflow";
import { payoutDescription } from "./resources/payout";
import { teamDescription } from "./resources/team";

export class Talentir implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Talentir",
		name: "talentir",
		icon: {
			light: "file:../../icons/talentir.svg",
			dark: "file:../../icons/talentir.dark.svg",
		},
		group: ["input"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Interact with the Talentir creator economy platform",
		defaults: {
			name: "Talentir",
		},
		usableAsTool: true,
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "talentirApi",
				required: true,
			},
		],
		requestDefaults: {
			baseURL: "https://www.talentir.com/api/v1",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
		properties: [
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Payout",
						value: "payout",
					},
					{
						name: "Team",
						value: "team",
					},
				],
				default: "payout",
			},
			...payoutDescription,
			...teamDescription,
		],
	};
}
