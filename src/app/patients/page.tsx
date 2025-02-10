"use client";

import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	createColumnHelper,
} from "@tanstack/react-table";
import { SampleQueryParams, useSample } from "@/hooks/useSample";
import { format } from "date-fns";
import { Sample } from "@/types/sample";
import { useCurrentOrg } from "@/hooks/useCurrentOrg";
import { useSearchParams, useRouter } from "next/navigation";

const columnHelper = createColumnHelper<Sample>();

const columns = [
	columnHelper.accessor((row) => row.patientName, {
		id: "patientName",
		header: "Patient Name",
		cell: (info) => info.getValue() || "N/A",
	}),
	columnHelper.accessor((row) => row.sampleBarcode, {
		id: "sampleBarcode",
		header: "Sample Barcode",
	}),
	columnHelper.accessor((row) => row.activationDate, {
		id: "activationDate",
		header: "Activation Date",
		cell: (info) => format(new Date(info.getValue()), "yyyy-MM-dd HH:mm"),
	}),
	columnHelper.accessor((row) => row.resultDate, {
		id: "resultDate",
		header: "Result Date",
		cell: (info) => format(new Date(info.getValue()), "yyyy-MM-dd HH:mm	"),
	}),
	columnHelper.accessor((row) => row.resultValue, {
		id: "resultValue",
		header: "Result Value",
	}),
];

const PAGE_SIZE = 15;

