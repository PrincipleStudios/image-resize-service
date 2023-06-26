import { container } from '@/main/function-entry';
import {
	app,
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from '@azure/functions';
import {
	RequestParams,
	Responses,
} from '@/api-types/operations/generateImageFormat';
import { ServerResponse } from '@/interfaces/server-response';
import {
	badRequest,
	writeResponse,
} from '@/interfaces/write-function-response';
import {
	outputFormat,
	type OutputFormat,
} from '@/api-types/models/OutputFormat';

export interface GenerateImageFormatHandler {
	handle(params: RequestParams): Promise<ServerResponse<Responses>>;
}

export async function generate(
	request: HttpRequest,
	context: InvocationContext
): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const requestParams = {
		groupId: request.query.get('groupId'),
		width: parseInt(request.query.get('width') ?? '', 10),
		height: parseInt(request.query.get('height') ?? '', 10),
		sha: request.query.get('sha'),
		format: request.query.get('format') as OutputFormat,
	};
	if (!outputFormat.includes(requestParams.format)) {
		return badRequest('Invalid format');
	}
	if (!requestParams.groupId) {
		return badRequest('Invalid groupId');
	}
	if (requestParams.width <= 0) {
		return badRequest('Invalid width');
	}
	if (requestParams.height <= 0) {
		return badRequest('Invalid height');
	}
	if (!requestParams.sha || requestParams.sha.length !== 40) {
		return badRequest('Invalid sha');
	}

	const generateImageFormatHandler =
		container.resolve<GenerateImageFormatHandler>('generateImageFormat');
	const result = await generateImageFormatHandler.handle(
		requestParams as RequestParams
	);

	return writeResponse(result);
}

app.http('generate', {
	methods: ['GET'],
	authLevel: 'function',
	handler: generate,
});
