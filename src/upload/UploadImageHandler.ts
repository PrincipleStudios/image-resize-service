import { RequestParams, Responses } from '@/api-types/operations/uploadImage';
import { ServerResponse } from '@/shared/server-response';

export interface UploadImageHandler {
	handle(
		params: RequestParams,
		body: Buffer
	): Promise<ServerResponse<Responses>>;
}