export default function PatientManagementPage() {
	const { id: currentOrgId } = useCurrentOrg();
	const router = useRouter();

	const searchParams = useSearchParams();
	const pageOffset = searchParams?.get("page[offset]") ?? null;
	const pageLimit = searchParams?.get("page[limit]") ?? null;
	const queryPatientName = searchParams?.get("patientName") ?? null;
	const querySampleId = searchParams?.get("sampleId") ?? null;
	const queryActivateTime = searchParams?.get("activateTime") ?? null;
	const queryResultTime = searchParams?.get("resultTime") ?? null;
	const queryResultValue = searchParams?.get("resultValue") ?? null;
	const [queryParams, setQueryParams] = useState<SampleQueryParams>({
		page: {
			offset: pageOffset ? parseInt(pageOffset) : 0,
			limit: pageLimit ? parseInt(pageLimit) : PAGE_SIZE,
		},
		patientName: queryPatientName ?? "",
		sampleId: querySampleId ?? "",
		activateTime: queryActivateTime ?? "",
		resultTime: queryResultTime ?? "",
		resultValue: queryResultValue ?? "",
	});

	const { data, isLoading, isError } = useSample(currentOrgId, queryParams);
	const table = useReactTable({
		data: data?.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		pageCount: Math.ceil((data?.meta?.total || 0) / PAGE_SIZE),
		state: {
			pagination: {
				pageSize: queryParams.page?.limit || PAGE_SIZE,
				pageIndex:
					(queryParams.page?.offset || 0) /
					(queryParams.page?.limit || PAGE_SIZE),
			},
		},
		manualPagination: true,
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading data</div>;

	const buildUrl = (params: SampleQueryParams, offset?: number) => {
		const urlParams = new URLSearchParams();
		const paramsWithOffset = {
			...params,
			page: {
				...params.page,
				offset: offset ?? 0, // Use provided offset or default to 0
			},
		};

		urlParams.append(
			"page[offset]",
			paramsWithOffset.page.offset.toString()
		);
		urlParams.append(
			"page[limit]",
			(paramsWithOffset.page?.limit || PAGE_SIZE).toString()
		);

		// Only append non-empty search params
		if (paramsWithOffset.patientName) {
			urlParams.append("patientName", paramsWithOffset.patientName);
		}
		if (paramsWithOffset.sampleId) {
			urlParams.append("sampleId", paramsWithOffset.sampleId);
		}
		if (paramsWithOffset.activateTime) {
			urlParams.append("activateTime", paramsWithOffset.activateTime);
		}
		if (paramsWithOffset.resultTime) {
			urlParams.append("resultTime", paramsWithOffset.resultTime);
		}

		return `/patients?${urlParams.toString()}`;
	};

	const getInputText = (headerId: string) => {
		switch (headerId) {
			case "patientName":
				return queryParams.patientName || "";
			case "sampleBarcode":
				return queryParams.sampleId || "";
			case "activationDate":
				return queryParams.activateTime || "";
			case "resultDate":
				return queryParams.resultTime || "";
			case "resultValue":
				return queryParams.resultValue || "";
			default:
				return "";
		}
	};

	const handleSearch = (
		e: React.KeyboardEvent<HTMLInputElement>,
		headerId: string
	) => {
		console.log(e);
		console.log(headerId);
		if (e.key === "Enter") {
			setQueryParams({
				...queryParams,
				[headerId]: (e.target as HTMLInputElement).value,
				page: {
					...queryParams.page,
					offset: 0, // Reset to first page when searching
				},
			});

			router.push(buildUrl(queryParams, 0));
		}
	};

	const handlePreviousPage = () => {
		const prevOffset = Math.max(
			(queryParams.page?.offset || 0) -
				(queryParams.page?.limit || PAGE_SIZE),
			0
		);
		setQueryParams({
			...queryParams,
			page: {
				...queryParams.page,
				offset: prevOffset,
			},
		});
		router.push(buildUrl(queryParams, prevOffset));
	};

	const handleNextPage = () => {
		const nextOffset =
			(queryParams.page?.offset || 0) +
			(queryParams.page?.limit || PAGE_SIZE);
		setQueryParams({
			...queryParams,
			page: {
				...queryParams.page,
				offset: nextOffset,
			},
		});
		router.push(buildUrl(queryParams, nextOffset));
	};

	const handleClear = (headerId: string) => {
		setQueryParams({
			...queryParams,
			[headerId]: "",
			page: {
				...queryParams.page,
				offset: 0, // Reset to first page when clearing
			},
		});
		router.push(buildUrl({ ...queryParams, [headerId]: "" }, 0));
	};

	return (
		<div className="container mx-auto py-10">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<React.Fragment key={headerGroup.id}>
								<TableRow className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/50 data-[state=selected]:bg-[var(--primary)]">
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</TableHead>
									))}
								</TableRow>
								<TableRow>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											<div className="relative">
												<input
													type="text"
													name={
														header.column.columnDef
															.header as keyof SampleQueryParams
													}
													onKeyDown={(e) =>
														handleSearch(
															e,
															header.id
														)
													}
													defaultValue={
														getInputText(
															header.id
														) ?? ""
													}
													placeholder={`Filter ${
														header.column.columnDef
															.header as string
													}...`}
													className="w-full border p-2 text-sm pr-8"
												/>
												{getInputText(header.id) && (
													<button
														onClick={() =>
															handleClear(
																header.id
															)
														}
														className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															className="w-4 h-4">
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M6 18L18 6M6 6l12 12"
															/>
														</svg>
													</button>
												)}
											</div>
										</TableHead>
									))}
								</TableRow>
							</React.Fragment>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row, index) => (
							<TableRow
								key={row.id}
								className={
									index % 2 === 0
										? "bg-gray-100"
										: "bg-gray-300"
								}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="mt-4 flex items-center justify-end gap-4">
				<div className="text-sm text-muted-foreground">
					{(data?.meta?.total || 0).toLocaleString()} records in total
				</div>
				<div className="w-[500px]">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={
										table.getCanPreviousPage()
											? handlePreviousPage
											: undefined
									}
									className={
										table.getCanPreviousPage()
											? "cursor-pointer"
											: "cursor-not-allowed opacity-50"
									}
								/>
							</PaginationItem>
							<div className="text-sm text-muted-foreground">
								Page {table.getState().pagination.pageIndex + 1}{" "}
								of {table.getPageCount()}
							</div>
							<PaginationItem>
								<PaginationNext
									aria-disabled={!table.getCanNextPage()}
									onClick={
										table.getCanNextPage()
											? handleNextPage
											: undefined
									}
									className={
										table.getCanNextPage()
											? "cursor-pointer"
											: "cursor-not-allowed opacity-50"
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
}
