import { NextApiRequest, NextApiResponse } from "next";
import { fetchFromAPI } from "@/lib/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { path, ...searchParams } = req.query;
		const endpoint = `/${Array.isArray(path) ? path.join("/") : path}`;

		// Build query string from remaining search params
		const queryString = new URLSearchParams();
		Object.entries(searchParams).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((v) => queryString.append(key, v));
			} else if (value) {
				queryString.append(key, value.toString());
			}
		});

		const fullEndpoint = `${endpoint}${
			queryString.toString() ? `?${queryString.toString()}` : ""
		}`;

		// Forward the request method, body, and headers
		const response = await fetchFromAPI(fullEndpoint, {
			method: req.method,
			body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
			headers: req.headers as HeadersInit,
		});

		if (!response) {
			return res.status(404).json({ error: "Not Found" });
		}

		return res.status(200).json(response);
	} catch (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		error: any
	) {
		console.error("API Proxy Error:", error);
		const statusCode = error.status || error.statusCode || 500;
		return res
			.status(statusCode)
			.json({ error: error.message || "Internal Server Error" });
	}
}
