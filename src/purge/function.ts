import { container } from '@/main/function-entry';
import {
	app,
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from '@azure/functions';
import { RequestParams } from '@/api-types/operations/purgeGroup';
import { badRequest, writeResponse } from '@/shared/write-function-response';
import { PurgeGroupHandler } from './PurgeGroupHandler';

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
