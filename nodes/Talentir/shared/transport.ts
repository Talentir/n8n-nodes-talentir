import type {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from "n8n-workflow";

export async function talentirApiRequest(
	this:
		| IHookFunctions
		| IExecuteFunctions
		| IExecuteSingleFunctions
		| ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
) {
	const options: IHttpRequestOptions = {
		method: method,
		qs,
		body,
		url: `https://www.talentir.com/api/v1${resource}`,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(
		this,
		"talentirApi",
		options,
	);
}

