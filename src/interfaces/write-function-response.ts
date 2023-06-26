import type { HttpResponseInit } from '@azure/functions/types/http';
import type { ServerResponse } from './server-response';

export function writeResponse(result: ServerResponse): HttpResponseInit {
	return {
		status: result.statusCode,
		headers:
			result.mimeType || result.responseHeaders
				? {
						...result.responseHeaders,
						...(result.mimeType
							? {
									'Content-Type': result.mimeType,
							  }
							: {}),
				  }
				: undefined,
		jsonBody: result.mimeType === 'application/json' ? result.data : undefined,
	};
}

export function badRequest(message: string) {
	return {
		status: 400,
		body: message,
	};
}
