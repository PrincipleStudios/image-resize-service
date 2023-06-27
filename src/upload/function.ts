import { container } from '@/main/function-entry';
import {
	app,
	HttpRequest,
	HttpResponseInit,
	InvocationContext,
} from '@azure/functions';
import { RequestParams } from '@/api-types/operations/uploadImage';
import { badRequest, writeResponse } from '@/shared/write-function-response';
import { inputFormat, type InputFormat } from '@/api-types/models/InputFormat';
import { UploadImageHandler } from './UploadImageHandler';

export async function upload(
	request: HttpRequest,
	context: InvocationContext
): Promise<HttpResponseInit> {
	context.log(`Http function processed request for url "${request.url}"`);

	if (!request.body) {
		context.log(`Request failed: ${request.bodyUsed}`, request.body);
		return badRequest('No body provided to azure function');
	}

	const requestParams = {
		sha: request.query.get('sha'),
		format: request.query.get('format') as InputFormat,
	};
	if (!inputFormat.includes(requestParams.format)) {
		return badRequest('Invalid format');
	}
	if (!requestParams.sha || requestParams.sha.length !== 40) {
		return badRequest('Invalid sha');
	}

	const uploadImageHandler =
		container.resolve<UploadImageHandler>('uploadImage');

	const bodyBuffer = Buffer.from(await request.arrayBuffer());

	const result = await uploadImageHandler.handle(
		requestParams as RequestParams,
		bodyBuffer
	);

	return writeResponse(result);
}

app.http('upload', {
	methods: ['PUT'],
	authLevel: 'function',
	handler: upload,
});
