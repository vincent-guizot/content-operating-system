import { useState } from "react";

export default function useSearch(data, fields = []) {
  const [query, setQuery] = useState("");

  const filteredData = data.filter((item) =>
    fields.some((field) =>
      String(item[field]).toLowerCase().includes(query.toLowerCase()),
    ),
  );

  return {
    query,
    setQuery,
    filteredData,
  };
}
