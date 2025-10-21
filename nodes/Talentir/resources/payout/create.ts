import type { INodeProperties } from "n8n-workflow";

const showOnlyForPayoutCreate = {
	operation: ["create"],
	resource: ["payout"],
};

export const payoutCreateDescription: INodeProperties[] = [
	{
		displayName: "Description",
		name: "description",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: showOnlyForPayoutCreate,
		},
		description: "Description or reason for the payout",
		routing: {
			send: {
				type: "body",
				property: "description",
			},
		},
	},
	{
		displayName: "Payout Amount",
		name: "payoutAmount",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: showOnlyForPayoutCreate,
		},
		description: "Amount to be paid out (minimum 0.1)",
		routing: {
			send: {
				type: "body",
				property: "payoutAmount",
			},
		},
	},
	{
		displayName: "Currency",
		name: "currency",
		type: "options",
		options: [
			{
				name: "EUR",
				value: "EUR",
			},
			{
				name: "USD",
				value: "USD",
			},
		],
		default: "EUR",
		required: true,
		displayOptions: {
			show: showOnlyForPayoutCreate,
		},
		description: "Currency for the payout",
		routing: {
			send: {
				type: "body",
				property: "currency",
			},
		},
	},
	{
		displayName: "Handle Type",
		name: "handleType",
		type: "options",
		options: [
			{
				name: "TikTok",
				value: "tiktok",
			},
			{
				name: "Instagram",
				value: "instagram",
			},
			{
				name: "YouTube Channel",
				value: "youtube-channel",
			},
			{
				name: "None",
				value: "none",
			},
		],
		default: "tiktok",
		displayOptions: {
			show: showOnlyForPayoutCreate,
		},
		description: "Type of social media platform for the creator handle",
		routing: {
			send: {
				type: "body",
				property: "handleType",
			},
		},
	},
	{
		displayName: "Creator Handle",
		name: "creatorHandle",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				...showOnlyForPayoutCreate,
				handleType: ["tiktok", "instagram", "youtube-channel"],
			},
		},
		description: "Social media handle of the creator (must start with @)",
		routing: {
			send: {
				type: "body",
				property: "creatorHandle",
			},
		},
	},
	{
		displayName: "Email",
		name: "email",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				...showOnlyForPayoutCreate,
				handleType: ["none"],
			},
		},
		required: true,
		description:
			"Email address of the creator (required when handle type is none)",
		routing: {
			send: {
				type: "body",
				property: "email",
			},
		},
	},
	{
		displayName: "Additional Fields",
		name: "additionalFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: showOnlyForPayoutCreate,
		},
		options: [
			{
				displayName: "Phone",
				name: "phone",
				type: "string",
				default: "",
				description: "Phone number of the creator",
				routing: {
					send: {
						type: "body",
						property: "phone",
					},
				},
			},
			{
				displayName: "Tags",
				name: "tags",
				type: "string",
				default: "",
				description: "Comma-separated tags for categorizing the payout",
				routing: {
					send: {
						type: "body",
						property: "tags",
						value: "={{$value.split(',').map(tag => tag.trim())}}",
					},
				},
			},
			{
				displayName: "Custom ID",
				name: "customId",
				type: "string",
				default: "",
				description: "Optional custom identifier for the payout",
				routing: {
					send: {
						type: "body",
						property: "customId",
					},
				},
			},
			{
				displayName: "Payout Type",
				name: "payoutType",
				type: "options",
				options: [
					{
						name: "Manual",
						value: "manual",
					},
					{
						name: "Advance",
						value: "advance",
					},
				],
				default: "manual",
				description:
					"Type of payout - manual or advance (advance only for YouTube channels)",
				routing: {
					send: {
						type: "body",
						property: "payoutType",
					},
				},
			},
		],
	},
];
