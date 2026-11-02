type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>;

/**
 * Renders schema.org JSON-LD. The `<` escape prevents a string in the data
 * from closing the script tag.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
