"use client";

export const useCurrentOrg = () => {
	const currentOrg = JSON.parse(localStorage.getItem("currentOrg") || "{}");

	const setCurrentOrg = (org: { id: string; name: string }) => {
		localStorage.setItem("currentOrg", JSON.stringify(org));
		// Refresh to apply new org context
		window.location.reload();
	};

	return {
		id: currentOrg?.id,
		currentOrg,
		setCurrentOrg,
	};
};
