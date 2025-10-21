import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from "n8n-workflow";

export class TalentirApi implements ICredentialType {
	name = "talentirApi";

	displayName = "Talentir API";

	icon: Icon = {
		light: "file:../icons/talentir.svg",
		dark: "file:../icons/talentir.dark.svg",
	};

	documentationUrl = "https://www.talentir.com/api/v1";

	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: { password: true },
			default: "",
			required: true,
			description: "Your Talentir team API key",
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "=Bearer {{$credentials?.apiKey}}",
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://www.talentir.com/api/v1",
			url: "/team",
			method: "GET",
		},
	};
}
