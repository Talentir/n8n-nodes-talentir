import type {
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	JsonObject,
} from "n8n-workflow";
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from "n8n-workflow";
import { talentirApiRequest } from "./shared/transport";

export class TalentirTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Talentir Trigger",
		name: "talentirTrigger",
		icon: {
			light: "file:../../icons/talentir.svg",
			dark: "file:../../icons/talentir.dark.svg",
		},
		group: ["trigger"],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: "Listen for Talentir webhook events",
		defaults: {
			name: "Talentir Trigger",
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: "talentirApi",
				required: true,
			},
		],
		webhooks: [
			{
				name: "default",
				httpMethod: "POST",
				responseMode: "onReceived",
				path: "webhook",
			},
		],
		properties: [
			{
				displayName: "Event",
				name: "event",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Payout",
						value: "payout",
						description: "Triggered when payout status changes",
					},
				],
				default: "payout",
				description: "The event type to listen for",
			},
			{
				displayName: "Environment",
				name: "environment",
				type: "options",
				noDataExpression: true,
				options: [
					{ name: "Production", value: "production" },
					{ name: "Sandbox", value: "sandbox" },
				],
				default: "production",
				description:
					"Which Talentir environment to subscribe to. Required by the webhook API.",
			},
		],
		usableAsTool: true,
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData("node");

				// If we have a stored webhook ID, the webhook exists
				if (webhookData.webhookId) {
					return true;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl("default");
				const event = this.getNodeParameter("event") as string;
				const environment = this.getNodeParameter("environment") as string;

				if (!webhookUrl) {
					throw new NodeOperationError(
						this.getNode(),
						"Unable to get webhook URL",
					);
				}

				const body = {
					targetUrl: webhookUrl,
					eventType: event,
					environment,
				};

				try {
					const response = await talentirApiRequest.call(
						this,
						"POST",
						"/webhook",
						{},
						body,
					);

					// Store the webhook ID for later deletion
					const webhookData = this.getWorkflowStaticData("node");
					webhookData.webhookId = response.id;

					return true;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData("node");
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					// No webhook to delete
					return true;
				}

				try {
					await talentirApiRequest.call(
						this,
						"DELETE",
						`/webhook/${webhookId}`,
					);

					// Clear the stored webhook ID
					delete webhookData.webhookId;

					return true;
				} catch (error) {
					// If the webhook doesn't exist (404), consider it a success
					if (error instanceof Error && error.message.includes("404")) {
						delete webhookData.webhookId;
						return true;
					}

					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		// The webhook payload from Talentir contains:
		// - customId: string | null
		// - uuid: string
		// - status: created | approved | completed | deleted | expired
		// - message: string
		// - url: string

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
