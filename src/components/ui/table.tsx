import { cn } from "@/lib/utils";
import * as React from "react";

export function Table({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full min-w-[600px] overflow-x-auto">
      <table
        className={cn(
          "courses-list w-full min-w-[600px] caption-bottom text-sm sm:min-w-0",
          className,
        )}
        {...props}
        onClick={onClick}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
      onClick={onClick}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t bg-neutral-100/50 font-medium dark:bg-neutral-800/50 [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-neutral-100/50 data-[state=selected]:bg-neutral-100 dark:border-dark-3 dark:hover:bg-dark-2 dark:data-[state=selected]:bg-neutral-800",
        className,
      )}
      {...props}
      onClick={onClick}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle text-sm font-bold text-neutral-500 dark:text-neutral-400 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "p-3 align-middle text-sm [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}
