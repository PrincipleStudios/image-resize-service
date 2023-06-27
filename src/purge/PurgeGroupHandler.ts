import { RequestParams, Responses } from '@/api-types/operations/purgeGroup';
import { ServerResponse } from '@/shared/server-response';

export interface PurgeGroupHandler {
	handle(params: RequestParams): Promise<ServerResponse<Responses>>;
}
