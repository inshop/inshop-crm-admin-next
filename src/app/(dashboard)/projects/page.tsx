import * as React from "react";
import type { Metadata } from "next";
import PageList from "@/components/PageList";
import {
  columnsList,
  columnsDetails,
  formFields,
} from "@/app/(dashboard)/projects/columns";

const title = "Projects";
const entity = "project";

export const metadata: Metadata = {
  title,
  description: title,
};

export default function Page() {
  return (
    <PageList
      title={title}
      entity={entity}
      columnsList={columnsList}
      columnsDetails={columnsDetails}
      formFields={formFields}
    />
  );
}
