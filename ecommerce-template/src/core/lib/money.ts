export function formatMoney(
    amount: number,
    currency: string,
    locale: string = "es-ES"
){
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}