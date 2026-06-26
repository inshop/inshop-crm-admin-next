"use client";

import * as React from "react";
import PageList from "@/components/PageList";
import {
  columnsList,
  columnsDetails,
  formFields,
} from "./columns";

interface ListType {
  title: string;
  entity: string;
}

export default function List({ title, entity }: ListType) {
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
