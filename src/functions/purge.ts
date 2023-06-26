import { container } from '@/main/function-entry';
import {
	app,
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from '@azure/functions';
import { RequestParams, Responses } from '@/api-types/operations/purgeGroup';
import { ServerResponse } from '@/interfaces/server-response';
import {
	badRequest,
	writeResponse,
} from '@/interfaces/write-function-response';

export interface PurgeGroupHandler {
	handle(params: RequestParams): Promise<ServerResponse<Responses>>;
}

export async function purge(
	request: HttpRequest,
	context: InvocationContext
): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	const requestParams = {
		groupId: request.query.get('groupId'),
	};
	if (!requestParams.groupId) {
		return badRequest('Invalid groupId');
	}

	const purgeGroupHandler = container.resolve<PurgeGroupHandler>('purgeGroup');
	const result = await purgeGroupHandler.handle(requestParams as RequestParams);

	return writeResponse(result);
}

app.http('purge', {
	methods: ['POST'],
	authLevel: 'function',
	handler: purge,
});
