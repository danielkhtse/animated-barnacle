const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchFromAPI(
	endpoint: string,
	options: RequestInit = {}
) {
	const url = `${API_BASE_URL}${endpoint}`;

	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	const response = await fetch(url, {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers,
		},
	});

	if (!response.ok) {
		throw new Error(`API call failed: ${response.statusText}`);
	}

	return response.json();
}
