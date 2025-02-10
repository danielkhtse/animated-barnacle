import { NextApiRequest, NextApiResponse } from "next";
import { fetchFromAPI } from "@/lib/api";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const path = req.query.path as string[];
		const endpoint = `/${path.join("/")}`;

		// Forward the request method, body, and headers
		const response = await fetchFromAPI(endpoint, {
			method: req.method,
			body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
			headers: req.headers as HeadersInit,
		});

		res.status(200).json(response);
	} catch (error) {
		console.error("API Proxy Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
