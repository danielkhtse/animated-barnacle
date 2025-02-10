"use client";

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
	PaginationLink,
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
import { useSample } from "@/hooks/useSample";
import { format } from "date-fns";
import { Sample } from "@/types/sample";
import { Profile } from "@/types/profile";
import { useCurrentOrg } from "@/hooks/useCurrentOrg";

type EnhancedSample = Sample & { profile: Profile };

const columnHelper = createColumnHelper<EnhancedSample>();

const columns = [
	columnHelper.accessor((row) => row.profile?.attributes.name, {
		id: "patientName",
		header: "Patient Name",
		cell: (info) => info.getValue() || "N/A",
	}),
	columnHelper.accessor((row) => row.attributes.sampleId, {
		id: "sampleBarcode",
		header: "Sample Barcode",
	}),
	columnHelper.accessor((row) => row.attributes.activateTime, {
		id: "activationDate",
		header: "Activation Date",
		cell: (info) => format(new Date(info.getValue()), "PPP"),
	}),
	columnHelper.accessor((row) => row.attributes.resultTime, {
		id: "resultDate",
		header: "Result Date",
		cell: (info) => format(new Date(info.getValue()), "PPP"),
	}),
	columnHelper.accessor((row) => row.attributes.result, {
		id: "resultValue",
		header: "Result Value",
	}),
];

export default function PatientManagementPage() {
	const { id: selectedOrgId } = useCurrentOrg();

	const { data, isLoading, isError } = useSample(selectedOrgId); // Replace with actual org ID
	const table = useReactTable({
		data:
			data?.data?.map((sample) => ({
				...sample,
				profile: sample.relationships.profile?.data
					? data.included?.find(
							(included) =>
								included.type === "profile" &&
								included.id ===
									sample.relationships.profile.data.id
					  )
					: undefined,
			})) || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 15,
			},
		},
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading data</div>;

	return (
		<div className="container mx-auto py-10">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
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

			<div className="mt-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => table.previousPage()}
								isDisabled={!table.getCanPreviousPage()}
							/>
						</PaginationItem>
						{Array.from(
							{ length: table.getPageCount() },
							(_, i) => (
								<PaginationItem key={i}>
									<PaginationLink
										onClick={() => table.setPageIndex(i)}
										isActive={
											table.getState().pagination
												.pageIndex === i
										}>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							)
						)}
						<PaginationItem>
							<PaginationNext
								onClick={() => table.nextPage()}
								isDisabled={!table.getCanNextPage()}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
