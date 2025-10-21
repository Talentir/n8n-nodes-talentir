import type { INodeProperties } from "n8n-workflow";
import { payoutCreateDescription } from "./create";

const showOnlyForPayouts = {
	resource: ["payout"],
};

export const payoutDescription: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPayouts,
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a new payout",
				description: "Create or update a new payout for team members",
				routing: {
					request: {
						method: "POST",
						url: "/payout",
					},
				},
			},
		],
		default: "create",
	},
	...payoutCreateDescription,
];
