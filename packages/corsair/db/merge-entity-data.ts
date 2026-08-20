/**
 * Shallow-merge entity JSON for upserts. Incoming fields override existing
 * ones; `undefined` in incoming is ignored so partial writes (e.g. webhooks)
 * do not wipe fields populated by a prior full sync.
 */
export function mergeEntityData(
	existing: Record<string, unknown>,
	incoming: Record<string, unknown>,
): Record<string, unknown> {
	const merged = { ...existing };
	for (const [key, value] of Object.entries(incoming)) {
		if (value !== undefined) {
			merged[key] = value;
		}
	}
	return merged;
}

export function mergeEntityDataFromUnknown(
	existing: unknown,
	incoming: Record<string, unknown>,
): Record<string, unknown> {
	if (
		existing !== null &&
		typeof existing === 'object' &&
		!Array.isArray(existing)
	) {
		return mergeEntityData(existing as Record<string, unknown>, incoming);
	}
	return { ...incoming };
}
