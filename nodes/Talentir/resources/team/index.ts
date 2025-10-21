import type { INodeProperties } from "n8n-workflow";
import { teamGetDescription } from "./get";

const showOnlyForTeam = {
	resource: ["team"],
};

export const teamDescription: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTeam,
		},
		options: [
			{
				name: "Get",
				value: "get",
				action: "Get team information",
				description: "Retrieve team information for the authenticated team",
				routing: {
					request: {
						method: "GET",
						url: "/team",
					},
				},
			},
		],
		default: "get",
	},
	...teamGetDescription,
];

