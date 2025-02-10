import { NextApiRequest, NextApiResponse } from "next";
import { fetchFromAPI } from "@/lib/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const endpoint = `/${
			Array.isArray(req.query.path)
				? req.query.path.join("/")
				: req.query.path
		}`;

		// Forward the request method, body, and headers
		const response = await fetchFromAPI(endpoint, {
			method: req.method,
			body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
			headers: req.headers as HeadersInit,
		});

		if (!response) {
			return res.status(404).json({ error: "Not Found" });
		}

		return res.status(200).json(response);
	} catch (error: any) {
		console.error("API Proxy Error:", error);
		const statusCode = error.status || error.statusCode || 500;
		return res
			.status(statusCode)
			.json({ error: error.message || "Internal Server Error" });
	}
}
