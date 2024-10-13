export function removeAccents(value: string) {
	// biome-ignore lint/suspicious/noMisleadingCharacterClass: -
	const cleanValue = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return cleanValue;
}
