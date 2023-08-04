export function removeAccents(value: string){
  const cleanValue = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return cleanValue
}