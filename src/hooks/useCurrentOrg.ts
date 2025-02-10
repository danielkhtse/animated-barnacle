"use client";

import { useState, useEffect } from "react";

export const useCurrentOrg = () => {
	const [currentOrg, setCurrentOrgState] = useState<{
		id?: string;
		name?: string;
	}>({});

	useEffect(() => {
		const stored = localStorage.getItem("currentOrg");
		if (stored) {
			setCurrentOrgState(JSON.parse(stored));
		}
	}, []);

	const setCurrentOrg = (org: { id: string; name: string }) => {
		localStorage.setItem("currentOrg", JSON.stringify(org));
		setCurrentOrgState(org);
		// Refresh to apply new org context
		window.location.reload();
	};

	return {
		id: currentOrg?.id,
		name: currentOrg?.name,
		setCurrentOrg,
	};
};
