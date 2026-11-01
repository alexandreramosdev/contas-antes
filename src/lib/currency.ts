const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatBRL = (cents: number): string => brlFormatter.format(cents / 100);

export const formatPriceInput = (cents: number): string =>
  (cents / 100).toFixed(2).replace(".", ",");

export const parsePriceToCents = (input: string): number | null => {
  const cleaned = input.replace(/R\$/gi, "").trim();

  if (!cleaned || /[^\d.,]/.test(cleaned)) return null;

  const commaIndex = cleaned.lastIndexOf(",");

  if (cleaned.includes(",")) {
    if (commaIndex !== cleaned.indexOf(",")) return null;

    const decimals = cleaned.slice(commaIndex + 1);
    if (!/^\d{0,2}$/.test(decimals)) return null;

    const reais = cleaned.slice(0, commaIndex).replace(/\./g, "");
    if (!/^\d+$/.test(reais)) return null;

    return Number(reais) * 100 + Number(decimals.padEnd(2, "0"));
  }

  const dotIndex = cleaned.lastIndexOf(".");
  const maybeDecimals = cleaned.slice(dotIndex + 1);

  if (dotIndex !== -1 && /^\d{2}$/.test(maybeDecimals)) {
    const reais = cleaned.slice(0, dotIndex).replace(/\./g, "");
    if (!/^\d+$/.test(reais)) return null;

    return Number(reais) * 100 + Number(maybeDecimals);
  }

  const reais = cleaned.replace(/\./g, "");
  if (!/^\d+$/.test(reais)) return null;

  return Number(reais) * 100;
};
