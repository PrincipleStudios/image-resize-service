import {
	RequestParams,
	Responses,
} from '@/api-types/operations/generateImageFormat';
import { ServerResponse } from '@/shared/server-response';

export interface GenerateImageFormatHandler {
	handle(params: RequestParams): Promise<ServerResponse<Responses>>;
}
