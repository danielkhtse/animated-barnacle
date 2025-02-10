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

	const [queryParams, setQueryParams] = useState<SampleQueryParams>({
		page: {
			offset: pageOffset ? parseInt(pageOffset) : 0,
			limit: pageLimit ? parseInt(pageLimit) : PAGE_SIZE,
		},
		patientName: "",
		sampleId: "",
		activateTime: "",
		resultTime: "",
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

	const handleSearch = (
		e: React.KeyboardEvent<HTMLInputElement>,
		headerId: string
	) => {
		if (e.key === "Enter") {
			setQueryParams({
				...queryParams,
				[headerId]: (e.target as HTMLInputElement).value,
				page: {
					...queryParams.page,
					offset: 0, // Reset to first page when searching
				},
			});
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
		// Update URL query parameters
		router.push(
			`/patients?page[offset]=${prevOffset}&page[limit]=${
				queryParams.page?.limit || PAGE_SIZE
			}`
		);
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
		// Update URL query parameters
		router.push(
			`/patients?page[offset]=${nextOffset}&page[limit]=${
				queryParams.page?.limit || PAGE_SIZE
			}`
		);
	};

	return (
		<div className="container mx-auto py-10">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<React.Fragment key={headerGroup.id}>
								<TableRow className="bg-[var(--primary)] text-white">
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
											<input
												type="text"
												name={
													header.column.columnDef
														.header as keyof SampleQueryParams
												}
												onKeyDown={(e) =>
													handleSearch(e, header.id)
												}
												placeholder={`Filter ${
													header.column.columnDef
														.header as string
												}...`}
												className="w-full border p-2 text-sm"
											/>
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
